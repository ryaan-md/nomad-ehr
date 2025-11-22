# Frontend Map

## Route Map
The application uses a custom view manager (`AppContext`) instead of a traditional router.

1.  **Landing** (`currentView === 'landing'`)
    *   **Component**: `pages/Landing.tsx`
    *   **Action**: "Access Record" button -> transitions to `access` view.

2.  **Access** (`currentView === 'access'`)
    *   **Component**: `pages/Access.tsx`
    *   **Inputs** (Current Implementation - Simplified):
        *   Role Selector: Patient or Clinician (radio buttons)
        *   Single Identity Form: Name, DOB, 3 Words (shared for selected role)
        *   *Note: Intended design is full two-party (Patient + Accessor separate forms) - see Integration Plan*
    *   **Action**: "Unlock Record" -> Triggers `DecryptOverlay` animation -> `login()` -> transitions to `dashboard` view.

3.  **Dashboard** (`currentView === 'dashboard'`)
    *   **Component**: `pages/Dashboard.tsx`
    *   **Sub-Navigation** (Tabs):
        *   **Overview** (`activeTab === 'overview'`): `pages/dashboard/Overview.tsx`
        *   **Structured Notes** (`activeTab === 'notes'`): `pages/dashboard/Notes.tsx`
        *   **Version History** (`activeTab === 'history'`): `pages/dashboard/History.tsx`

## Component Inventory

### Core Layout
*   **App** (`App.tsx`): Main container, handles view switching and `AnimatePresence`.
*   **Navbar** (`components/Navbar.tsx`): Displays logo, current patient info (if logged in), and "Emergency Mode" toggle.
*   **Footer** (`components/Footer.tsx`): Static footer with copyright/links.

### Pages & Views
*   **Landing**: Hero section, introduction to the platform.
*   **Access**: Form for two-party authentication. Handles the "decryption" animation sequence.
*   **Dashboard**: Container for the record view. Manages the tab state.

### Dashboard Tabs
*   **Overview**: Displays `demographics`, `allergies`, `medications`, `history` from `PatientRecord`.
    *   *Props*: Consumes `record` from context.
*   **Notes**: List of clinical notes. Allows adding new notes with attachments (mock).
    *   *Props*: Consumes `record` and `addNote` from context.
*   **History**: Timeline of commits. Shows diffs (simulated).
    *   *Props*: Consumes `record.commits` from context.

### UI Components
*   **DecryptOverlay** (`components/DecryptOverlay.tsx`): 
    *   *Props*: `{ isDecrypting: boolean, onComplete: () => void }`
    *   Visual effect overlay used during the "Unlock" phase.
    *   Stages: `locked` -> `decrypting` (1.5s) -> `success` (1s) -> calls `onComplete`.
    *   Animation: Rotating spinner, backdrop blur, lock icon transforms to checkmark.
*   **EncryptionToast** (implied/inline): Notifications for actions (currently alerts/messages inline).

## Component Props Summary

| Component | Location | Props | Description |
|-----------|----------|-------|-------------|
| `App` | `App.tsx` | None | Root container, wraps `AppProvider` |
| `Landing` | `pages/Landing.tsx` | None | Consumes `setCurrentView` from context |
| `Access` | `pages/Access.tsx` | None | Consumes `login` from context |
| `Dashboard` | `pages/Dashboard.tsx` | None | Consumes `activeTab`, `setActiveTab`, `record`, `emergencyMode` |
| `Overview` | `pages/dashboard/Overview.tsx` | None | Consumes `record`, `updateMedicalEntry`, `emergencyMode` |
| `Notes` | `pages/dashboard/Notes.tsx` | None | Consumes `record`, `addNote`, `emergencyMode` |
| `History` | `pages/dashboard/History.tsx` | None | Consumes `record`, `emergencyMode` |
| `Navbar` | `components/Navbar.tsx` | None | Consumes `emergencyMode`, `toggleEmergencyMode`, `currentView`, `logout`, `currentUser` |
| `Footer` | `components/Footer.tsx` | None | Consumes `emergencyMode` |
| `DecryptOverlay` | `components/DecryptOverlay.tsx` | `{ isDecrypting: boolean, onComplete: () => void }` | Visual encryption animation |

## Styling & Tokens

### Configuration
*   **Tailwind CSS**: Configured via CDN in `index.html` (no separate config file)
*   **Custom Config**: Defined in `<script>` tag in `index.html`
    *   Custom colors: `nomad-teal`, `nomad-dark`, `nomad-light`, `nomad-accent`
    *   Custom fonts: `Inter` (sans), `Poppins` (heading)
    *   Custom animations: `spin-slow`, `pulse-slow`

### Design Tokens

**Colors**:
*   `nomad-teal`: `#00BFA6` (Primary brand color - buttons, accents)
*   `nomad-dark`: `#1F2937` (Dark mode backgrounds, buttons)
*   `nomad-light`: `#F9FAFB` (Page backgrounds)
*   `nomad-accent`: `#0EA5E9` (Sky blue for gradients)
*   Emergency Mode: Black background (`bg-black`), yellow text (`text-yellow-400`)

**Typography**:
*   Sans-serif: `Inter` (body text)
*   Heading: `Poppins` (titles, headers)
*   Mono: System monospace (commit hashes, IDs)

**Spacing & Layout**:
*   Border radius: `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px)
*   Shadows: `shadow-lg`, `shadow-2xl` with color-specific variants (e.g., `shadow-nomad-teal/20`)
*   Container: Max width `max-w-5xl` (1024px) for dashboard

**Animations** (Framer Motion):
*   View transitions: Fade in/out (`opacity: 0 -> 1`, `duration: 0.3s`)
*   Page entry: Slide up (`y: 20 -> 0`)
*   Tab switching: `AnimatePresence` with opacity transitions
*   Decrypt overlay: Rotating spinner (360° infinite), scale transforms
*   Timeline items: Staggered fade-in (`delay: index * 0.05-0.1`)
*   Button interactions: `whileHover` scale (1.05), `whileTap` scale (0.95)

## Data Flow

### Access Flow (Current Implementation)
1. User selects role (Patient/Clinician) in `Access.tsx`
2. User enters: Name, DOB, 3 Words
3. Form submit triggers `DecryptOverlay` animation
4. After animation completes, `onDecryptComplete()` calls `login(session)`
5. `login()` creates `UserSession` object:
   ```typescript
   {
     name: "Alara Kovic" | "Dr. Sarah Chen" (based on role),
     role: 'patient' | 'clinician',
     threeWords: ["sunrise", "ripple", "hope"]
   }
   ```
6. Session stored in `AppContext.currentUser`
7. View transitions to `dashboard`

### Attribution Flow
*   **Note Creation**: `addNote()` uses `currentUser.name` as `author`
*   **Entry Updates**: `updateMedicalEntry()` uses `currentUser.name` as `updatedBy`
*   **Commit Generation**: Both operations create `Commit` objects with `author` from `currentUser`

### State Updates
*   All state changes trigger commit creation
*   Commits are prepended to `record.commits` array (newest first)
*   UI automatically reflects changes via React context updates
