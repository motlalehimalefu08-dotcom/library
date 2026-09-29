import React, { useState } from "react";

function Users({
    users,
    setUsers,
    transactions,
    loggedInUser,
    updateLoggedInUser
}) {
    const [name, setName] = useState("");
    const [membershipId, setMembershipId] = useState("");
    const [role, setRole] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !membershipId || !role) {
            alert("Please fill in all fields.");
            return;
        }

        if (
            users.some(
                user =>
                    user.membershipId.toLowerCase() ===
                    membershipId.trim().toLowerCase()
            )
        ) {
            alert("A user with this Membership ID already exists.");
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            membershipId: membershipId.trim(),
            role
        };

        setUsers([...users, newUser]);

        setName("");
        setMembershipId("");
        setRole("");
    }

    function updateUser(id) {
        const user = users.find(item => item.id === id);

        if (!user) return;

        const newName = prompt("Enter name:", user.name);

        if (newName === null) return;

        const newMembershipId = prompt(
            "Enter Membership ID:",
            user.membershipId
        );

        if (newMembershipId === null) return;

        const newRole = prompt(
            "Enter role (Librarian or User):",
            user.role
        );

        if (newRole === null) return;

        if (newRole !== "Librarian" && newRole !== "User") {
            alert("Role must be Librarian or User.");
            return;
        }

        if (
            users.some(
                item =>
                    item.id !== id &&
                    item.membershipId.toLowerCase() ===
                        newMembershipId.trim().toLowerCase()
            )
        ) {
            alert("Another user already uses this Membership ID.");
            return;
        }

        const updatedUser = {
            ...user,
            name: newName.trim(),
            membershipId: newMembershipId.trim(),
            role: newRole
        };

        setUsers(
            users.map(item =>
                item.id === id ? updatedUser : item
            )
        );

        if (user.id === loggedInUser.id) {
            updateLoggedInUser(updatedUser);
        }
    }

    function deleteUser(id) {
        if (id === loggedInUser.id) {
            alert("You cannot delete the currently logged-in Librarian.");
            return;
        }

        const activeBorrow = transactions.some(
            transaction =>
                transaction.userId === id &&
                transaction.type === "borrow" &&
                transaction.status === "Borrowed"
        );

        if (activeBorrow) {
            alert(
                "This user cannot be deleted because they have a borrowed book."
            );
            return;
        }

        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(user => user.id !== id));
        }
    }

    return (
        <main className="main-content">
            <div className="page-title">
                <h2>User Management</h2>
                <p>Add, update and delete library users.</p>
            </div>

            <div className="form-panel">
                <h2>Add User</h2>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Membership ID</label>

                        <input
                            type="text"
                            value={membershipId}
                            onChange={e =>
                                setMembershipId(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>

                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="">
                                Select Role
                            </option>
                            <option value="Librarian">
                                Librarian
                            </option>
                            <option value="User">
                                User
                            </option>
                        </select>
                    </div>

                    <div className="form-button">
                        <button
                            className="primary-btn"
                            type="submit"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>

            <div className="content-card" id="userListPanel">
                <h2>User List</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Membership ID</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.membershipId}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                className="update-btn"
                                                onClick={() =>
                                                    updateUser(user.id)
                                                }
                                            >
                                                Update
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteUser(user.id)
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

export default Users;