import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// imort useNavigate

const Issue = () => {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [issuedBooks, setIssuedBooks] = useState([]);

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedBook, setSelectedBook] = useState("");

    const navigate = useNavigate();

    // Fetch users
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5292/api/Auth/allUser");
            console.log(res);
            setUsers(res.data.userlist || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    // Fetch books
    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://localhost:5292/api/Book/allBook");
            const allBooks = res.data.book || [];
            console.log(allBooks);

            setBooks(allBooks);
            setIssuedBooks(allBooks.filter((b) => b.issuedBy)); // issued ones
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchBooks();
    }, []);

    // Handle issuing book
    const handleIssue = async () => {
        if (!selectedUser || !selectedBook) {
            alert("Please select both user and book");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            await axios.put(
                `http://localhost:5292/api/Book/issue/${selectedBook}`,
                { issuedBy: selectedUser }, // ✅ body
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ config
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Book issued successfully");
            fetchBooks(); // refresh list
            setSelectedBook("");
            setSelectedUser("");
        } catch (err) {
            console.error("Error issuing book:", err);
            toast.error("Failed to issue book");
        }
    };


    return (
        <div className="p-6">

            <button onClick={() => { navigate(-1) }} className="flex gap-2 border p-2 border-gray-300 rounded-2xl mb-5">

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>Back


            </button>
            <h2 className="text-2xl font-bold mb-4"> Issue Book</h2>

            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="mb-4">
                    <label className="block font-medium mb-2">Select User</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Choose User --</option>
                        {users.filter(use => use.role !==  "admin").map((u) => (
                            <option key={u.id} value={u.username}>
                                {u.username} ({u.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-2">Select Book</label>
                    <select
                        value={selectedBook}
                        onChange={(e) => setSelectedBook(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Choose Book --</option>
                        {books
                            .filter((b) => b.issuedby == null) // only available copies
                            .map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name} by {b.author}
                                </option>
                            ))}

                    </select>
                </div>

                <button
                    onClick={handleIssue}
                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
                >
                    Issue Book
                </button>
            </div>




        </div>
        // </div>
    );
};

export default Issue;
