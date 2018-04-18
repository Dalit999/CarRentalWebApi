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
    [RoutePrefix("api/car")]

    public class CarController : ApiController
    {
        CarsManager carsManager = new CarsManager();
        RentsAndOrdersManager ordersManager = new RentsAndOrdersManager();
        // GET: api/Car
        [HttpGet]
        [Route("all")]
        [CarRentalAuthenticationFilter]
        public HttpResponseMessage GetAllCars()
        {
            try
            {
                List<CarModel> cars = carsManager.getAllCars(RequestContext.Principal.IsInRole("admin") || RequestContext.Principal.IsInRole("employee"));
                return Request.CreateResponse(HttpStatusCode.OK, cars);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // GET: api/Car/5555555
        [HttpGet]
        [Route("{licensePlate}")]
        public HttpResponseMessage Get(string licensePlate)
        {
            try
            {
                CarModel car = carsManager.getCarByLicensePlate(licensePlate);
                return Request.CreateResponse(HttpStatusCode.OK, car);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // GET: api/Car/ReservationsDates/5555555
        [HttpGet]
        [Route("ReservationsDates/{licensePlate}")]
        public HttpResponseMessage GetReservationDates(string licensePlate)
        {
            try
            {
                if (licensePlate.ToLower() == "all")
                {
                    var allOpenReservations = ordersManager.getAllCarsOpenReservations(DateTime.Now);
                    return Request.CreateResponse(HttpStatusCode.OK, allOpenReservations);
                }
                else
                {
                    var dates = ordersManager.getCarUnavailableDates(licensePlate, DateTime.Now);
                    return Request.CreateResponse(HttpStatusCode.OK, dates);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // POST: api/Car
        [HttpPost]
        [Route("add")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Post([FromBody]CarModel newCar)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    CarModel addedCar = carsManager.AddCar(newCar);
                    if (addedCar != null)
                        return Request.CreateResponse(HttpStatusCode.OK, true);
                }
                var errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.ErrorMessage).Where(e => e != "").FirstOrDefault();
                if  (errorMessage==null)
                    errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.Exception).Where(e => e.Message != "").Select(e=>e.Message).FirstOrDefault();
                if (errorMessage != null)
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError("Problem in user data"));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        // PUT: api/Car/5
        [HttpPut]
        [Route("edit")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin,employee")]
        public HttpResponseMessage PutCar([FromBody]CarModel carModel)
        {
            try
            {
                if (ModelState.IsValid)
                    if (carsManager.UpdateCar(carModel))
                        return Request.CreateResponse(HttpStatusCode.OK, true);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        // DELETE: api/Car/5
        [HttpDelete]
        [Route("{licensePlate}")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage DeleteCar([FromUri]CarModel car)
        {
            try
            {
                if (carsManager.deleteCar(car.LicensePlate))
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
