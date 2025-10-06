namespace Library.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Signup
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]

    public string? Id { get; set; }

    public string username { get; set; }

    public string email { get; set; }

    public string password { get; set; }

    public Role role { get; set; }


    public string phone { get; set; }

    public DateTime createdAt { get; set; } = DateTime.UtcNow;


}


public enum Role
{
    admin,
    customer
}