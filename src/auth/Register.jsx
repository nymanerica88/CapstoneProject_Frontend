import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import "../CSSregister.css";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const first_name = formData.get("firstname");
    const last_name = formData.get("lastname");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await register({ first_name, last_name, email, username, password });
      navigate("/");
    } catch (e) {
      setError(e.message || "Registration failed");
    }
  };

  return (
    <section className="register">
      <h1>Welcome to Tab Tabulations!</h1>
      <p>
        Split bills with peers, family, and friends easily with our built in tab
        calculator. Users can enter the bill total, choose a bill split type,
        and quickly calculate what each individual owes on the group bill!
      </p>
      <h2>Register for an Account</h2>
      <form onSubmit={onRegister}>
        <label>
          First Name
          <input type="text" name="firstname" required />
        </label>
        <label>
          Last Name
          <input type="text" name="lastname" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
        {error && <output>{error}</output>}
      </form>
      <Link to="/login">Already have an account? Log in here.</Link>
    </section>
  );
}
