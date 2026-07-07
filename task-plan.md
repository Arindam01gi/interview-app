# AI Chat App — Feature Addition Plan

## Task
Add 3-4 new features to the existing AI-powered chat app (built with Antigravity), ship by tomorrow, and maintain a development log documenting what was built, how, and what packages were used. Data must persist via localStorage.

---

## Features to Build

### 1. Multi-session chat history
- [ ] Design data schema: `{ sessions: [{ id, title, messages, createdAt }], activeSessionId }`
- [ ] Build sidebar UI to list/switch/create sessions
- [ ] Wire up localStorage load on app init
- [ ] Wire up localStorage save on state change (debounced)
- [ ] Test: refresh page, confirm history persists

### 2. Export conversation
- [ ] Add export button (per session)
- [ ] Implement JSON export
- [ ] Implement Markdown export (optional stretch)
- [ ] Test: exported file opens correctly and matches chat content

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

---

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
