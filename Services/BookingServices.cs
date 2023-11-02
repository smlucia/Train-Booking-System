using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TravelBookingSystem.Data;
using TravelBookingSystem.Models;

namespace TravelBookingSystem.Services
{
    /// <summary>
    /// Service class for managing booking-related operations in the travel booking system.
    /// </summary>
    public class BookingServices
    {
        private readonly IMongoCollection<Booking> _bookingsCollection;

        public BookingServices(IConfiguration config)
        {
            var mongoClient = new MongoClient(config.GetConnectionString("ConnectionDB"));
            var mongoDb = mongoClient.GetDatabase("ticketbookingdb");

            _bookingsCollection = mongoDb.GetCollection<Booking>("bookingweb");
        }

        //Retrieve all bookings
        public async Task<List<Booking>> GetBookingsAsync() =>
            await _bookingsCollection.Find(_ => true).ToListAsync();

        // Retrieve a single booking details by Id
        public async Task<Booking> GetBookingByIdAsync(string id) =>
            await _bookingsCollection
                .Find(booking => booking.bookingId == id)
                .FirstOrDefaultAsync();

        // Add new booking details
        public async Task CreateBookingAsync(Booking booking) =>
            await _bookingsCollection.InsertOneAsync(booking);

        // Update a booking
        public async Task UpdateBookingAsync(string id, Booking updatedBooking) =>
            await _bookingsCollection.ReplaceOneAsync(
                booking => booking.bookingId == id,
                updatedBooking
            );

        //Delete a booking
        public async Task DeleteBookingAsync(string id) =>
            await _bookingsCollection.DeleteOneAsync(booking => booking.bookingId == id);

        //Checking
        public async Task<List<Booking>> GetBookingsByNICAndStatusAsync(
            string travelerNIC,
            string reservationStatus
        )
        {
            var filter =
                Builders<Booking>.Filter.Eq(b => b.TravelerNIC, travelerNIC)
                & Builders<Booking>.Filter.Eq(b => b.ReservationStatus, reservationStatus);

            return await _bookingsCollection.Find(filter).ToListAsync();
        }
    }
}
