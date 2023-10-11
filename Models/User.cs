using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace TravelBookingSystem.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        [Required]
        public string Name { get; set; } = "User Name";

        [BsonElement("email")]
        [Required]
        public string Email { get; set; } = "User Email";

        [BsonElement("password")]
        [Required]
        public string Password { get; set; } = "User Password";

        [BsonElement("role")]
        [Required]
        public string Role { get; set; } = "User Role";
    }
}
