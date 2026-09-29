import React, { useState } from "react";

function Books({ books, setBooks, transactions }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [isbn, setIsbn] = useState("");
    const [quantity, setQuantity] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!title || !author || !genre || !isbn || quantity === "") {
            alert("Please fill in all fields.");
            return;
        }

        const numberQuantity = Number(quantity);

        if (!Number.isInteger(numberQuantity) || numberQuantity < 0) {
            alert("Quantity must be a whole number of 0 or more.");
            return;
        }

        if (
            books.some(
                book =>
                    book.isbn.toLowerCase() === isbn.trim().toLowerCase()
            )
        ) {
            alert("A book with this ISBN already exists.");
            return;
        }

        const newBook = {
            id: Date.now(),
            title: title.trim(),
            author: author.trim(),
            genre: genre.trim(),
            isbn: isbn.trim(),
            quantity: numberQuantity
        };

        setBooks([...books, newBook]);

        setTitle("");
        setAuthor("");
        setGenre("");
        setIsbn("");
        setQuantity("");
    }

    function updateBook(id) {
        const book = books.find(item => item.id === id);

        if (!book) return;

        const newTitle = prompt("Enter book title:", book.title);
        if (newTitle === null) return;

        const newAuthor = prompt("Enter author:", book.author);
        if (newAuthor === null) return;

        const newGenre = prompt("Enter genre:", book.genre);
        if (newGenre === null) return;

        const newISBN = prompt("Enter ISBN:", book.isbn);
        if (newISBN === null) return;

        if (
            books.some(
                item =>
                    item.id !== id &&
                    item.isbn.toLowerCase() ===
                        newISBN.trim().toLowerCase()
            )
        ) {
            alert("Another book already uses this ISBN.");
            return;
        }

        setBooks(
            books.map(item =>
                item.id === id
                    ? {
                          ...item,
                          title: newTitle.trim(),
                          author: newAuthor.trim(),
                          genre: newGenre.trim(),
                          isbn: newISBN.trim()
                      }
                    : item
            )
        );
    }

    function deleteBook(id) {
        const activeBorrow = transactions.some(
            transaction =>
                transaction.bookId === id &&
                transaction.type === "borrow" &&
                transaction.status === "Borrowed"
        );

        if (activeBorrow) {
            alert("This book cannot be deleted because it is currently borrowed.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this book?")) {
            setBooks(books.filter(book => book.id !== id));
        }
    }

    return (
        <main className="main-content">
            <div className="page-title">
                <h2>Book Management</h2>
                <p>Add, update and delete library books.</p>
            </div>

            <div className="form-panel">
                <h2>Add New Book</h2>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Genre</label>
                        <input
                            type="text"
                            value={genre}
                            onChange={e => setGenre(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>ISBN</label>
                        <input
                            type="text"
                            value={isbn}
                            onChange={e => setIsbn(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Initial Quantity</label>
                        <input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="form-button">
                        <button className="primary-btn" type="submit">
                            Add Book
                        </button>
                    </div>
                </form>
            </div>

            <div className="content-card">
                <h2>Book List</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan="6">
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
                                        <td>
                                            <button
                                                className="update-btn"
                                                onClick={() =>
                                                    updateBook(book.id)
                                                }
                                            >
                                                Update
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteBook(book.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
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

export default Books;