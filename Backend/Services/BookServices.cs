namespace Library.Services;

using MongoDB.Driver;
using Library.Models;
using Microsoft.Extensions.Options;
using Library.Config;

public class BookServices
{
    private readonly IMongoCollection<Book> _book;

    public BookServices(IOptions<LibraryDataBaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);

        _book = database.GetCollection<Book>(settings.Value.BookCollection);
    }


    public async Task AddBook(Book book) => await _book.InsertOneAsync(book);

    public async Task<Book?> GetByName(string name) =>
        await _book.Find(b => b.name == name).FirstOrDefaultAsync();

    public async Task<List<Book>> GetAll()
    {
        return await _book.Find(b => true).ToListAsync();

    }


    public async Task DeleteBook(string id)
    {
        await _book.DeleteOneAsync(b => b.Id == id);
    }

    public async Task<bool> IssueBookAsync(string bookId, string issuedBy, DateTime IssueDate)
    {
        var filter = Builders<Book>.Filter.And(
            Builders<Book>.Filter.Eq(b => b.Id, bookId)
        );

        var update = Builders<Book>.Update
            .Set(b => b.Issuedby, issuedBy)
            .Set(b => b.IssueDate, IssueDate)
            .Set(b => b.DueDate, DateTime.UtcNow.AddDays(14));


        var result = await _book.UpdateOneAsync(filter, update);

        return result.ModifiedCount > 0;
    }

    public async Task UnIssueAsync(string id)
    {
        var filter = Builders<Book>.Filter.Eq(b => b.Id, id);

        var update = Builders<Book>.Update
            .Set(b => b.Issuedby, (string?)null)   // explicitly cast to string?
            .Set(b => b.IssueDate, (DateTime?)null)
            
            .Set(b => b.DueDate, (DateTime?)null);




        var result = await _book.UpdateOneAsync(filter, update);
    }





}

