import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logoutRedirect = () => {
    logout();
    navigate("/");
  };

  return (
    <header id="navbar">
      {token ? (
        <p id="brand">Tab Tabulations</p>
      ) : (
        <NavLink id="brand" to="/">
          <p>Capstone Project Cover</p>
        </NavLink>
      )}

      <nav>
        {token ? (
          <>
            {pathname === "/profile" && (
              <NavLink to="/bills/new">Add Bill</NavLink>
            )}
            {pathname === "/bills/new" && (
              <NavLink to="/profile">Profile</NavLink>
            )}
            <button onClick={logoutRedirect}>Log out</button>
          </>
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
