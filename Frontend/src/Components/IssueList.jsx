import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast"; // if you use react-toastify for notifications

const IssueList = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10); // number of books per page
    const [newBook, setNewBook] = useState({
        name: "",
        description: "",
        author: "",
        issuedBy: "",
    });

    const finePerDay = 10; // fine per overdue day
    const navigate = useNavigate();

    // Fetch books from API
    const fetchBook = async () => {
        try {
            const response = await axios.get("http://localhost:5292/api/Book/allBook");
            setBooks(response.data.book || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBook();
    }, []);

    // Filter only issued books
    const issuedBooks = books.filter((book) => book.issuedby);

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = issuedBooks.slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Handle input changes in modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    // Add book handler
    const handleAddBook = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in as an admin to add a book.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5292/api/Book/addBook",
                newBook,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message || "Book added successfully!");
            await fetchBook();
            setNewBook({ name: "", description: "", author: "", issuedBy: "" });
            setIsModalOpen(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Unauthorized! Please log in again.");
                } else if (error.response.status === 403) {
                    alert("Forbidden! Only admins can add books.");
                } else {
                    alert(error.response.data.message || "Error adding book.");
                }
            } else {
                console.error("Network or server error:", error);
                alert("Network error. Please try again.");
            }
        }
    };

    // Delete book
    const deleteBook = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        try {
            await axios.delete(`http://localhost:5292/api/Book/deleteBook/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchBook();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    // Unissue book
    const unissue = async (id) => {
        const confirmUnissue = window.confirm("Are you sure you want to unissue this book?");
        if (!confirmUnissue) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to unissue a book.");
            return;
        }

        try {
            await axios.put(
                `http://localhost:5292/api/Book/unissue/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Book unissued successfully");
            fetchBook();
        } catch (error) {
            console.error("Error unissuing book:", error);
            toast.error("Failed to unissue the book");
        }
    };

    return (
        <div className="p-6">
            <button
                className="flex border p-2 rounded-2xl border-gray-300 px-3 hover:bg-gray-100 transition  gap-2"
                onClick={() => navigate(-1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                Back
            </button>
            {/* Header */}
            <div className="flex justify-center items-center mb-4">


                <h2 className="text-2xl font-bold text-center">Issued Book List</h2>

                {/* <button
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Add Book
        </button> */}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-sky-200">
                        <tr>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Description</th>
                            <th className="py-2 px-4 text-left">Author</th>
                            <th className="py-2 px-4 text-left">Issued By</th>
                            <th className="py-2 px-4 text-left">Issued Date</th>
                            <th className="py-2 px-4 text-left">Due Date</th>
                            <th className="py-2 px-4 text-left">Overdue Days</th>
                            <th className="py-2 px-4 text-left">Fine (₹)</th>
                            {/* <th className="py-2 px-4 text-left">Delete</th>
                            <th className="py-2 px-4 text-left">Unissue</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book) => (
                                <tr key={book._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-2 px-4">{book.name}</td>
                                    <td className="py-2 px-4">{book.description}</td>
                                    <td className="py-2 px-4">{book.author}</td>
                                    <td className="py-2 px-4">{book.issuedby}</td>
                                    <td className="py-2 px-4">
                                        {book.issueDate
                                            ? new Date(book.issueDate).toLocaleString("en-IN")
                                            : "-"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {book.dueDate
                                            ? new Date(book.dueDate).toLocaleString("en-IN")
                                            : "-"}
                                    </td>
                                    <td className="py-2 px-4">{book.overdueDays || 0}</td>
                                    <td className="py-2 px-4 text-red-500">
                                        {(book.overdueDays || 0) * finePerDay}
                                    </td>


                                    {/* <td className="py-2 px-4">
                                        <button
                                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                                            onClick={() => deleteBook(book._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                                            onClick={() => unissue(book._id)}
                                        >
                                            Unissue
                                        </button>
                                    </td> */}


                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center py-4 text-gray-500">
                                    No books are currently issued.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <Stack spacing={2}>
                        <Pagination
                            count={Math.ceil(issuedBooks.length / booksPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default IssueList;
