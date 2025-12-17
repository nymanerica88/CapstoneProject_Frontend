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

  const isProfile = pathname === "/profile";
  const isAddBill = pathname === "/bills/new";
  const isBillDetails =
    pathname.startsWith("/bills/") && pathname !== "/bills/new";

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
            {isProfile && <NavLink to="/bills/new">Add Bill</NavLink>}
            {isAddBill && <NavLink to="/profile">Profile</NavLink>}
            {isBillDetails && (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/bills/new">Add Bill</NavLink>
              </>
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
