# Development Log — AI Chat App Foundation

## Date/Time
- 2026-07-07

## What I Built
Built a modular, responsive, fully-typed AI Chat Application with the following elements:
1. **Chat Core**: Chat window with scrollable messages list, typing indicators, auto-scroll to bottom, and error status handling.
2. **Color bubble system**: Sent messages (User) render with an Indigo/Purple gradient align right, received messages (AI Assistant) render with a Dark Zinc/Slate bubble align left.
3. **Multi-Session Chat History**: State management support for creating, switching, deleting, and clearing chat sessions.
4. **LocalStorage Persistence**: Auto loading and saving chat sessions to/from client-side browser `localStorage` under `chat_sessions`.
5. **Secure Route Handler**: Server-side proxy API handler `app/api/chat/route.ts` communicating with Google's Gemini models using the `GEMEINI_API_KEY` from `.env`.

## How
- **State Management**: Built React context `context/ChatContext.tsx` to wrap the app and manage state changes reactively.
- **Styling**: Tailored Tailwind CSS v4 styling rules to create a premium glassmorphic theme with modern micro-animations.
- **Types**: Structured all interfaces inside `types/chat.ts` to enforce strict type checking.
- **Direct Fetch**: Used Next.js API Route Handler and the web native `fetch` API to communicate directly with Google's Gemini endpoints, keeping server operations light.

## Packages Used
- **None**: Built strictly with default standard library APIs (web native `fetch`, `crypto.randomUUID`) and the workspace's pre-installed tools. No third-party packages were installed.

## Decisions/Tradeoffs
- **Custom Markdown Parsing**: Handled inline formatting and code snippet block renders through a custom light text parser to avoid bundling heavy markdown libraries, improving initial load speed.
- **Native Fetch over Node SDK**: Used native `fetch` API inside the Route Handler which avoids installing the `@google/generative-ai` package and reduces bundle size.
- **Title Auto-Naming**: Created a UX touch where the first user message of a session automatically renames the conversation title.

## Known Limitations / Next Steps
- Export conversations to JSON/Markdown.
- Search/filter capability in sidebar.
- Theme switching.

---

# Development Log — Multi-Session Chat History Refinements

## Date/Time
- 2026-07-07 15:49

## What I built
- Refined multi-session chat history persistence.
- Implemented state reloading on initial mount matching the last active chat session.
- Implemented 300ms debouncing mechanism to throttle `localStorage` updates.

## How
- Created a versioned schema using keys `chat_app_v1` and `chat_active_id_v1`.
- Added a `setTimeout` cleanup function inside the saving `useEffect` in [ChatContext.tsx](file:///c:/Users/ARINDAM/interview-app/context/ChatContext.tsx) to debounce state saving on state changes.
- Wrapped all `localStorage` reads/writes in secure `try/catch` handlers to avoid page crashes when operating in private browser windows or when the user storage quota limit is reached.

## Packages used
- **None**. (Native browser Web APIs utilized).

## Decisions/tradeoffs
- **Throttling/Debouncing**: Delaying the write by 300ms means that intermediate updates (like rapid successive message additions or session state shifts) are batch written, optimizing hardware performance without impacting user experience.

## Known limitations / next steps
- None. Ready for manual verification.

---

# Development Log — User Authentication & Data Isolation

## Date/Time
- 2026-07-07 16:01

## What I built
- Secure client-side user authentication system (Sign Up, Sign In, and Logout).
- Dynamic localStorage namespaces (`chat_app_v1_<userId>`) separating user conversations.
- Route protection guard ensuring unauthenticated users see the auth form.
- Footer user info display card in the sidebar.

## How
- Developed `context/AuthContext.tsx` using React Context to store and manage active user states.
- Utilized Web Crypto Subtle API with SHA-256 to hash passwords client-side.
- Linked `ChatContext.tsx` load/save `useEffect` keys dynamically to `userId` and dependency-re-loaded whenever the user switches.
- Modified `app/page.tsx` as a client component displaying `AuthScreens` for logged-out states, and wrapping layout inside providers.

## Packages used
- **None**. (SubtleCrypto native Web API).

## Decisions/tradeoffs
- **Client-Side SHA-256 Hashing**: Implemented hashing in the browser using the native Web Crypto API to ensure no plaintext passwords reside in storage. Underlined in plan that this is for demo structure and real systems should use server-side credentials verification.
- **Client-Side Routing Guard**: Rendered login components directly on the home page conditionally to implement authentication checks quickly without complex React Router setup.

## Known limitations / next steps
- Export conversation feature.
- Chat history filtering.

---

# Development Log — Type Reorganization & Password Visibility Toggle

## Date/Time
- 2026-07-07 16:08

## What I built
- Grouped authentication types and user structures into a dedicated file.
- Built interactive eye icon controls on password and confirm password fields to toggle visibility.

## How
- Created [types/auth.ts](file:///c:/Users/ARINDAM/interview-app/types/auth.ts) to hold and export `User` and `StoredUser` interfaces.
- Updated imports inside [context/AuthContext.tsx](file:///c:/Users/ARINDAM/interview-app/context/AuthContext.tsx) to target `@/types/auth`.
- Installed `react-icons` package.
- Utilized state variables `showPassword` / `showConfirmPassword` inside [AuthScreens.tsx](file:///c:/Users/ARINDAM/interview-app/components/auth/AuthScreens.tsx), updating input attributes to toggle between `password` and `text` types dynamically when user clicks the eye icon (`IoEyeOutline` and `IoEyeOffOutline`).

## Packages used
- `react-icons` (for show/hide eye symbols).

## Decisions/tradeoffs
- **Separate Type Files**: Moving types to dedicated files makes the codebase cleaner, matches industry standards, and makes importing simpler without causing dependency cycles.

## Known limitations / next steps
- Export conversation feature.
- Chat history filtering.

---

# Development Log — Manual Verification: Auth & Password Toggle

## Date/Time
- 2026-07-07 16:08

## What was verified
- **User A / User B data isolation**: Signed up as User A, sent messages, logged out, signed up as User B — User B's session was empty (no User A data leaked).
- **Session persistence after logout**: Logged back in as User A — full chat history restored correctly from `chat_app_v1_<userId>` key.
- **Password visibility toggle**: Confirmed `IoEyeOutline` / `IoEyeOffOutline` icons appear and function on both the Password and Confirm Password fields across Sign In and Sign Up modes.
- **Task plan updated**: Marked all auth test items `[x]` in [task-plan.md](file:///c:/Users/ARINDAM/interview-app/task-plan.md).

## Packages used
- None (manual browser testing).

## Decisions/tradeoffs
- Testing was done manually in the browser, as specified by the user.

## Known limitations / next steps
- Search/filter chat history feature (next to build).
- Export conversation to JSON/Markdown.
- Theme toggle (light/dark) — stretch goal.

---

# Development Log — Search/Filter Chat History

## Date/Time
- 2026-07-07 16:13

## What I built
- Added a live search input at the top of the sidebar (below the header) that filters visible sessions in real time.
- Filter checks both **session title** and **any message content** (case-insensitive).
- When a match is found in message content (not the title), a short contextual snippet is shown under the session title.
- The counter label switches from `History (N)` to `Results (N)` while searching.
- A clear (×) button appears inside the search field when a query is active, resetting the filter instantly.
- Empty-state message is context-aware: shows "No chats matching …" vs "No chat history yet."

## How
- Added `searchQuery` state to `Sidebar.tsx`.
- Used `useMemo` to derive `filteredSessions` from `sessions` + `searchQuery`, ensuring no unnecessary re-renders.
- Snippet extraction uses `String.indexOf` for exact position, slicing ±20/30 chars around the match with ellipsis guards.
- No new packages installed — pure React + native string methods.

## Packages used
- **None**.

## Decisions/tradeoffs
- **`useMemo` over `useEffect`**: Derived state via `useMemo` is simpler and avoids extra renders compared to storing a separate filtered array in state.
- **Message snippet**: Showing the first matching message line gives context to the user without navigating to the session.

## Known limitations / next steps
- Export conversation to JSON/Markdown.
- Theme toggle (light/dark) — stretch goal.

---

# Development Log — Speech-to-Text (Voice Input)

## Date/Time
- 2026-07-07 16:36

## What I built
- Safely integrated Speech-to-Text capability in the chat input using the native Web Speech API (`SpeechRecognition`).
- Extracted Speech Recognition handling into a standalone [VoiceInput.tsx](file:///c:/Users/ARINDAM/interview-app/components/chat/VoiceInput.tsx) component for modularity.
- Added a microphone toggle button to the chat bar that switches between recording and idle states.
- Created visual listening indicator (pulsing mic icon, red highlight, placeholder text changes to "Listening...").
- Handled inline speech error messages (e.g. microphone permission denied, silence timeout/no-speech) using temporary auto-dismiss alerts above the text input.
- Added a safe wrapper utility `utils/SpeechRecognition.ts` to detect Web Speech API capabilities without breaking SSR or hydration in Next.js.

## How
- Created helper function `isSpeechRecognitionSupported` to check if `SpeechRecognition` or `webkitSpeechRecognition` is defined in `window`.
- Wired up a single-shot recording flow inside `components/chat/ChatInput.tsx` using `onresult`, `onerror`, and `onend` event handlers.
- When transcription succeeds, text is appended to the input buffer, allowing the user to review and edit before sending.
- Handled unmount safety by aborting recognition if active.

## Packages used
- **None** (Built strictly using browser-native Web Speech API).

## Decisions/tradeoffs
- **Speech recognition behavior**: We append to the current input string instead of auto-sending. This lets the user inspect the text and correct any spelling/recognition errors before committing.
- **Auto-dismissing alerts**: Speech errors are displayed in a clean, non-disruptive floating tooltip above the input field that fades after 4 seconds to prevent blocking UI real-estate.

## Known limitations / next steps
- Browser support: Firefox has limited default support for Web Speech API compared to Chromium-based browsers (Chrome/Edge/Safari).

