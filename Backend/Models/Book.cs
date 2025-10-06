using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Library.Models
{
    public class Book
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string name { get; set; }
        public string description { get; set; }
        public string author { get; set; }

        public string? Issuedby { get; set; }
        public DateTime? IssueDate { get; set; }

        public DateTime? DueDate { get; set; }

        [BsonIgnore]
        public bool IsOverdue
        {
            get => DueDate.HasValue && DateTime.UtcNow > DueDate.Value;
        }

        [BsonIgnore] // also computed
        public int OverdueDays
        {
            get => DueDate.HasValue && DateTime.UtcNow > DueDate.Value
                ? (DateTime.UtcNow - DueDate.Value).Days
                : 0;
        }

        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}
