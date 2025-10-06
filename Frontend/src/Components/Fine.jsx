import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Fine = () => {
  const [books, setBooks] = useState([]);
  const finePerDay = 10; // ₹ per day

  const navigate = useNavigate();
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get("http://localhost:5292/api/Book/allBook");
        setBooks(response.data.book || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBook();
  }, []);

  // Filter books that have fine
  const booksWithFine = books.filter(book => book.isOverdue);

  return (
    <div className="p-6">
      <button
        className="flex border p-2 rounded-2xl border-gray-300 px-3 hover:bg-gray-100 transition  gap-2 mb-5"
        onClick={() => navigate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
        Back
      </button>      <h2 className="text-2xl font-bold mb-4">Books with Fine</h2>

      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="py-2 px-4 text-left">Issued By</th>
            <th className="py-2 px-4 text-left">Overdue Days</th>
            <th className="py-2 px-4 text-left">Fine (₹)</th>
          </tr>
        </thead>
        <tbody>
          {booksWithFine.map((book) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{book.name}</td>
              <td className="py-2 px-4">{book.author}</td>
              <td className="py-2 px-4">{book.issuedby}</td>
              <td className="py-2 px-4">{book.overdueDays}</td>
              <td className="py-2 px-4">{book.overdueDays * finePerDay}</td>
            </tr>
          ))}
          {booksWithFine.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No books with fine.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Fine;
