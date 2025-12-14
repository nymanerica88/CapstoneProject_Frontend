import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router";
import AvatarImageDefault from "../cover/AvatarImageDefault.png";
import "../CSSprofile.css";
import "../CSSnavbar.css";

export default function Profile() {
  const { token, user } = useAuth();

  const [bills, setBills] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError(
        <>
          Unauthorized user. <br /> <br />
          Please <Link to="/register">register </Link> for an account if you are
          new to the app, or <Link to="/login">log in</Link> if you already have
          an account.
        </>
      );
      setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }

        const data = await response.json();

        setBills(data.bills ?? []);
        setTotalOwed(data.total_owed ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  if (loading) {
    return <p>Loading profile…</p>;
  }

  if (error) {
    return (
      <section className="profile">
        <output className="error">{error}</output>
      </section>
    );
  }
  return (
    <section className="profile">
      <h2>Hello {user?.first_name}!</h2>

      <section className="profile-avatar">
        <img
          src={AvatarImageDefault}
          alt="Profile avatar"
          className="avatar-image"
        />
      </section>

      <div className="profile-total">
        <h3>Total amount owed:</h3>
        <p>${Number(totalOwed).toFixed(2)}</p>
      </div>

      <div className="profile-bills">
        {bills.map((bill) => (
          <button
            key={bill.ref_num}
            className="bill-card"
            onClick={() => {
              console.log("Clicked bill:", bill.ref_num);
              // THIS IS A PLACEHOLDER -- the route for bill details hasn't been
              // created yet; navigate(`/bills/${bill.ref_num}`) -- unless I change
              // the bill ref num is changed to the bill_id number instead;
            }}
          >
            <span className="bill-ref"> Ref #: {bill.ref_num}</span>
            <span className="bill-amount">
              ${Number(bill.amount_owed).toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
