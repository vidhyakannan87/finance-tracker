"use client";

import { useEffect, useState } from "react";
import "./transactions.css";
import { Transaction } from "./page";

interface AddTransactionModalProps {
  onClose: () => void;
  onTransactionAdded: (transaction: Transaction) => void;
}

const AddTransactionModal = ({
  onClose,
  onTransactionAdded,
}: AddTransactionModalProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transaction categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const [transaction, setTransaction] = useState({
    date: "",
    category: "",
    subcategory: "",
    description: "",
    amount: "",
  });

  const fetchSubcategories = async (category: string) => {
    try {
      const response = await fetch(`${apiUrl}/${category}/subcategories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch transaction subcategories");
      }
      const data = await response.json();
      setSubcategories(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (error) return <div>{error}</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "category") {
      fetchSubcategories(e.target.value);
    }
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/user/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      const newTransaction = await response.json();
      onTransactionAdded(newTransaction);
    } catch (error) {
      console.error(error);
      alert("Failed to add transaction");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={transaction.date}
            onChange={handleChange}
            required
          />

          <label>Category:</label>
          <select
            name="category"
            value={transaction.category || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label>Subcategory:</label>
          <input
            type="list"
            name="subcategory"
            value={transaction.subcategory}
            onChange={handleChange}
            required
          />

          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            required
          />

          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            required
          />

          <button type="submit">Add</button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
