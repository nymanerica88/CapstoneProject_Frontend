import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
      setUser(null);
      setGuestId(null);
    }
  }, [token]);

  const register = async (credentials) => {
    const response = await fetch(API + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.text();
    console.log(result);
    if (!response.ok) throw Error(result);
    setToken(result);

    const retrieveGuestIdRegistration = await fetch(API + "/users/me", {
      headers: { Authorization: `Bearer ${result}` },
    });
    const data = await retrieveGuestIdRegistration.json();
    setUser(data.user);
    setGuestId(data.guest_id ?? null);

    return data.guest_id;
  };

  const login = async (credentials) => {
    const response = await fetch(API + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.text();
    if (!response.ok) throw Error(result);
    setToken(result);

    const retrieveGuestIdLogin = await fetch(API + "/users/me", {
      headers: { Authorization: `Bearer ${result}` },
    });
    const data = await retrieveGuestIdLogin.json();
    setUser(data.user);
    setGuestId(data.guest_id ?? null);

    return data.guest_id;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setGuestId(null);
    sessionStorage.removeItem("token");
  };

  const value = {
    token,
    user,
    guestId,
    isLoggedIn: !!token,
    register,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
