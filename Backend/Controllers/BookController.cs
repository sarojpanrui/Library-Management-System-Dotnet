using Library.Models;
using Library.Services;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class BookController : ControllerBase
    {
        private readonly BookServices _bookServices;

        public BookController(BookServices bookServices)
        {
            _bookServices = bookServices;
        }


        [HttpPost("addBook")]
        public async Task<IActionResult> AddBook(Book book)
        {
            var existing = await _bookServices.GetByName(book.name);
            if (existing != null) return BadRequest(new { message = "Book already exists" });


            await _bookServices.AddBook(book);
            return Ok(new { message = "book registered successfully" });
        }


        [HttpGet("allBook")]

        public async Task<ActionResult> GetAllBook()
        {
            var book = await _bookServices.GetAll();
            return Ok(new { message = "all book fetched successfully", book });


        }

        [HttpDelete("deleteBook/{id}")]
        public async Task<ActionResult> DeleteBook(string id)
        {
            await _bookServices.DeleteBook(id);

            return Ok(new { message = "deleted successfullt" });
        }

        [HttpPut("issue/{id}")]
        // [HttpPut("issue/{id}")]
        public async Task<IActionResult> IssueBook(string id, [FromBody] IssueRequest request)
        {
            if (string.IsNullOrEmpty(request.IssuedBy))
                return BadRequest(new { message = "IssuedBy is required" });

            var updated = await _bookServices.IssueBookAsync(id, request.IssuedBy, request.IssueDate);

            if (!updated)
                return BadRequest(new { message = "Book not found or no copies available" });

            return Ok(new { message = "Book issued successfully" });
        }

        public class IssueRequest
        {
            public string IssuedBy { get; set; }
            public DateTime IssueDate { get; set; } = DateTime.UtcNow;
        }


        [HttpPut("unissue/{id}")]
        public async Task<IActionResult> UnIssueBook(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "Book ID is required" });
            }

            try
            {
                await _bookServices.UnIssueAsync(id);
                return Ok(new { message = "Book unissued successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error unissuing book", error = ex.Message });
            }
        }

    }
}

