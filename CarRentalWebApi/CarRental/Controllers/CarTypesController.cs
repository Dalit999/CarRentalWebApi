using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using _02_BO;
using _03_BLL;
using System.Web.Http.Cors;
using CarRental.Filters;

namespace CarRental.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/cartypes")]

    public class CarTypesController : ApiController
    {
        CarTypesManager carTypesManager = new CarTypesManager();
        // GET: api/CarTypes
        [HttpGet]
        [Route("all")]
        public HttpResponseMessage GetAllCarTypes()
        {
            try
            {
                List<CarTypeModel> carTypes = carTypesManager.getAllCarTypes();
                return Request.CreateResponse(HttpStatusCode.OK, carTypes);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // POST: api/CarTypes
        [HttpPost]
        [Route("add")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Post([FromBody]CarTypeModel newCarType)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    CarTypeModel addedCarType = carTypesManager.AddCarType(newCarType);
                    if (addedCarType != null)
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
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError("Problem in car type data"));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        // DELETE: api/CarTypes/5
        [HttpDelete]
        [Route("{producer}/{model}/{manufacturingYear}/{gear}")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage DeleteCarType([FromUri]CarTypeModel carType)
        {
            try
            {
                if (carTypesManager.deleteCarType(carType))
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
