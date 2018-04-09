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
    [RoutePrefix("api/reservation")]

    public class ReservationsController : ApiController
    {
        RentsAndOrdersManager rentsAndOrdersManager = new RentsAndOrdersManager();
        // GET: api/Reservations
        [HttpGet]
        [Route("all")]
        [CarRentalAuthenticationFilter]
        public HttpResponseMessage Get()
        {
            List<RentalOrderModel> orders = new List<RentalOrderModel>();
            try
            {
                var userName = RequestContext.Principal.Identity.Name;
                orders = rentsAndOrdersManager.getAllOrdersForUser(userName);
                return Request.CreateResponse(HttpStatusCode.OK, orders);
            }
            catch
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
        }

        // POST: api/Reservations
        [HttpPost]
        [Route("add")]
        [CarRentalAuthenticationFilter]
        public HttpResponseMessage Post([FromBody]RentalOrderModel order)
        {
            try
            {
                var userName = RequestContext.Principal.Identity.Name;
                var errorMessage = string.Empty;
                if (ModelState.IsValid)
                {
                    int newOrderId = rentsAndOrdersManager.AddNewOrder(userName, order, out errorMessage);
                    if (newOrderId > 0)
                    {
                        order.OrderId = newOrderId;
                        return Request.CreateResponse(HttpStatusCode.OK, order);
                    }
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);
                }
                else
                {
                    errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.ErrorMessage).Where(e => e != "").FirstOrDefault();
                    if (errorMessage == null)
                        errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.Exception).Where(e => e.Message != "").Select(e => e.Message).FirstOrDefault();
                    if (errorMessage != null)
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);
                }
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError("Problem in order data"));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        // PUT: api/Reservations/5
        [HttpPut]
        [Route("edit")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin,employee")]
        public HttpResponseMessage PutOrder([FromBody]RentalOrderModel orderModel)
        {
            try
            {
                var errorMessage = string.Empty;
                if (ModelState.IsValid)
                {
                    if (rentsAndOrdersManager.UpdateOrder(orderModel, out errorMessage))
                        return Request.CreateResponse(HttpStatusCode.OK, true);
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);
                }
                else
                {
                    errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.ErrorMessage).Where(e => e != "").FirstOrDefault();
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

        // DELETE: api/Reservations/5
        [HttpDelete]
        [Route("{orderid}")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage DeleteOrder([FromUri]RentalOrderModel order)
        {
            try
            {
                if (rentsAndOrdersManager.DeleteOrder(order))
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
    }
}
