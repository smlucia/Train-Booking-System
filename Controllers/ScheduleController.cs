using Microsoft.AspNetCore.Mvc;
using TravelBookingSystem.Models;
using TravelBookingSystem.Services;

namespace TravelBookingSystem.Controllers
{
    [Route("api/schedules")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleService _scheduleService;

        public ScheduleController(ScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        // GET: api/schedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
        {
            var schedules = await _scheduleService.GetSchedulesAsync();
            return Ok(schedules);
        }

        // GET: api/schedules/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(string id)
        {
            var schedule = await _scheduleService.GetScheduleByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        // POST: api/schedules
        [HttpPost]
        public async Task<IActionResult> CreateSchedule(Schedule newSchedule)
        {
            // Set the scheduleStatus to "Not completed" explicitly
            newSchedule.ScheduleStatus = "Not completed";

            await _scheduleService.CreateScheduleAsync(newSchedule);
            return CreatedAtAction(nameof(GetSchedule), new { id = newSchedule.Id }, newSchedule);
        }

        // PUT: api/schedules/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(string id, Schedule updatedSchedule)
        {
            var existingSchedule = await _scheduleService.GetScheduleByIdAsync(id);
            if (existingSchedule == null)
            {
                return NotFound();
            }

            await _scheduleService.UpdateScheduleAsync(id, updatedSchedule);
            return NoContent();
        }

        // DELETE: api/schedules/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(string id)
        {
            var existingSchedule = await _scheduleService.GetScheduleByIdAsync(id);
            if (existingSchedule == null)
            {
                return NotFound();
            }

            await _scheduleService.DeleteScheduleAsync(id);
            return NoContent();
        }
    }
}
