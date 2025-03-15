using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace chat.Backend.Models;


public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("username")]
    public string Username { get; set; } = null;

    [BsonElement("email")]
    public string Email { get; set; } = null;

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = null;

    [BsonElement("avatar")]
    public string? Avatar { get; set; }

    [BsonElement("status")]
    public UserStatus Status { get; set; }

    [BsonElement("lastSeen")]
    public DateTime LastSeen { get; set; }
}

public enum UserStatus
{
    Offline,
    Online,
    Away
}