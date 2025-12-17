import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function BillDetail() {
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
}

if (loading) return <p>Loading Bill...</p>;
if (error) return <p>{error}</p>;
