using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using _02_BO;
using _03_BLL;
using CarRental.Filters;

namespace CarRental.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/branches")]

    public class BranchesController : ApiController
    {
        BranchesManager branchesManager = new BranchesManager();

        // GET: api/Branches
        [HttpGet]
        [Route("all")]
        public HttpResponseMessage GetAllBranches()
        {
            try
            {
                List<BranchModel> branches = branchesManager.getAllBranches();
                return Request.CreateResponse(HttpStatusCode.OK, branches);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // GET: api/Branches/5
        [HttpGet]
        [Route("{branchName}")]
        public HttpResponseMessage Get(string branchName)
        {
            try
            {
                BranchModel branch = branchesManager.getBranchByName(branchName);
                return Request.CreateResponse(HttpStatusCode.OK, branch);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // POST: api/Branches
        [HttpPost]
        [Route("add")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Post([FromBody]BranchModel newBranch)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    BranchModel addedBranch = branchesManager.AddBranch(newBranch);
                    if (addedBranch != null)
                        return Request.CreateResponse(HttpStatusCode.OK, true);
                }
                if (ModelState.Values.Count > 0 && ModelState.Values.First().Errors.Any())
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.ErrorMessage).Where(e => e != "").FirstOrDefault());
                else return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError("Problem in branch data"));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        // PUT: api/Branches/5
        [HttpPut]
        [Route("edit")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage PutBranch([FromBody]BranchModel branchModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (branchesManager.UpdateBranch(branchModel))
                        return Request.CreateResponse(HttpStatusCode.OK, true);
                }
                else
                {
                    var errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.ErrorMessage).Where(e => e != "").FirstOrDefault();
                    if (errorMessage == null)
                        errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.Exception).Where(e => e.Message != "").Select(e => e.Message).FirstOrDefault();
                    if (errorMessage != null)
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);

                }
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        // DELETE: api/Branches/5
        [HttpDelete]
        [Route("{branchName}")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage DeleteBranch([FromUri]string branchName)
        {
            try
            {
                if (branchesManager.deleteBranch(branchName))
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}
