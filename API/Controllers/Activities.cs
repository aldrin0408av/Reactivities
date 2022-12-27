using System.Diagnostics;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using MediatR;
using Domain;
using Application.Activities;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        
        [HttpGet]
        public async Task<ActionResult<List<Domain.Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }
        
        [HttpGet("{id}")] // api/activities/id
        public async Task<ActionResult<Domain.Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id = id});
        }

        [HttpPost]

        public async Task<IActionResult> CreateActivity([FromBody]Domain.Activity activity){

            return Ok(await Mediator.Send(new Create.Command {Activity = activity}));
        }
        [HttpPut("{id}")]

        public async Task<IActionResult> EditActivity(Guid id, Domain.Activity activity)
        {
            activity.Id = id;
            return Ok(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }

    }
}