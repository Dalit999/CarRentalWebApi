using _02_BO;
using _03_BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Newtonsoft.Json;
using CarRental.Filters;
namespace CarRental.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]

    public class UserController : ApiController
    {
        UsersManager usersManager = new UsersManager();
        // GET: api/User
        [HttpGet]
        [Route("all")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles ="admin")]
        public HttpResponseMessage GetAllUsers()
        {
            try
            {
                List<UserModel> users = usersManager.getAllUsers();
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }
        [HttpGet]
        [Route("roles")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage GetAllUserRoles()
        {
            try
            {
                List<string> roles = usersManager.getAllUserRoles();
                return Request.CreateResponse(HttpStatusCode.OK, roles);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }


        [Route("login")]
        [HttpPost]
        public HttpResponseMessage Login([FromBody]Object loginInfo)
        {
            try
            {
                var info = JsonConvert.DeserializeObject<UserLoginInfoModel>(loginInfo.ToString());
                var responseJsonStr = UsersManager.loginUser(info.UserName, info.UserPassword);
                if (!string.IsNullOrEmpty(responseJsonStr))
                    return Request.CreateResponse(HttpStatusCode.OK, responseJsonStr);
                else return Request.CreateResponse(HttpStatusCode.Unauthorized);
            }
            catch(Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.Unauthorized);
            }
        }

        // POST: api/User
        [HttpPost]
        [Route("add")]
        public HttpResponseMessage Post([FromBody]UserModel newUser)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    UserModel addedUser= usersManager.AddUser(newUser);
                    if (addedUser != null)
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
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError("Problem in user data"));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new HttpError(ex.Message));
            }

        }


        // PUT: api/User/5
        [HttpPut]
        [Route("edit")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage PutUser([FromBody]UserModel userModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (usersManager.UpdateUser(userModel))
                        return Request.CreateResponse(HttpStatusCode.OK, true);
                }

                var errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.ErrorMessage).Where(e => e != "").FirstOrDefault();
                if (errorMessage == null)
                    errorMessage = ModelState.Values.SelectMany(v => v.Errors).ToList().Select(e => e.Exception).Where(e => e.Message != "").Select(e => e.Message).FirstOrDefault();
                if (errorMessage != null)
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);

                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        // DELETE: api/User/5
        [HttpDelete]
        [Route("{userName}")]
        [CarRentalAuthenticationFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage DeleteUser([FromUri]UserModel user)
        {
            try
            {
                if (usersManager.deleteUser(user))
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, new HttpError());
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }

        }

        [HttpGet]
        [Route("getUser")]
        [CarRentalAuthenticationFilter]
        public HttpResponseMessage getUserByToken()
        {
            try
            {
                var userName = RequestContext.Principal.Identity.Name;
                var user = usersManager.getUserByUserName(userName);
                if (user != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK,user);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
            }
            catch
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

        }
    }
}
