"use client";

import { useState, useEffect } from "react";
import "./transactions.css";
import AddTransactionModal from "./addTransactionModal";

export interface Transaction {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view transactions");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/user/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [apiUrl]);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">Your Transactions</h1>
      <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>
        + Add Transaction
      </button>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id ?? `transaction-${index}`}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>{transaction.subcategory}</td>
              <td>{transaction.description}</td>
              <td className={transaction.amount < 0 ? "negative" : "positive"}>
                ${transaction.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} onTransactionAdded={handleTransactionAdded} />}
    </div>
  );
};

export default Transactions;
