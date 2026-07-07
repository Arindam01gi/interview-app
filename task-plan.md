# AI Chat App — Feature Addition Plan

## Task
Add 3 new features to the existing AI-powered chat app 

---

## Features to Build

### 1. Multi-session chat history
- [x] Design data schema: `{ sessions: [{ id, title, messages, createdAt }], activeSessionId }`
- [x] Build sidebar UI to list/switch/create sessions
- [x] Wire up localStorage load on app init
- [x] Wire up localStorage save on state change (debounced)
- [x] Test: refresh page, confirm history persists

### 2. User authentication (sign up → sign in → chat)
- [x] Build Sign Up page (name/email + password fields)
- [x] On sign up: create user record in localStorage `users` list (hash password, never store plaintext)
- [x] Build Sign In page (validate against stored user record)
- [x] On successful sign in: store `currentUser` (id/email only, no password) in localStorage or sessionStorage
- [x] Add route guard: unauthenticated users → redirect to Sign In; authenticated → redirect to Chat
- [x] Namespace chat data per user: storage key becomes `chat_app_v1_<userId>` instead of one global key
- [x] On sign in: load only that user's sessions; on sign up: initialize empty session list for new user
- [x] Add Logout: clears `currentUser` only (chat data stays saved under that user's key for next login)
- [x] Test: Sign up User A, add chats → logout → sign up/sign in User B → confirm User B sees empty chat, not User A's
- [x] Test: log back in as User A → confirm their chat history is still there

### 3. Search/filter chat history
- [ ] Add search input (sidebar or top bar)
- [ ] Implement filter logic across session titles + message content
- [ ] Test: search returns correct matches, clears properly

### 4. Theme toggle (light/dark) — stretch goal
- [ ] Add toggle UI
- [ ] Persist preference to localStorage
- [ ] Apply theme on load (avoid flash of wrong theme)

---

## localStorage Design Notes
- Storage key: versioned, e.g. `chat_app_v1`
- Wrap all reads/writes in try/catch (quota limits, private browsing)
- Debounce writes (~300ms) to avoid excessive writes on fast typing
- Keep schema flat and predictable for easy migration later

## Per-User Data Separation (with auth)
- `users` key: array of `{ id, email, passwordHash }` — the "user table"
- `currentUser` key: just the logged-in user's id/email (session pointer, no password)
- Chat data key becomes **user-specific**: `chat_app_v1_<userId>` instead of one shared key
- On login: read `chat_app_v1_<userId>` to load that user's sessions
- On logout: only clear `currentUser`; leave `chat_app_v1_<userId>` intact so data is there next login
- Caveat to state clearly in your log/demo: this is **client-side-only auth** — password "hashing" in the browser (e.g. simple hash function) is for demo structure, not real security; a real app would verify credentials server-side and never trust the client to store or check passwords

## Log File Structure (fill in per feature as you build)

```markdown
# Development Log — [Feature Name]

## Date/Time


## What I built


## How
- 

## Packages used
- 

## Decisions/tradeoffs


## Known limitations / next steps

```

---

## Before Shipping Checklist
- [ ] All 3-4 features working end to end
- [ ] localStorage persists across refresh
- [ ] No console errors
- [ ] Log file complete for each feature
- [ ] Quick README update (if required) noting new features
