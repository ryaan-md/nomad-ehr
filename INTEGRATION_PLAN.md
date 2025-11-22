# Integration Plan

This document maps current UI actions to future API endpoints.

## API Endpoints

### Authentication / Session
*   **POST** `/api/auth/unlock`
    *   *Request*: 
        ```typescript
        {
          patient: { name: string, dob: string, threeWords: string[] },
          accessor: { name: string, dob: string, threeWords: string[] },
          role: 'patient' | 'clinician'
        }
        ```
        *   *Note: Current UI collects single identity with role selector. Future UI should collect Patient + Accessor separately as intended by the two-party model.*
    *   *Response*: 
        ```typescript
        {
          token: string,        // JWT session token
          session: UserSession, // { name, role, threeWords }
          recordId: string      // Patient record ID
        }
        ```
    *   *UI Action*: `pages/Access.tsx` -> `handleSubmit()` -> `DecryptOverlay` -> `onDecryptComplete()` -> `login()` in `AppContext.tsx`
    *   *Code Location*: Replace mock `setTimeout` in `AppContext.login()` function (lines 35-44)

### Records
*   **GET** `/api/records/:id`
    *   *Headers*: `Authorization: Bearer <token>`, `X-Nomad-Accessor-Name: <name>`, `X-Nomad-Accessor-Role: <role>`
    *   *Response*: `PatientRecord` (JSON)
    *   *UI Action*: `AppContext.tsx` -> `login()` (fetch record after auth)
    *   *Code Location*: Replace mock `MOCK_RECORD` initialization in `AppContext.login()` (line 40)

*   **POST** `/api/records/:id/commit-structured`
    *   *Purpose*: Update a structured field (e.g., Allergies, Medications, Demographics, History).
    *   *Headers*: `Authorization: Bearer <token>`, `X-Nomad-Accessor-Name: <name>`, `X-Nomad-Accessor-Role: <role>`
    *   *Request*:
        ```typescript
        {
          section: keyof PatientRecord,  // 'demographics' | 'allergies' | 'medications' | 'history'
          entryId: string,
          value: string,
          author: string  // From currentUser.name
        }
        ```
    *   *Response*: 
        ```typescript
        {
          success: true,
          commit: Commit,
          updatedEntry: MedicalEntry,
          updatedRecord: PatientRecord  // Full record with updated entry
        }
        ```
    *   *UI Action*: `pages/dashboard/Overview.tsx` -> `handleSave()` -> `AppContext.updateMedicalEntry()`
    *   *Code Location*: Replace local state update in `AppContext.updateMedicalEntry()` function (lines 81-112)

*   **POST** `/api/records/:id/commit-note`
    *   *Purpose*: Add a new clinical note with optional attachments.
    *   *Headers*: `Authorization: Bearer <token>`, `X-Nomad-Accessor-Name: <name>`, `X-Nomad-Accessor-Role: <role>`
    *   *Request*: `multipart/form-data`
        *   `content`: string (required)
        *   `author`: string (required)
        *   `attachments`: File[] (optional)
    *   *Response*: 
        ```typescript
        {
          success: true,
          commit: Commit,
          note: Note,
          attachmentIds?: string[]  // IDs for uploaded files
        }
        ```
    *   *UI Action*: `pages/dashboard/Notes.tsx` -> `handleSubmit()` -> `AppContext.addNote()`
    *   *Code Location*: Replace local state update in `AppContext.addNote()` function (lines 52-79)

### History
*   **GET** `/api/records/:id/commits`
    *   *Headers*: `Authorization: Bearer <token>`
    *   *Query Params*: `?limit=50&offset=0` (optional pagination)
    *   *Response*: `{ commits: Commit[], total: number }`
    *   *UI Action*: `pages/dashboard/History.tsx` (Initial load, currently uses `record.commits`)
    *   *Code Location*: Add `useEffect` hook in `History.tsx` to fetch commits if record doesn't include full history

*   **GET** `/api/records/:id/commits/:commitHash`
    *   *Purpose*: Get the state of the record at a specific commit (for diffs/snapshots).
    *   *Headers*: `Authorization: Bearer <token>`
    *   *Response*: `PatientRecord` (Snapshot at that commit point)
    *   *UI Action*: `pages/dashboard/History.tsx` -> Click on commit to view details/diff
    *   *Code Location*: Add click handler to commit items in `History.tsx` (future enhancement)

### Export
*   **GET** `/api/records/:id/export.pdf`
    *   *Headers*: `Authorization: Bearer <token>`
    *   *Response*: PDF Binary (Content-Type: `application/pdf`)
    *   *UI Action*: `components/Navbar.tsx` -> "Export PDF" button onClick handler (line 40)
    *   *Code Location*: Replace `alert("Simulated PDF Generation")` in `Navbar.tsx` with fetch call and blob download

### Attachments
*   **GET** `/api/attachments/:attachmentId`
    *   *Purpose*: Retrieve attachment file by ID.
    *   *Headers*: `Authorization: Bearer <token>`
    *   *Response*: Binary file (Content-Type: image/jpeg, application/pdf, etc.)
    *   *UI Action*: `pages/dashboard/Notes.tsx` -> Click on attachment chip to view/download
    *   *Code Location*: Add click handlers to attachment chips in Notes component (future enhancement)

## Integration Points in Code

### `context/AppContext.tsx`

1.  **`login` function** (lines 35-44):
    *   *Current*: Mock `setTimeout` with 2-second delay, hardcoded `UserSession`, sets `MOCK_RECORD`.
    *   *Future*:
        ```typescript
        const response = await fetch('/api/auth/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, accessor, role })
        });
        const { token, session, recordId } = await response.json();
        localStorage.setItem('token', token);
        setCurrentUser(session);
        const recordResponse = await fetch(`/api/records/${recordId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const record = await recordResponse.json();
        setRecord(record);
        setCurrentView('dashboard');
        ```

2.  **`addNote` function** (lines 52-79):
    *   *Current*: Creates note and commit objects in memory, updates local state.
    *   *Future*:
        ```typescript
        const formData = new FormData();
        formData.append('content', content);
        formData.append('author', currentUser.name);
        // Append attachments if any
        const response = await fetch(`/api/records/${record.id}/commit-note`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Nomad-Accessor-Name': currentUser.name,
            'X-Nomad-Accessor-Role': currentUser.role
          },
          body: formData
        });
        const { note, commit } = await response.json();
        setRecord(prev => ({
          ...prev,
          notes: [note, ...prev.notes],
          commits: [commit, ...prev.commits]
        }));
        ```

3.  **`updateMedicalEntry` function** (lines 81-112):
    *   *Current*: Updates entry in local state, creates commit in memory.
    *   *Future*:
        ```typescript
        const response = await fetch(`/api/records/${record.id}/commit-structured`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Nomad-Accessor-Name': currentUser.name,
            'X-Nomad-Accessor-Role': currentUser.role
          },
          body: JSON.stringify({ section: sectionKey, entryId, value, author: currentUser.name })
        });
        const { updatedRecord, commit } = await response.json();
        setRecord(updatedRecord);
        ```

### `pages/dashboard/History.tsx`
*   *Current*: Renders `record.commits` from context (lines 22-62).
*   *Future*: Add `useEffect` to fetch commits separately if pagination needed:
    ```typescript
    useEffect(() => {
      fetch(`/api/records/${record.id}/commits?limit=50`)
        .then(res => res.json())
        .then(data => setCommits(data.commits));
    }, [record.id]);
    ```

### `components/Navbar.tsx`
*   *Current*: Export button shows alert (line 40).
*   *Future*: Replace with PDF download:
    ```typescript
    const handleExport = async () => {
      const response = await fetch(`/api/records/${record.id}/export.pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `record-${record.id}.pdf`;
      a.click();
    };
    ```

### `pages/Access.tsx`
*   *Current*: Collects single identity with role selector, hardcoded values in `onDecryptComplete()` (lines 18-24).
*   *Future*: Update form to collect Patient AND Accessor identities separately:
    *   Add separate form sections for Patient and Accessor
    *   Extract values from form inputs instead of hardcoded defaults
    *   Pass both identities to `login()` function

## Headers & Security

### Required Headers for All API Requests
*   `Authorization: Bearer <token>` - JWT session token from `/api/auth/unlock`
*   `X-Nomad-Accessor-Name: <name>` - Accessor's name for attribution
*   `X-Nomad-Accessor-Role: <role>` - Accessor's role ('patient' | 'clinician')

### Alternative: Token-Based Attribution
*   If JWT token contains accessor info, may omit `X-Nomad-*` headers
*   Backend should extract accessor identity from token claims

### CORS & Environment Variables
*   `VITE_API_BASE_URL` - Base URL for API (default: `http://localhost:3001/api`)
*   Configure CORS on backend to allow frontend origin
*   Store token in `localStorage` or `sessionStorage` (persist across refreshes)
