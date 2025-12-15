import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../CSSnewbill.css";

export default function NewBill() {
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <p>You must be logged in to add a bill</p>;
  }

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

  const handleSubmit = async () => {
    const payload = {
      ref_num: refNum,
      total: totalNumber,
      split_type: splitType,
      guests: guests,
      items:
        splitType === "per_item"
          ? items.map((item) => ({
              name: item.name,
              quantity: Number(item.quantity),
              price: Number(item.price),
              guest_id: item.guestIndex,
            }))
          : [],

      percentages:
        splitType === "percentage"
          ? percentages.map((percent, index) => ({
              guest_id: index,
              percent: percent,
            }))
          : [],
    };

    const response = await fetch(`${import.meta.env.VITE_API}/bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      navigate("/profile");
    } else {
      const text = await response.text();
      alert(text);
    }
  };

  return (
    <>
      <section className="bill-details">
        <h2> Bill Details</h2>
        <input
          placeholder="Bill Ref Number"
          value={refNum}
          onChange={(event) => setRefNum(event.target.value)}
        />

        <input
          type="number"
          placeholder="Total Bill Amount"
          value={total}
          onChange={(event) => setTotal(event.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Total # of Guests"
          value={guestCount}
          onChange={(event) => updateGuestCount(Number(event.target.value))}
        />
      </section>

      {/* <section className="guest-names">
        <h2>Guest Names</h2>
        {guests.map((guestName, index) => (
          <input
            key={index}
            placeholder="guest_name"
            value={guestName}
            onChange={(event) => updatedGuest(index, event.target.value)}
          />
        ))}
      </section> */}

      <section className="split-type">
        <h2>Split Type</h2>
        <label>
          <input
            type="radio"
            value="even"
            checked={splitType === "even"}
            onChange={() => setSplitType("even")}
          />
          Even
        </label>

        <label>
          <input
            type="radio"
            value="per_item"
            checked={splitType === "per_item"}
            onChange={() => setSplitType("per_item")}
          />
          Per Item
        </label>

        <label>
          <input
            type="radio"
            value="percentage"
            checked={splitType === "percentage"}
            onChange={() => setSplitType("percentage")}
          />
          Percentage
        </label>
      </section>

      <section>
        {splitType === "per_item" && (
          <>
            <h3>Item Assignments</h3>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  placeholder="item_name"
                  value={item.name}
                  onChange={(event) =>
                    updateItem(index, "name", event.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="quantity"
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(index, "quantity, event.target.value")
                  }
                />
                <select
                  value={item.guestIndex}
                  onChange={(event) =>
                    updateItem(index, "guestIndex", Number(event.target.value))
                  }
                >
                  {guests.map((guest, guestIndex) => (
                    <option key={guestIndex} value={guestIndex}>
                      {guest || "Guest " + (guestIndex + 1)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" onClick={addItem}>
              + Add Item
            </button>
          </>
        )}
      </section>
    </>
  );
}
