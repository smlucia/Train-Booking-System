using Microsoft.AspNetCore.Mvc;
using TravelBookingSystem.Services;
using TravelBookingSystem.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TravelBookingSystem.Controllers
{
    [Route("api/traveler")]
    [ApiController]
    public class TravelerController : ControllerBase
    {
        private readonly TravelerServices _travelerServices;

        public TravelerController(TravelerServices travelerServices)
        {
            _travelerServices = travelerServices;
        }



        // GET: api/traveler
        [HttpGet]
        public async Task<List<Traveler>> Get() => await _travelerServices.GetAsync();

        // GET api/traveler/651d7c11ccbc9e3c60c45dc2
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Traveler>> Get(string id)
        {
            Traveler traveler = await _travelerServices.GetAsync(id);

            if(traveler == null)
            {
                return NotFound();

            }

            return traveler;
        }

        // POST api/traveler
        [HttpPost]
        public async Task<ActionResult<Traveler>> Post(Traveler newTraveler)
        {
            await _travelerServices.CreateAsync(newTraveler);
            return CreatedAtAction(nameof(Get), new {id = newTraveler.Id} , newTraveler);
        }

        // PUT api/traveler/651d7c11ccbc9e3c60c45dc2
        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult> Put(string id, Traveler updateTtaveler )
        {
            Traveler traveler = await _travelerServices.GetAsync(id);
            if (traveler == null)
            {
                return NotFound("There is no student with this id: " + id);

            }

            updateTtaveler.Id = traveler.Id;

            await _travelerServices.UpdateAsync(id , updateTtaveler);

            return Ok("Successfully Updated !!");
        }

        // DELETE api/traveler/651d7c11ccbc9e3c60c45dc2
        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> Delete(string id)
        {

            Traveler traveler = await _travelerServices.GetAsync(id);
            if (traveler == null)
            {
                return NotFound("There is no student with this id: " + id);

            }

            await _travelerServices.RemoveAsync(id);

            return Ok("Successfully Deleted !!");
        }
    }
}
