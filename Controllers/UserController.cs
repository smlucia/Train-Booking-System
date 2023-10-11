using Microsoft.AspNetCore.Mvc;
using TravelBookingSystem.Models;
using TravelBookingSystem.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TravelBookingSystem.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserServices _userServices;

        public UserController(UserServices userServices)
        {
            _userServices = userServices;
        }


        // GET: api/user
        [HttpGet]
        public async Task<List<User>> Get() => await _userServices.GetAsync();

        // GET api/user/6520c8920bbfbe8b79cddf2f
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            User user = await _userServices.GetAsync(id);

            if (user == null)
            {
                return NotFound();

            }

            return user;
        }

        // POST api/user
        [HttpPost]
        public async Task<ActionResult<User>> Post(User newUser)
        {
            await _userServices.CreateAsync(newUser);
            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }
    

        // PUT api/user/6520c8920bbfbe8b79cddf2f
        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult> Put(string id, User updateUser)
        {
            User user = await _userServices.GetAsync(id);
            if (user == null)
            {
                return NotFound("There is no student with this id: " + id);

            }

            updateUser.Id = user.Id;

            await _userServices.UpdateAsync(id, updateUser);

            return Ok("Successfully Updated !!");
        }

        // DELETE api/user/6520c8920bbfbe8b79cddf2f
        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> Delete(string id)
        {

            User user = await _userServices.GetAsync(id);
            if (user == null)
            {
                return NotFound("There is no student with this id: " + id);

            }

            await _userServices.RemoveAsync(id);

            return Ok("Successfully Deleted !!");
        }
    }
}

