import React, { useState } from "react";

function Login({ users, login }) {
    const [membershipId, setMembershipId] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!membershipId || !role) {
            setMessage("Please enter your Membership ID and select a role.");
            return;
        }

        const success = login(membershipId, role);

        if (!success) {
            setMessage("Invalid Membership ID or role.");
        }
    }

    return (
        <div className="login-screen">
            <div className="login-box">
                <h1>Thabong Community Library</h1>
                <p>Library Management System</p>

                <form onSubmit={handleSubmit}>
                    <label>Membership ID</label>
                    <input
                        type="text"
                        value={membershipId}
                        onChange={(e) => setMembershipId(e.target.value)}
                        placeholder="Enter Membership ID"
                    />

                    <label>Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="Librarian">Librarian</option>
                        <option value="User">User</option>
                    </select>

                    <button className="primary-btn" type="submit">
                        Login
                    </button>
                </form>

                {message && (
                    <p className="login-message error">
                        {message}
                    </p>
                )}

                <div className="login-note">
                    Accounts are created by the Librarian.
                </div>
            </div>
        </div>
    );
}

export default Login;