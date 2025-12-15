import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../CSSnewbills.css";

export default function Bills() {
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
}
