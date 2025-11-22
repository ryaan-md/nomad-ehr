# UX Flows

## 1. Access / Unlock
**Goal**: Authenticate a session using identity-based access.

**Current Implementation** (Simplified - Single Identity):
1.  **User** lands on `Landing` page.
2.  **User** clicks "Access Record" button.
3.  **System** transitions to `Access` view with animation fade.
4.  **User** selects role: "I am a Patient" or "I am a Clinician" (left panel).
5.  **User** fills in identity form (right panel):
    *   Full Name: "Alara Kovic" (pre-filled for patient role)
    *   Date of Birth: "1994-06-12" (pre-filled)
    *   Three Word Key: ["sunrise", "ripple", "hope"] (pre-filled)
6.  **User** clicks "Unlock Record" button.
7.  **System** shows `DecryptOverlay` full-screen overlay:
    *   Stage 1 (0-1.5s): "Decrypting..." with rotating lock icon and spinner
    *   Stage 2 (1.5-2.5s): "Access Granted" with checkmark icon
    *   Shows fake validation messages: "Validating hash 0x8F2...", "Reconstructing version history..."
8.  **System** calls `login()` with `UserSession` object.
9.  **System** transitions to `Dashboard` view.
10. **System** displays patient header, tabs, and "Emergency Mode" toggle in Navbar.

*Note: Intended design is full two-party access (Patient + Accessor separate forms) - see Integration Plan.*

## 2. Edit Structured Section
**Goal**: Update a specific medical field (e.g., Blood Type).

1.  **User** is on `Dashboard` -> `Overview` tab.
2.  **System** displays 4 cards in grid: Demographics, Allergies, Medications, History.
3.  **User** locates "Demographics" card.
4.  **User** hovers over "Blood Type" entry row.
5.  **User** clicks the "Edit" (Pencil) icon (top-right of entry).
6.  **System** replaces value display with editable input field (inline edit mode).
7.  **User** changes "O+" to "A+" in input field.
8.  **User** clicks "Save" (Checkmark icon) or "Cancel" (X icon).
9.  **System** calls `updateMedicalEntry()` with `sectionKey`, `entryId`, and new value.
10. **System** updates the entry in local state:
    *   Sets `entry.value` to new value
    *   Sets `entry.lastUpdated` to current ISO timestamp
    *   Sets `entry.updatedBy` to `currentUser.name`
11. **System** creates a new `Commit` of type `'structure'`:
    *   Generates random hash: `Math.random().toString(36).substring(2, 9)`
    *   Sets `author` to `currentUser.name`
    *   Sets `message` to `"Updated ${section.title}: ${entryId}"`
    *   Prepends to `record.commits` array
12. **System** refreshes UI to show updated value and commit in History tab.
13. **User** sees updated value with new timestamp and author in Overview card.

## 3. Add Note with Attachment
**Goal**: Add a clinical note with optional file attachment.

1.  **User** navigates to `Dashboard` -> `Structured Notes` tab.
2.  **System** displays timeline of existing notes with commit hashes, authors, timestamps.
3.  **User** clicks "Add Entry" button (top-right, teal button with Plus icon).
4.  **System** opens modal dialog (centered, backdrop blur) with form:
    *   Title: "New Clinical Note"
    *   Textarea for note content
    *   "Add Attachment" button (Paperclip icon) - mock only
    *   "Commit Note" button (bottom-right)
5.  **User** types note content: "Patient complaining of headaches."
6.  **User** clicks "Add Attachment" button (optional, mock - no actual file picker yet).
7.  **System** (future): Opens file picker, shows preview/chip with filename.
8.  **User** clicks "Commit Note" button.
9.  **System** validates note content is not empty.
10. **System** calls `addNote(content)` from context:
    *   Generates note ID: `"n-${Date.now()}"`
    *   Creates `Note` object with:
        *   `timestamp`: Current ISO string
        *   `author`: `currentUser.name`
        *   `content`: User's text
        *   `commitHash`: Random hash (same as commit hash)
    *   Creates `Commit` of type `'note'`:
        *   `message`: `"Added clinical note via ${currentUser.role || 'web'}"`
        *   `author`: `currentUser.name`
11. **System** prepends note to `record.notes` array and commit to `record.commits` array.
12. **System** closes modal.
13. **System** refreshes Notes tab to show new note at top of timeline.
14. **User** sees new note with commit hash, author name, timestamp, and content.

## 4. View History / Diff
**Goal**: See who changed what and when.

1.  **User** navigates to `Dashboard` -> `Version History` tab.
2.  **System** displays:
    *   Info banner: "Immutable Ledger" explaining append-only log
    *   Timeline of commits in chronological order (newest first from `record.commits`)
3.  **System** renders each commit as a timeline item:
    *   Left column: Commit hash (short) and time
    *   Center: Icon (GitCommit for notes, GitPullRequest for structure) with connecting line
    *   Right: Commit message, author avatar, author name, date
4.  **User** views commit details:
    *   Commit hash (shortened, monospace font)
    *   Timestamp (time and date)
    *   Author (with avatar circle showing first letter)
    *   Commit message describing the change
    *   Type indicator (note/structure/access icon)
5.  **User** (future): Clicks on commit to view diff/snapshot.
6.  **System** (future): Shows before/after comparison or record state at that commit.

*Note: Currently displays commit metadata only. Diff functionality is planned for backend integration.*

## 5. Export PDF
**Goal**: Export the record as a PDF document.

1.  **User** is on any Dashboard tab.
2.  **User** locates "Export PDF" button in Navbar (top-right, with Download icon).
3.  **User** clicks "Export PDF" button.
4.  **System** (current): Shows alert dialog: "Simulated PDF Generation".
5.  **System** (future): 
    *   Shows loading spinner/toast: "Generating PDF..."
    *   Calls API endpoint: `GET /api/records/:id/export.pdf`
    *   Receives PDF binary response
    *   Triggers browser download: `record-${record.id}.pdf`
    *   Shows success toast: "Export complete"

*Note: Currently mock only. PDF generation will be implemented in backend.*

## 6. Emergency Mode Toggle
**Goal**: Switch to high-contrast emergency mode for low-light or urgent situations.

1.  **User** is on any page with Navbar visible.
2.  **User** locates Emergency Mode toggle button (AlertTriangle icon) in Navbar.
3.  **User** clicks Emergency Mode button.
4.  **System** toggles `emergencyMode` state in `AppContext`.
5.  **System** applies emergency theme:
    *   Background: Black (`bg-black`)
    *   Text: Yellow (`text-yellow-400`)
    *   Borders: Yellow accents (`border-yellow-600`)
    *   Button pulse animation for visibility
6.  **User** sees entire UI transformed to high-contrast emergency palette.
7.  **User** clicks again to toggle back to normal mode.
