# User Management System

An Apple Human Interface Guidelines–styled User Management System built with
**React + TypeScript**, **Redux Toolkit** for global state, and **React Router**
for navigation.

Initial data is fetched once from
`https://jsonplaceholder.typicode.com/users`. All **add / edit / delete**
operations are handled locally in Redux — no `POST`, `PUT`, or `DELETE`
requests are sent to the API.



## Redux state

```ts
interface UserState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
```

### Async thunks

- `fetchUsers()` — GET the initial list from the API.
- `addUser(newUser)` — generates an id from current state, adds locally.
- `updateUser(user)` — replaces the matching user locally.
- `deleteUser(id)` — removes the matching user locally.

## Design notes

- System font stack (SF Pro), system colors, and translucent "material"
  navigation bar with `backdrop-filter`.
- Continuous-corner cards, inset grouped form lists, and SF-style typography.
- Full **light and dark mode** support via `prefers-color-scheme`.
- Respects `prefers-reduced-motion`.
```
