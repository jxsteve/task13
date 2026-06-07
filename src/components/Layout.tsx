import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/users" className="brand">
            Stephen Ogbodo
          </NavLink>

          <div className="nav-links">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Manage Users
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
