using chat.Backend.Models;
using chat.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace chat.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public ChatController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }


    [HttpGet("messages/{userId}/{receiverId}")]
    public async Task<IActionResult> GetMessages(string userId, string receiverId)
    {
        var messages = await _mongoDbService.Messages
            .Find(m =>
                (m.SenderId == userId && m.ReceiverId == receiverId) ||
                (m.SenderId == receiverId && m.ReceiverId == userId))
            .SortBy(m => m.Timestamp)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _mongoDbService.Users
            .Find(u => true)
            .Project<User>(Builders<User>.Projection
                .Exclude(u => u.PasswordHash))
            .ToListAsync();

        return Ok(users);
    }


    [HttpGet("conversations/{userId}")]
    public async Task<IActionResult> GetConversations(string userId)
    {
        var messages = await _mongoDbService.Messages
            .Find(m => m.SenderId == userId || m.ReceiverId == userId)
            .ToListAsync();

        var groupedMessages = messages
            .GroupBy(m => new { ConversationKey = GetConversationKey(m.SenderId, m.ReceiverId) })
            .Select(g => new
            {
                OtherUserId = g.First().SenderId == userId ? g.First().ReceiverId : g.First().SenderId,
                LastMessage = g.OrderByDescending(m => m.Timestamp).First().Content,
                LastMessageTime = g.OrderByDescending(m => m.Timestamp).First().Timestamp,
                UnreadMessages = g.Count(m => m.ReceiverId == userId && !m.IsRead)
            })
            .ToList();

        var users = await _mongoDbService.Users
            .Find(u => groupedMessages.Select(g => g.OtherUserId).Contains(u.Id.ToString()))
            .Project<User>(Builders<User>.Projection.Exclude(u => u.PasswordHash))
            .ToListAsync();

        var result = groupedMessages.Select(g => new
            {
                User = users.FirstOrDefault(u => u.Id.ToString() == g.OtherUserId),
                LastMessage = g.LastMessage,
                LastMessageTime = g.LastMessageTime,
                UnreadMessages = g.UnreadMessages
            })
            .OrderByDescending(r => r.LastMessageTime)
            .ToList();

        return Ok(result);
    }

    private string GetConversationKey(string senderId, string receiverId)
    {
        return string.Compare(senderId, receiverId) < 0
            ? $"{senderId}-{receiverId}"
            : $"{receiverId}-{senderId}";
    }
}