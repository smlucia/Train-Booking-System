using Microsoft.AspNetCore.Mvc;
using TravelBookingSystem.Models;
using TravelBookingSystem.Services;

namespace TravelBookingSystem.Controllers
{
    /// <summary>
    /// Controller class for managing booking-related HTTP API endpoints in the travel booking system.
    /// </summary>
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly BookingServices _bookingServices;

        public BookingController(BookingServices bookingServices)
        {
            _bookingServices = bookingServices;
        }

        // GET: api/bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            var bookings = await _bookingServices.GetBookingsAsync();
            return Ok(bookings);
        }

        // GET: api/bookings/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(string id)
        {
            var booking = await _bookingServices.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        // POST: api/bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking(Booking booking)
        {
            // if (string.IsNullOrEmpty(booking.ReservationStatus))
            // {
            // Set the ReservationStatus to "Not completed" explicitly if not provided
            booking.ReservationStatus = "Not completed";
            // }

            await _bookingServices.CreateBookingAsync(booking);
            return CreatedAtAction("GetBooking", new { id = booking.bookingId }, booking);
        }

        // PUT: api/bookings/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(string id, Booking booking)
        {
            if (id != booking.bookingId)
            {
                return BadRequest();
            }

            await _bookingServices.UpdateBookingAsync(id, booking);
            return NoContent();
        }

        // DELETE: api/bookings/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(string id)
        {
            var booking = await _bookingServices.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            await _bookingServices.DeleteBookingAsync(id);
            return NoContent();
        }

        // // GET: api/bookings/check-existing
        // [HttpGet("check-existing")]
        // public async Task<ActionResult<bool>> CheckExistingBooking([FromQuery] string travelerNIC)
        // {
        //     var existingBookings = await _bookingServices.GetBookingsByNICAndStatusAsync(
        //         travelerNIC
        //     );
        //     return Ok(existingBookings.Count > 0);
        // }
        // GET: api/schedules/{travelerNIC}/{reservationStatus}
        [HttpGet("{travelerNIC}/{reservationStatus}")]
        public async Task<ActionResult<IEnumerable<Booking>>> FilterBookings(
            string travelerNIC,
            string reservationStatus
        )
        {
            var filteredBookings = await _bookingServices.GetBookingsByNICAndStatusAsync(
                travelerNIC,
                reservationStatus
            );
            return Ok(filteredBookings);
        }
    }
}
