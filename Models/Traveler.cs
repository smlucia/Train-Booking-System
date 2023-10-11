
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TravelBookingSystem.Models
{
    [BsonIgnoreExtraElements]
    public class Traveler
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = "Traveler Name";

        [BsonElement("address")]
        public string Address { get; set; } = "Traveler Address";

        [BsonElement("contactNo")]
        public string ContactNo { get; set; } = "Traveler Contact Number";

        [BsonElement("nic")]
        public string NIC { get; set; } = "Traveler NIC";

        [BsonElement("activeStatus")]
        public string ActiveStatus { get; set; } = "Traveler Active Status";
    }
}
