import React from "react";

function Dashboard({ books, transactions, loggedInUser }) {
    const isLibrarian = loggedInUser.role === "Librarian";

    const totalBooks = books.reduce(
        (total, book) => total + Number(book.quantity),
        0
    );

    const lowStock = books.filter(
        book => Number(book.quantity) < 2
    );

    const myTransactions = transactions.filter(
        transaction => transaction.userId === loggedInUser.id
    );

    const activeBorrow = myTransactions.find(
        transaction =>
            transaction.type === "borrow" &&
            transaction.status === "Borrowed"
    );

    return (
        <main className="main-content">
            <div className="page-title">
                <h2>Dashboard</h2>
                <p>Library overview and book availability.</p>
            </div>

            {isLibrarian ? (
                <>
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <h3>Total Books</h3>
                            <p>{books.length}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Total Copies</h3>
                            <p>{totalBooks}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Low Stock</h3>
                            <p>{lowStock.length}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Total Users</h3>
                            <p>
                                {JSON.parse(
                                    localStorage.getItem("users")
                                )?.length || 0}
                            </p>
                        </div>
                    </div>

                    <div className="content-card">
                        <h2>Book Availability</h2>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Genre</th>
                                        <th>ISBN</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {books.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                No books available.
                                            </td>
                                        </tr>
                                    ) : (
                                        books.map(book => (
                                            <tr
                                                key={book.id}
                                                className={
                                                    Number(book.quantity) < 2
                                                        ? "low-stock"
                                                        : ""
                                                }
                                            >
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>{book.genre}</td>
                                                <td>{book.isbn}</td>
                                                <td>{book.quantity}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div id="memberDashboard">
                    <div className="content-card">
                        <h2>My Library</h2>

                        {activeBorrow ? (
                            <>
                                <p>
                                    <strong>Borrowed Book:</strong>{" "}
                                    {activeBorrow.bookTitle}
                                </p>

                                <p>
                                    <strong>Borrow Date:</strong>{" "}
                                    {activeBorrow.date}
                                </p>

                                <p>
                                    <strong>Due Date:</strong>{" "}
                                    {activeBorrow.dueDate}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {activeBorrow.status}
                                </p>
                            </>
                        ) : (
                            <p>You currently have no borrowed books.</p>
                        )}
                    </div>

                    <div className="content-card">
                        <h2>Available Books</h2>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Genre</th>
                                        <th>ISBN</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {books.filter(
                                        book => Number(book.quantity) >= 2
                                    ).length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                No books currently available
                                                for borrowing.
                                            </td>
                                        </tr>
                                    ) : (
                                        books
                                            .filter(
                                                book =>
                                                    Number(book.quantity) >= 2
                                            )
                                            .map(book => (
                                                <tr key={book.id}>
                                                    <td>{book.title}</td>
                                                    <td>{book.author}</td>
                                                    <td>{book.genre}</td>
                                                    <td>{book.isbn}</td>
                                                    <td>{book.quantity}</td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Dashboard;