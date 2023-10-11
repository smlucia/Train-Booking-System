using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TravelBookingSystem.Data;
using TravelBookingSystem.Models;

namespace TravelBookingSystem.Services
{
    public class TrainServices
    {
        private readonly IMongoCollection<Train> _trainsCollection;

        public TrainServices(IConfiguration config)
        {
            var mongoClient = new MongoClient(config.GetConnectionString("ConnectionDB"));
            var mongoDb = mongoClient.GetDatabase("ticketbookingdb");

            _trainsCollection = mongoDb.GetCollection<Train>("train");
        }

        // Add new train details
        public async Task CreateTrainAsync(Train newTrain) => await _trainsCollection.InsertOneAsync(newTrain);

        // Retrieve all train details
        public async Task<List<Train>> GetAllTrainsAsync() => await _trainsCollection.Find(_ => true).ToListAsync();
           
        // Retrieve a single train details by Id
        public async Task<Train> GetTrainByIdAsync(string id) => await _trainsCollection.Find(t => t.Id == id).FirstOrDefaultAsync();
           
        // Update a train detail
        public async Task UpdateTrainAsync(string id, Train updateTrain) => await _trainsCollection.ReplaceOneAsync(t => t.Id == id, updateTrain);

        // Delete a train detail
        public async Task RemoveTrainAsync(string id) => await _trainsCollection.DeleteOneAsync(t => t.Id == id);
    }
}
