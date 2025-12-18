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
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    item_name: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    async function loadBill() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/bills/${id}`,
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
        `${import.meta.env.VITE_API_URL}/bills/${id}/pay`,
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bills/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete bill");

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  }

  function editItem(item) {
    setEditingItem(item.id);
    setEditForm({
      item_name: item.item_name,
      quantity: item.quantity,
      price: item.price,
    });
  }

  async function handleUpdateItem(itemId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bills/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) throw new Error("Failed to update item");
      const updatedItem = await response.json();

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );

      setEditingItem(null);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDeleteItem(itemId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bills/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((item) => item.id !== itemId));
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
            <section key={split.id} className="split-row">
              <span>{split.guest_name}</span>
              <span>${Number(split.amount_owed).toFixed(2)}</span>
            </section>
          ))}
        </section>
        {bill.type === "per_item" && (
          <section className="bill-items">
            <h3>Items</h3>

            {items.map((item) => (
              <section key={item.id} className="item-row">
                {" "}
                {editingItem === item.id ? (
                  <>
                    <input
                      value={editForm.item_name}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          item_name: event.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      value={editForm.quantity}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          quantity: event.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(event) =>
                        setEditForm({ ...editForm, price: event.target.value })
                      }
                    />

                    <button onClick={() => handleUpdateItem(item.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingItem(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <section className="item-info">
                      <span>{item.guest_name}</span>
                      <span>{item.item_name}</span>
                      <span>{item.quantity}</span>
                      <span>${(item.quantity * item.price).toFixed(2)}</span>
                    </section>

                    <section className="item-actions">
                      <button onClick={() => editItem(item)}>Update</button>
                      <button onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </button>
                    </section>
                  </>
                )}
              </section>
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
