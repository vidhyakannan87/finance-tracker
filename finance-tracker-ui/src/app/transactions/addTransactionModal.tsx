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

  const [categories, setCategories] = useState<Record<string, string>>({});
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [transaction, setTransaction] = useState({
    date: "",
    category: "",
    subcategory: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories`);
        if (!response.ok)
          throw new Error("Failed to fetch transaction categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const fetchSubcategories = async (category: string) => {
    if (!category) {
      setSubcategories([]);
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/categories/${category}/subcategories`
      );
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      setSubcategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));

    if (name === "category") fetchSubcategories(value);
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

      if (!response.ok) throw new Error("Failed to add transaction");

      // const text = await response.text();
      // const newTransaction = text ? JSON.parse(text) : null;
      const newTransaction = await response.json();

      if (newTransaction) {
        onTransactionAdded(newTransaction);
      } else {
        console.warn("Transaction added successfully, but response was empty.");

      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to add transaction"
      );
    }
  };

  if (error) return <div className="error-message">{error}</div>;

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
            value={transaction.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          <label>Subcategory:</label>
          <select
            name="subcategory"
            value={transaction.subcategory}
            onChange={handleChange}
            required
            disabled={!transaction.category}
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>

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

          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
