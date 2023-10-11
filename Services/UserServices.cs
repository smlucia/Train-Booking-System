using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TravelBookingSystem.Data;
using TravelBookingSystem.Models;

namespace TravelBookingSystem.Services
{
    public class UserServices
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserServices(IConfiguration config)
        {
            var mongoClient = new MongoClient(config.GetConnectionString("ConnectionDB"));
            var mongoDb = mongoClient.GetDatabase("ticketbookingdb");

            _userCollection = mongoDb.GetCollection<User>("user");
        }

        //get all users
        public async Task<List<User>> GetAsync() => await _userCollection.Find(_ => true).ToListAsync();

        //get user by id
        public async Task<User> GetAsync(string id) => await _userCollection.Find(t => t.Id == id).FirstOrDefaultAsync();

        //add new user
        public async Task CreateAsync(User newUser) => await _userCollection.InsertOneAsync(newUser);

        //update user
        public async Task UpdateAsync(string id, User updateUser) => await _userCollection.ReplaceOneAsync(t => t.Id == id, updateUser);

        //delete user
        public async Task RemoveAsync(string id) => await _userCollection.DeleteOneAsync(t => t.Id == id);
    }
}
