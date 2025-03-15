using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace chat.Backend.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null;

    [BsonElement("content")]
    public string Content { get; set; } = null;

    [BsonElement("senderId")]
    public string SenderId { get; set; } = null;

    [BsonElement("receiverId")]
    public string ReceiverId { get; set; } = null;

    [BsonElement("timestamp")]
    public DateTime Timestamp { get; set; }

    [BsonElement("isRead")]
    public bool IsRead { get; set; }
}