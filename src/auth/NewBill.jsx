import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../CSSnewbill.css";

export default function NewBill() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [refNum, setRefNum] = useState("");
  const [total, setTotal] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [guests, setGuests] = useState([""]);
  const [splitType, setSplitType] = useState("even");
  const [items, setItems] = useState([
    { name: "", quantity: 1, price: "", guestIndex: 0 },
  ]);
  const [percentages, setPercentages] = useState([]);
  const totalNumber = Number(total) || 0;

  const updateGuest = (index, value) => {
    const copy = [...guests];
    copy[index] = value;
    setGuests(copy);
  };

  const updateGuestCount = (count) => {
    setGuestCount(count);
    setGuests(Array.from({ length: count }, () => ""));
    setPercentages(Array.from({ length: count }, () => 0));
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: "", guestIndex: 0 }]);
  };
  console.log("NewBill rendered");
  return (
    <section>
      <h1> Add New Bill</h1>
    </section>
  );
}
