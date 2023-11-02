using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TravelBookingSystem.Models
{
    /// <summary>
    /// Represents a booking record in the travel booking system.
    /// </summary>
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string bookingId { get; set; }

        [Required(ErrorMessage = "Traveler NIC is required.")]
        [BsonElement("travelerNIC")]
        public string TravelerNIC { get; set; }

        [BsonElement("travelerName")]
        public string TravelerName { get; set; } // Automatically filled based on the selected NIC

        [BsonElement("trainName")]
        public string TrainName { get; set; } // Fetched from the schedule

        [BsonElement("fromLocation")]
        public string FromLocation { get; set; } // Fetched from the schedule

        [BsonElement("toLocation")]
        public string ToLocation { get; set; } // Fetched from the schedule

        [BsonElement("departureTime")]
        public DateTime DepartureTime { get; set; } // Fetched from the schedule

        [BsonElement("arrivalTime")]
        public DateTime ArrivalTime { get; set; } // Fetched from the schedule

        [BsonElement("journeyDate")]
        [Required(ErrorMessage = "Journey Date is required.")]
        public DateTime JourneyDate { get; set; } = DateTime.Now; // Date of the journey

        [BsonElement("trainClass")]
        [Required(ErrorMessage = "Train Class is required.")]
        public string TrainClass { get; set; } // Selected train class

        [BsonElement("numberOfPassengers")]
        [Required(ErrorMessage = "Number of Passengers is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Number of Passengers must be at least 1.")]
        public int NumberOfPassengers { get; set; } // Number of passengers

        [BsonElement("ticketPrice")]
        [Required(ErrorMessage = "Ticket price is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be a non-negative number.")]
        public decimal TicketPrice { get; set; } // Amount of the booking

        [BsonElement("totalAmount")]
        [Required(ErrorMessage = "Total Amount is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be a non-negative number.")]
        public decimal TotalAmount { get; set; } // Amount of the booking

        [BsonElement("reservationStatus")]
        public string ReservationStatus { get; set; } = "Not completed"; // Default: "Not completed"
    }
}
