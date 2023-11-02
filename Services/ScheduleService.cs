using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TravelBookingSystem.Data;
using TravelBookingSystem.Models;

namespace TravelBookingSystem.Services
{
    /// <summary>
    /// Service for managing schedule information, including database operations for creating, updating, and deleting schedule records.
    /// </summary>
    public class ScheduleService
    {
        private readonly IMongoCollection<Schedule> _scheduleCollection;

        public ScheduleService(IConfiguration config)
        {
            var mongoClient = new MongoClient(config.GetConnectionString("ConnectionDB"));
            var mongoDb = mongoClient.GetDatabase("ticketbookingdb");

            _scheduleCollection = mongoDb.GetCollection<Schedule>("schedule");
        }

        //Retrieve all schedules
        public async Task<List<Schedule>> GetSchedulesAsync() =>
            await _scheduleCollection.Find(_ => true).ToListAsync();

        // Retrieve a single schedule details by Id
        public async Task<Schedule> GetScheduleByIdAsync(string id) =>
            await _scheduleCollection.Find(schedule => schedule.Id == id).FirstOrDefaultAsync();

        // Add new schedule details
        public async Task CreateScheduleAsync(Schedule schedule) =>
            await _scheduleCollection.InsertOneAsync(schedule);

        // Update a schedule
        public async Task UpdateScheduleAsync(string id, Schedule updatedSchedule) =>
            await _scheduleCollection.ReplaceOneAsync(
                schedule => schedule.Id == id,
                updatedSchedule
            );

        //Delete a schedule
        public async Task DeleteScheduleAsync(string id) =>
            await _scheduleCollection.DeleteOneAsync(schedule => schedule.Id == id);

        public async Task<List<Schedule>> GetFilteredSchedulesAsync(
            string scheduleDate,
            string scheduleStatus
        )
        {
            var filter = Builders<Schedule>.Filter.Empty;

            if (
                !string.IsNullOrEmpty(scheduleDate) && DateTime.TryParse(scheduleDate, out var date)
            )
            {
                filter &= Builders<Schedule>.Filter.Eq(s => s.ScheduleDate, date);
            }

            if (!string.IsNullOrEmpty(scheduleStatus))
            {
                filter &= Builders<Schedule>.Filter.Eq(s => s.ScheduleStatus, scheduleStatus);
            }

            return await _scheduleCollection.Find(filter).ToListAsync();
        }
    }
}
