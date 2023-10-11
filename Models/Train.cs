using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TravelBookingSystem.Models
{
    public class Train
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("trainName")]
        public string TrainName { get; set; }

        [BsonElement("classes")]
        public List<TrainClass> Classes { get; set; } = new List<TrainClass>();

        [BsonElement("assignStatus")]
        public string AssignStatus { get; set; } = "Not assigned"; 

        public class TrainClass
        {
            [Required(ErrorMessage = "Class name is required.")]
            public string ClassName { get; set; }

            [Range(0, int.MaxValue, ErrorMessage = "Seats must be a non-negative number.")]
            public int Seats { get; set; }

            [Range(0, double.MaxValue, ErrorMessage = "Ticket price must be a non-negative number.")]
            public decimal TicketPrice { get; set; }
        }
    }
}
