// src/app/transactions/page.tsx
"use client"; // Ensure this is a client-side component

import { useState, useEffect } from "react";
import "./transactions.css";

interface Transaction {
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

  // Use the environment variable for the API URL
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

  // Fetch transactions when the page loads
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      console.log("token", token);
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
        // Handle errors
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">Your Transactions</h1>
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
          {transactions.map((transaction,index) => (
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
    </div>
  );
};

export default Transactions;
