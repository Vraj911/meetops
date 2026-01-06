# MeetOps

**Turn meetings into action** - An enterprise workflow application where meeting transcripts or audio are uploaded, AI extracts summaries and action items, humans review and approve, and execution happens later.

## 🎯 Project Overview

MeetOps is a frontend-only, enterprise workflow app that transforms meeting conversations into actionable work items. The application follows a strict **"AI understands, Humans approve, Backend executes"** principle.

### Key Features

- **AI-Powered Extraction**: Automatically extracts summaries, decisions, and action items from meeting transcripts/audio
- **Human Review & Governance**: Humans review and correct AI-generated content before execution
- **Integration Ready**: Prepared for sync to JIRA & Calendar (mock implementation)
- **Enterprise-Grade UI**: Calm, trustworthy, and production-ready interface
- **Workflow-Driven**: Linear, guided workflow from upload to sync

## 🛠️ Tech Stack

**STRICT TECH STACK (DO NOT CHANGE)**

- **Framework**: React 18
- **Router**: React Router v6+
- **Language**: TypeScript (strict)
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion (limited)
- **Fonts**: 
  - Primary: IBM Plex Sans
  - Mono: IBM Plex Mono
- **Icons**: lucide-react

**Important**: This is a frontend-only application with:
- ❌ NO backend logic
- ❌ NO real API calls
- ❌ NO auth implementation (UI only)
- ❌ NO AI calls (mock data only)

## 📁 Project Structure

```
src/
├── main.tsx                          # React entry point
├── App.tsx                           # App root (Router + Providers)
│
├── router/
│   └── AppRouter.tsx                 # React Router v6+ configuration
│
├── layouts/
│   ├── RootLayout.tsx                # Global wrapper (theme, cursor, motion)
│   ├── AuthLayout.tsx                # Minimal auth layout
│   └── AppLayout.tsx                 # Logged-in shell (header, nav, context bar)
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── workspace/
│   │   └── Workspace.tsx
│   ├── integrations/
│   │   └── Integrations.tsx
│   ├── upload/
│   │   └── Upload.tsx
│   ├── processing/
│   │   └── Processing.tsx
│   ├── review/
│   │   └── Review.tsx                # CORE VALUE PAGE
│   ├── result/
│   │   └── Result.tsx
│   ├── docs/
│   │   └── Docs.tsx
│   ├── NotFound.tsx
│   └── ErrorBoundary.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx             # Workflow-aware header
│   │   └── AuthHeader.tsx
│   ├── ui/                           # PURE UI PRIMITIVES
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── workflow/                     # PAGE-SPECIFIC BLOCKS
│   │   ├── Upload/
│   │   ├── Processing/
│   │   ├── Review/
│   │   └── Result/
│   ├── chatbot/
│   │   └── AiPanel.tsx               # AI refinement panel (Review page only)
│   ├── cursor/
│   │   └── CustomCursor.tsx          # Custom cursor component
│   ├── grid/
│   │   └── GridLines.tsx             # Grid overlay for hero sections
│   └── loaders/
│       ├── GlobalLoader.tsx          # App-level loader
│       ├── PageLoader.tsx            # Route-level Suspense fallback
│       └── InlineLoader.tsx          # Buttons, cards, tables
│
├── stores/                           # ZUSTAND STORES
│   ├── auth.store.ts
│   ├── workspace.store.ts
│   ├── meeting.store.ts
│   └── ui.store.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkflowStep.ts
│   ├── useMediaQuery.ts
│   └── useStreamingText.ts           # Streaming output helper
│
├── mock/
│   └── mockData.ts                   # SINGLE SOURCE OF TRUTH (ALL MOCK DATA)
│
├── lib/
│   ├── constants.ts
│   ├── routes.ts
│   └── utils.ts
│
├── types/
│   ├── auth.ts
│   ├── workspace.ts
│   ├── meeting.ts
│   ├── actionItem.ts
│   └── integration.ts
│
└── styles/
    ├── globals.css
    └── theme.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meet-flow-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

The production build will be in the `dist/` directory.

## 🎨 Design System

### Theme

The application supports both **Dark** and **Light** modes with strict color specifications:

**Dark Theme (Primary)**:
- Background: `#0f172a` (slate-950)
- Cards: `#1e293b` (slate-800)
- Inputs: `#334155` (slate-700)

**Light Theme**:
- Background: `#f8fafc` (slate-50)
- Cards: `#ffffff`
- Inputs: `#e2e8f0` (slate-200)

**Accent Colors** (Global, identical in both themes):
- Primary: Indigo `#6366f1`
- Success: Emerald `#10b981`

### Typography

- **Primary Font**: IBM Plex Sans (Regular 400, Medium 500, Semibold 600)
- **Mono Font**: IBM Plex Mono (for code/timestamps)

### Components

All UI components follow strict design specifications:
- Subtle animations (≤300ms)
- Enterprise-grade interactions
- Confidence indicators (High/Medium/Low)
- Status dots for connections

## 🎯 Workflow

The application follows a linear, guided workflow:

1. **Authentication** → Login/Signup/Invite
2. **Workspace Context** → Confirm team and workspace
3. **Integration Setup** → Connect JIRA & Calendar (optional)
4. **Meeting Upload** → Upload transcript or audio
5. **AI Processing** → Extract summaries, decisions, action items
6. **Human Review** → Review, edit, and approve items
7. **Sync Result** → View created tickets and events

## 🧩 Key Components

### Custom Cursor

- **Location**: `src/components/cursor/CustomCursor.tsx`
- **Features**:
  - Desktop-only (disabled on mobile/touch devices)
  - Outer ring (32px) expands to 48px on hover
  - Inner dot (6px) shrinks to 4.8px on click
  - Spring animation (stiffness: 500, damping: 28)
  - Blend mode: difference for visibility

**Implementation Details**:
- Uses Framer Motion for smooth spring animations
- Automatically hides default cursor on desktop
- Detects interactive elements (buttons, links, inputs)
- Integrated into both `AuthLayout` and `AppLayout`

### Grid Lines Overlay

- **Location**: `src/components/ui/GridLines.tsx`
- **Usage**: Only on hero sections (logged-out pages)
- **Features**:
  - 12-column vertical grid
  - 8-row horizontal grid
  - Corner accents with gradient
  - Very subtle opacity (2-4%)

**Implementation Details**:
- Applied in `AuthLayout` for login/signup pages
- Static position, no animation
- Behind all content (z-index: 0)

### AI Chatbot Panel

- **Location**: `src/components/chatbot/AiPanel.tsx`
- **Usage**: Review page only (`/review`)
- **Features**:
  - Slides from right (400px width)
  - Predefined prompts for refinement
  - Streaming text output simulation
  - JSON diff preview
  - Apply button (disabled until streaming completes)

**Implementation Details**:
- State managed via `ui.store.ts`
- Animated with Framer Motion (slide-in from right)
- Mock streaming implementation using controlled state updates

### Keyboard Shortcuts

- **Location**: `src/components/ui/KeyboardShortcuts.tsx`
- **Shortcuts**:
  - `Cmd/Ctrl+K`: Open shortcuts menu
  - `Cmd/Ctrl+N`: New meeting
  - `Cmd/Ctrl+,`: Settings
  - `Space`: Play/pause transcript (Review page)
  - `J/K`: Next/previous action item (Review page)
  - `E`: Edit selected item (Review page)

## 🔧 Removed Lovable References

This project was initially created with Lovable.dev. The following references have been removed:

### Files Modified

1. **`index.html`**
   - **Removed**: Lovable title, description, author meta tags
   - **Removed**: OpenGraph and Twitter card images pointing to Lovable
   - **Added**: MeetOps-specific meta tags
   - **Location**: Root directory

2. **`vite.config.ts`**
   - **Removed**: `componentTagger` import from `lovable-tagger`
   - **Removed**: `componentTagger()` plugin from Vite config
   - **Location**: Root directory

3. **`package.json`**
   - **Note**: `lovable-tagger` remains in devDependencies but is not used
   - Can be safely removed if desired

### Where Changes Were Made

- **`index.html`**: Lines 7-19 - All Lovable references replaced with MeetOps branding
- **`vite.config.ts`**: Lines 4 and 12 - Lovable tagger completely removed from build process

### Verification

To verify Lovable references are removed:
```bash
grep -r "lovable" --ignore-case .
```

This should only show references in `package-lock.json` (which is fine) and `package.json` devDependencies (optional to remove).

## 📦 Mock Data

All mock data is centralized in `src/lib/mockData.ts`. This is a **single source of truth** for all fake data used throughout the application.

**Rule**: No component or page should define inline mock objects. All mock data must be imported from `mockData.ts`.

**Example**:
```typescript
// ✅ CORRECT
import { getMockMeeting } from "@/lib/mockData";
const meeting = getMockMeeting();

// ❌ WRONG
const meeting = {
  title: "Q4 Planning",
  // ...
};
```

## 🎬 Streaming Output

Streaming is implemented purely in the frontend to simulate real-time AI behavior:

**Allowed Locations**:
1. AI Processing Page (`/processing`)
2. Review Page - AI Chatbot Panel (`/review`)

**Implementation**:
- Uses controlled state updates
- No real WebSockets or backend calls
- Text streams incrementally (word-by-word)
- Completion gates for user interactions

## 🧪 Testing

Currently, the application has no test suite. To add testing:

1. Install testing dependencies
2. Set up Vitest or Jest
3. Add tests for critical components
4. Test workflow progression

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a frontend-only, hackathon-ready application. Contributions should maintain:
- Strict tech stack requirements
- Design system specifications
- Mock data architecture
- Workflow linearity

## 📚 Documentation

Additional documentation can be found:
- Design specifications: See project requirements document
- API (mock): See `/docs` page in the application
- Component documentation: Inline JSDoc comments

## 🐛 Known Issues

- All data is mock - no real backend integration
- Authentication is UI-only - no real auth flow
- AI processing is simulated - no real AI calls
- Integrations are informational only - no real OAuth flows

## 🚧 Future Enhancements

When backend integration is added:
1. Replace `mockData.ts` with API calls
2. Implement real authentication
3. Connect to real AI services
4. Add real JIRA & Calendar OAuth flows
5. Implement actual sync functionality

---

**Built with ❤️ for enterprise workflow automation**
