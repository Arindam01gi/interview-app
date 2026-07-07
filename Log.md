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
