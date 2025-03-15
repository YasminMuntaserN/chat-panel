using chat.Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace chat.Backend.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IOptions<MongoDbSettings> mongoDBSettings)
    {
        var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
        _database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public IMongoCollection<Message> Messages => _database.GetCollection<Message>("Messages");
}