# Nomad EHR - Architecture Overview

## Purpose
Nomad EHR is an open-access, version-controlled Electronic Health Record system designed for crisis zones. It prioritizes access over authentication and accountability via commit history. The current implementation is a high-fidelity frontend prototype using mock data and simulated encryption.

## Philosophy
*   **Access > Authentication**: No traditional login. Access requires knowledge of the patient's identity and the accessor's identity.
*   **Accountability**: Every read and write is attributed to an accessor.
*   **Version Control**: The medical record is treated like a Git repository. Every change is a commit.
*   **Offline-First UI**: The interface feels local and decentralized, even if currently served from a web server.

## Tech Stack (Frontend)
*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Language**: TypeScript

## Core Flows
1.  **Landing**: Entry point.
2.  **Access**: Two-party identification (Patient + Accessor). "Decryption" simulation.
3.  **Dashboard**: The main workspace, split into three tabs:
    *   **Overview**: Structured medical data (Allergies, Meds, etc.).
    *   **Structured Notes**: Free-text clinical notes with attachments.
    *   **Version History**: Timeline of all changes (commits).

## Architecture Diagram

```mermaid
graph TD
    User[User] --> Landing
    Landing --> Access
    Access -- "Unlock (Mock Decrypt)" --> Dashboard
    
    subgraph Dashboard
        Overview[Overview Tab]
        Notes[Structured Notes Tab]
        History[Version History Tab]
    end
    
    Dashboard --> Overview
    Dashboard --> Notes
    Dashboard --> History
    
    subgraph State Management (AppContext)
        Store[Mock Record Store]
        Session[User Session]
        View[View State]
    end
    
    Dashboard <--> Store
    Access --> Session
```

## Current State (Prototype)
*   **Routing**: Custom state-based routing (`currentView` in `AppContext`), not `react-router`.
*   **Data**: In-memory mock data (`MOCK_RECORD` in `constants.ts`).
*   **Persistence**: None (refreshes reset state).
*   **Encryption**: Visual simulation only (Framer Motion animations, backdrop blur, rotating lock icon in `DecryptOverlay.tsx`).
*   **Access Model**: Currently simplified to single-identity form with role selector (patient/clinician). Intended design is full two-party (Patient + Accessor) - see Integration Plan.

## Project Structure
```
nomad-ehr/
├── App.tsx                 # Root component, view switcher
├── index.tsx              # React DOM entry point
├── index.html             # HTML template (includes Tailwind CDN config)
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── constants.ts           # Mock data (MOCK_RECORD)
├── types.ts               # TypeScript interfaces
├── pages/
│   ├── Landing.tsx        # Landing page
│   ├── Access.tsx         # Access/unlock form
│   ├── Dashboard.tsx      # Main dashboard container
│   └── dashboard/
│       ├── Overview.tsx   # Structured medical data tabs
│       ├── Notes.tsx      # Clinical notes timeline
│       └── History.tsx    # Version history/commits
├── components/
│   ├── Navbar.tsx         # Top navigation bar
│   ├── Footer.tsx         # Bottom footer
│   └── DecryptOverlay.tsx # Encryption animation overlay
└── context/
    └── AppContext.tsx     # Global state management
```

## Future Backend Integration
The frontend is designed to eventually connect to a Node/Express backend. The `AppContext` methods (`login`, `addNote`, `updateMedicalEntry`) are the designated integration points for API calls. See `INTEGRATION_PLAN.md` for detailed endpoint mapping and code insertion points.
