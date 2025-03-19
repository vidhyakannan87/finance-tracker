"use client";

import { useState, useEffect } from "react";
import "./transactions.css";
import AddTransactionModal from "./addTransactionModal";
import EditTransactionModal from "./editTransactionModal";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

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

  const updateTransaction = async (updatedTransaction: Transaction) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update transactions");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/user/transactions/${updatedTransaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTransaction),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      if (!updatedTransaction.id) {
        console.warn(
          "Modified transaction is missing an ID. Fetching full list instead."
        );
        fetchTransactions();
      } else {
        setTransactions((prevTransactions) =>
          prevTransactions.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
          )
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete transactions");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/user/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      if (!transactionId) {
        console.warn(
          "Deleted transaction is missing an ID. Fetching full list instead."
        );
        fetchTransactions();
      } else {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((t) => t.id !== transactionId)
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    if (!newTransaction.id) {
      console.warn(
        "New transaction is missing an ID. Fetching full list instead."
      );
      fetchTransactions();
    } else {
      setTransactions((prevTransactions) => [
        newTransaction,
        ...prevTransactions,
      ]);
    }
  };

  const handleTransactionDeleted = (transactionId: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((t) => t.id !== transactionId)
    );
    deleteTransaction(transactionId);
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction);
    setIsEditModalOpen(false);
  };

  const openEditModal = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">Your Transactions</h1>
      <button
        className="add-transaction-btn"
        onClick={() => setIsAddModalOpen(true)}
      >
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(transaction.date));

            return (
              <tr key={transaction.id ?? `transaction-${index}`}>
                <td className="transaction-date">{formattedDate}</td>
                <td className="transaction-category">{transaction.category}</td>
                <td className="transaction-subcategory">
                  {transaction.subcategory ?? "N/A"}
                </td>
                <td className="transaction-description">
                  {transaction.description}
                </td>
                <td
                  className={`transaction-amount ${
                    transaction.amount < 0 ? "negative" : "positive"
                  }`}
                >
                  ${transaction.amount?.toFixed(2)}
                </td>
                <td className="transaction-actions">
                  <div className="action-buttons">
                    <button
                      className="edit-transaction-btn"
                      onClick={() => openEditModal(transaction)}
                    >
                      ✏️ Edit
                    </button>
                    <span> | </span>
                    <button
                      className="delete-transaction-btn"
                      onClick={() => handleTransactionDeleted(transaction.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isAddModalOpen && (
        <AddTransactionModal
          onClose={() => setIsAddModalOpen(false)}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      {isEditModalOpen && transactionToEdit && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onTransactionUpdated={handleTransactionUpdated}
        />
      )}
    </div>
  );
};

export default Transactions;
