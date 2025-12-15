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

  const evenSplit = useMemo(() => {
    if (!guests.length) return [];

    const amount = totalNumber / guests.length;

    return guests.map((guestName) => ({
      guest: guestName,
      amount: amount,
    }));
  }, [guests, totalNumber]);

  const perItemSplit = useMemo(() => {
    const totals = {};

    guests.forEach((_, index) => {
      totals[index] = 0;
    });

    items.forEach((item) => {
      const itemTotal = Number(item.price || 0) * Number(item.quantity || 0);
      totals[item.guestIndex] += itemTotal;
    });

    return Object.entries(totals).map(([index, amount]) => ({
      guest: guests[index],
      amount: amount,
    }));
  }, [items, guests]);

  const percentageSplit = useMemo(() => {
    return guests.map((guestName, index) => ({
      guest: guestName,
      amount: totalNumber * (percentages[index] || 0),
    }));
  }, [percentages, guests, totalNumber]);

  console.log("NewBill rendered");
  return (
    <section>
      <h1> Add New Bill</h1>
    </section>
  );
}
