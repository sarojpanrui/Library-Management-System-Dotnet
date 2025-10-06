import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import api from "../AxiosInstance/api";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10); // number of books per page
  const [newBook, setNewBook] = useState({
    name: "",
    description: "",
    author: "",
    IssuedBy: "",

  });

  const navigate = useNavigate();

  // Fetch books from API
  const fetchBook = async () => {
    try {
      const response = await api.get("http://localhost:5292/api/Book/allBook");
      console.log(response)
      setBooks(response.data.book || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

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

      // ✅ Success handling
      toast.success(response.data.message || "Book added successfully!");
      await fetchBook(); // refresh book list
      setNewBook({ name: "", description: "", author: "", issuedBy: "" });
      setIsModalOpen(false);
    } catch (error) {
      // ✅ Improved error handling
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


  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token"); // or from your auth context/state

    try {
      await axios.delete(
        `http://localhost:5292/api/Book/deleteBook/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Book delete successfully...")

      // Refresh your list after delete
      fetchBook();
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      // ✅ Improved error handling
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
        {}, // body can be empty if backend doesn't need it
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Book unissued successfully");
      fetchBook(); // refresh the book list
    } catch (error) {
      console.error("Error unissuing book:", error);
      toast.error("Failed to unissue the book");
    }
  };


  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="flex border p-2 rounded-2xl border-gray-300 px-3 hover:bg-gray-100 transition"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M12 19l-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </button>

        <h2 className="text-2xl font-bold">Book List</h2>
        <button
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Add Book
        </button>
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
              <th className="py-2 px-4 text-left">DueDate</th>
              <th className="py-2 px-4 text-left">Fine</th>



              {/* <th className="py-2 px-4 text-left">Copies</th> */}
              <th className="py-2 px-4 text-left">Delete</th>
              <th className="py-2 px-4 text-left">UnIssue</th>


            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book._id} className="border-b hover:bg-gray-50 transition">
                {/* <td className="py-2 px-4">{book.id}</td> */}
                <td className="py-2 px-4">{book.name}</td>
                <td className="py-2 px-4">{book.description}</td>
                <td className="py-2 px-4">{book.author}</td>
                <td className="py-2 px-4">{book.issuedby || "-"}</td>
                <td className="py-2 px-4">
                  {book.issueDate
                    ? new Date(book.issueDate).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "-"}
                </td>

                <td className="py-2 px-4">
                  {book.dueDate
                    ? new Date(book.dueDate).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "-"}
                </td>

                <td className="py-2 px-4 text-red-400">
                  {
                    book.overdueDays * 10
                  }
                </td>




                <td className="py-2 px-4">
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => deleteBook(book.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </td>

                <td className="py-2 px-4">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => unissue(book.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" /><path d="m5.082 11.09 8.828 8.828" /></svg>
                  </button>
                </td>





              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(books.length / booksPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">Add New Book</h3>

            <input
              type="text"
              name="name"
              placeholder="Book Name"
              value={newBook.name}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newBook.description}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
            {/* <input
              type="text"
              name="issuedBy"
              placeholder="Issued By (optional)"
              value={newBook.issuedBy}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-300"
            /> */}
            {/* New field for number of copies */}
            {/* <input
              type="number"
              name="copies"
              placeholder="Number of Copies"
              value={newBook.copies || ""}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-300"
              min="1"
            /> */}

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
                onClick={handleAddBook}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Book;
