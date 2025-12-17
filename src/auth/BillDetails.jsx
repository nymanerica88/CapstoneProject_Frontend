import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../CSSbilldetail.css";

export default function BillDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <p>You must be logged in to view bill details</p>;
  }

  const [bill, setBill] = useState(null);
  const [splits, setSplits] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBill() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/bills/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to load bill");

        const data = await response.json();
        setBill(data.bill);
        setSplits(data.splits);
        setItems(data.items);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadBill();
  }, [id, token]);

  async function handleMarkPaid() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/bills/${id}/pay`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to mark bill as paid");

      const updatedBill = await response.json();
      setBill(updatedBill);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      throw error;
    }
  }

  async function handleDeleteBill() {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this bill?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/bills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete bill");

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) return <p>Loading Bill...</p>;
  if (error) return <p>{error}</p>;
  if (!bill) return <p> Bill not found</p>;

  return (
    <>
      <section className="entire-bill-detail-section">
        <section className="bill-detail">
          <h2>Bill #{bill.ref_num}</h2>

          <p>
            <strong>Total:</strong> ${Number(bill.total).toFixed(2)}
          </p>
          <p>
            <strong>Split Type:</strong>
            {bill.type}
          </p>
        </section>
        <section className="bill-splits">
          <h3>Bill Split</h3>
          {splits.map((split) => (
            <div key={split.id} className="split-row">
              <span>{split.guest_name}</span>
              <span>${Number(split.amount_owed).toFixed(2)}</span>
            </div>
          ))}
        </section>
        {bill.type === "per_item" && (
          <section className="bill-items">
            <h3>Items</h3>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <span>{item.guest_name}</span>
                <span>{item.item_name}</span>
                <span>{item.quantity}</span>
                <span>
                  ${(Number(item.quantity) * Number(item.price)).toFixed(2)}
                </span>
              </div>
            ))}
          </section>
        )}
        <section className="bill-actions">
          <button className="delete" onClick={handleDeleteBill}>
            Delete Bill
          </button>

          <button
            className={`mark-paid ${bill.is_paid ? "paid" : ""}`}
            onClick={handleMarkPaid}
            disabled={bill.is_paid}
          >
            {bill.is_paid ? "Paid" : "Mark as Paid"}
          </button>
        </section>
      </section>
    </>
  );
}
