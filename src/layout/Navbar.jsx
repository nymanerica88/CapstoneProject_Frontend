import { NavLink, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <p>Capstone Project Cover</p>
      </NavLink>
      <nav>
        {token ? (
          <button onClick={logout}>Log out</button>
        ) : (
          <>
            {pathname === "/" && (
              <>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/login">Log In</NavLink>
              </>
            )}
            {pathname === "/register" && <NavLink to="/login">Log In</NavLink>}
            {pathname === "/login" && <NavLink to="register">Register</NavLink>}
          </>
        )}
      </nav>
    </header>
  );
}
