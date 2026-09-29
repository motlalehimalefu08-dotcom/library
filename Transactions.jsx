import React, { useState } from "react";

function Transactions({
    books,
    setBooks,
    transactions,
    setTransactions,
    loggedInUser
}) {
    const isLibrarian = loggedInUser.role === "Librarian";

    const [transactionBook, setTransactionBook] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [transactionQuantity, setTransactionQuantity] = useState(1);

    const activeBorrow = transactions.find(
        t => t.userId === loggedInUser.id &&
        t.type === "borrow" &&
        t.status === "Borrowed"
    );

    const availableBooks = books.filter(
        book => Number(book.quantity) >= 2
    );

    function handleTypeChange(e) {
        setTransactionType(e.target.value);
        setTransactionBook("");
        setTransactionQuantity(1);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (isLibrarian) {
            addStock();
        } else if (transactionType === "borrow") {
            borrowBook();
        } else if (transactionType === "return") {
            returnBook();
        }
    }

    function addStock() {
        if (!transactionBook || transactionQuantity === "") {
            alert("Please select a book and enter quantity.");
            return;
        }

        const amount = Number(transactionQuantity);

        if (!Number.isInteger(amount) || amount < 1) {
            alert("Quantity must be a whole number greater than 0.");
            return;
        }

        const book = books.find(
            item => item.id === Number(transactionBook)
        );

        if (!book) {
            alert("Book not found.");
            return;
        }

        setBooks(
            books.map(item =>
                item.id === book.id
                    ? { ...item, quantity: Number(item.quantity) + amount }
                    : item
            )
        );

        const newTransaction = {
            id: Date.now(),
            bookId: book.id,
            bookTitle: book.title,
            type: "add",
            quantity: amount,
            userId: loggedInUser.id,
            userName: loggedInUser.name,
            membershipId: loggedInUser.membershipId,
            date: new Date().toLocaleDateString(),
            dueDate: "-",
            returnedDate: "-",
            status: "Completed"
        };

        setTransactions([...transactions, newTransaction]);
        resetForm();
    }

    function borrowBook() {
        if (isLibrarian) {
            alert("Only Users can borrow books.");
            return;
        }

        if (activeBorrow) {
            alert("You already have a borrowed book. Return it first.");
            return;
        }

        if (!transactionBook) {
            alert("Please select a book.");
            return;
        }

        const book = books.find(
            item => item.id === Number(transactionBook)
        );

        if (!book) {
            alert("Book not found.");
            return;
        }

        if (Number(book.quantity) < 2) {
            alert("This book is not available for borrowing.");
            return;
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + 7);

        const newTransaction = {
            id: Date.now(),
            bookId: book.id,
            bookTitle: book.title,
            type: "borrow",
            quantity: 1,
            userId: loggedInUser.id,
            userName: loggedInUser.name,
            membershipId: loggedInUser.membershipId,
            date: borrowDate.toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            returnedDate: "-",
            status: "Borrowed"
        };

        setBooks(
            books.map(item =>
                item.id === book.id
                    ? { ...item, quantity: Number(item.quantity) - 1 }
                    : item
            )
        );

        setTransactions([...transactions, newTransaction]);
        resetForm();
    }

    function returnBook() {
        if (isLibrarian) {
            alert("Only Users can return books.");
            return;
        }

        if (!activeBorrow) {
            alert("You have no borrowed book to return.");
            return;
        }

        const book = books.find(
            item => item.id === activeBorrow.bookId
        );

        if (book) {
            setBooks(
                books.map(item =>
                    item.id === book.id
                        ? { ...item, quantity: Number(item.quantity) + 1 }
                        : item
                )
            );
        }

        setTransactions(
            transactions.map(transaction =>
                transaction.id === activeBorrow.id
                    ? {
                          ...transaction,
                          returnedDate: new Date().toLocaleDateString(),
                          status: "Returned"
                      }
                    : transaction
            )
        );

        resetForm();
    }

    function deleteTransaction(id) {
        if (!isLibrarian) {
            alert("Only the Librarian can delete transactions.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this transaction?")) {
            setTransactions(
                transactions.filter(transaction => transaction.id !== id)
            );
        }
    }

    function resetForm() {
        setTransactionBook("");
        setTransactionType("");
        setTransactionQuantity(1);
    }

    const displayedTransactions = isLibrarian
        ? transactions
        : transactions.filter(
              transaction => transaction.userId === loggedInUser.id
          );

    return (
        <main className="main-content">
            <div className="page-title">
                <h2>Transactions</h2>
                <p>View and record books transactions.</p>
            </div>

            <div className="form-panel">
                <h2>Record Transaction</h2>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Book</label>

                        <select
                            value={transactionBook}
                            onChange={e => setTransactionBook(e.target.value)}
                        >
                            <option value="">Select Book</option>

                            {(isLibrarian ? books : availableBooks).map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title} ({book.quantity} available)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Transaction Type</label>

                        <select
                            value={transactionType}
                            onChange={handleTypeChange}
                        >
                            <option value="">Select Type</option>

                            {isLibrarian ? (
                                <option value="add">Add Stock</option>
                            ) : (
                                <>
                                    <option
                                        value="borrow"
                                        disabled={!!activeBorrow}
                                    >
                                        Borrow Book
                                    </option>

                                    <option
                                        value="return"
                                        disabled={!activeBorrow}
                                    >
                                        Return Book
                                    </option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>

                        <input
                            type="number"
                            min="1"
                            max={isLibrarian ? undefined : "1"}
                            value={transactionQuantity}
                            onChange={e =>
                                setTransactionQuantity(e.target.value)
                            }
                            readOnly={!isLibrarian}
                        />
                    </div>

                    <div className="form-button">
                        <button
                            className="primary-btn"
                            type="submit"
                            disabled={!transactionType}
                        >
                            Process Transaction
                        </button>
                    </div>
                </form>
            </div>

            <div className="content-card">
                <h2>Transaction History</h2>

                <div className="table-container">
                    <table id="transactionTable">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Due Date</th>
                                <th>Returned</th>
                                <th>Status</th>
                                {isLibrarian && <th>Action</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {displayedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={isLibrarian ? 9 : 8}>
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                displayedTransactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.bookTitle}</td>
                                        <td>
                                            {transaction.type === "add"
                                                ? "Stock Added"
                                                : transaction.type === "borrow"
                                                ? "Borrow"
                                                : "Return"}
                                        </td>
                                        <td>{transaction.quantity}</td>
                                        <td>{transaction.userName}</td>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.dueDate}</td>
                                        <td>{transaction.returnedDate}</td>
                                        <td>{transaction.status}</td>

                                        {isLibrarian && (
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteTransaction(
                                                            transaction.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

export default Transactions;