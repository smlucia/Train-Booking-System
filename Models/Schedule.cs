using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TravelBookingSystem.Models
{
    public class Schedule
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("trainId")]
        public string TrainId { get; set; } = "Train Id";

        [BsonElement("fromLocation")]
        public string FromLocation { get; set; } = "From Location";

        [BsonElement("toLocation")]
        public string ToLocation { get; set; } = "To Location";

        [BsonElement("departureTime")]
        public DateTime DepartureTime { get; set; } = DateTime.Now;

        [BsonElement("arrivalTime")]
        public DateTime ArrivalTime { get; set; } = DateTime.Now;

        [BsonElement("scheduleDate")]
        public DateTime ScheduleDate { get; set; } = DateTime.Now;

        [BsonElement("scheduleStatus")]
        public string ScheduleStatus { get; set; } = "Not completed"; // Set default value for status
    }
}
