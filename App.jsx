import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

function App() {
    const navigate = useNavigate();

    const [books, setBooks] = useState(() =>
        JSON.parse(localStorage.getItem("books")) || []
    );

    const [users, setUsers] = useState(() =>
        JSON.parse(localStorage.getItem("users")) || []
    );

    const [transactions, setTransactions] = useState(() =>
        JSON.parse(localStorage.getItem("transactions")) || []
    );

    const [loggedInUser, setLoggedInUser] = useState(() =>
        JSON.parse(localStorage.getItem("loggedInUser")) || null
    );

    useEffect(() => {
        localStorage.setItem("books", JSON.stringify(books));
    }, [books]);

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        if (!users.some(
            user =>
                user.membershipId.toLowerCase() === "a01" &&
                user.role === "Librarian"
        )) {
            const librarian = {
                id: Date.now(),
                name: "AGNES",
                membershipId: "A01",
                role: "Librarian"
            };

            setUsers(currentUsers => [...currentUsers, librarian]);
        }
    }, []);

    function login(membershipId, role) {
        const user = users.find(
            item =>
                item.membershipId.toLowerCase() === membershipId.toLowerCase() &&
                item.role === role
        );

        if (!user) {
            return false;
        }

        setLoggedInUser(user);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate("/dashboard");
        return true;
    }

    function logout() {
        setLoggedInUser(null);
        localStorage.removeItem("loggedInUser");
        navigate("/login");
    }

    function updateLoggedInUser(updatedUser) {
        setLoggedInUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    }

    if (!loggedInUser) {
        return (
            <Routes>
                <Route
                    path="/login"
                    element={
                        <Login
                            users={users}
                            login={login}
                        />
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        );
    }

    return (
        <>
            <Navbar
                loggedInUser={loggedInUser}
                logout={logout}
            />

            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <Dashboard
                            books={books}
                            transactions={transactions}
                            loggedInUser={loggedInUser}
                        />
                    }
                />

                <Route
                    path="/books"
                    element={
                        loggedInUser.role === "Librarian" ? (
                            <Books
                                books={books}
                                setBooks={setBooks}
                                transactions={transactions}
                            />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <Transactions
                            books={books}
                            setBooks={setBooks}
                            transactions={transactions}
                            setTransactions={setTransactions}
                            loggedInUser={loggedInUser}
                        />
                    }
                />

                <Route
                    path="/users"
                    element={
                        loggedInUser.role === "Librarian" ? (
                            <Users
                                users={users}
                                setUsers={setUsers}
                                transactions={transactions}
                                loggedInUser={loggedInUser}
                                updateLoggedInUser={updateLoggedInUser}
                            />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )
                    }
                />

                <Route
                    path="/login"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>

            <footer className="footer">
                ©Making Knowledge Accessible To Everyone
            </footer>
        </>
    );
}

export default App;