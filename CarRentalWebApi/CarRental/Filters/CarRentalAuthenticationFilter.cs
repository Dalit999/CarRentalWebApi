using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http.Results;
using _02_BO;
using _03_BLL;
using System.Security.Claims;
namespace CarRental.Filters
{
    public class CarRentalAuthenticationFilter : Attribute, IAuthenticationFilter
    {
        public bool AllowMultiple
        {
            get
            {
                return false;
            }
        }

        public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            var authorizationHeader = context.Request.Headers.Authorization;
            if (authorizationHeader==null || authorizationHeader.Scheme!="Basic")
                return Task.FromResult(0);
            if (String.IsNullOrEmpty(authorizationHeader.Parameter) || authorizationHeader.Parameter=="null")
            {
                //context.ErrorResult = new UnauthorizedResult(new AuthenticationHeaderValue[0], context.Request);
                return Task.FromResult(0);
            }
            UserLoginInfoModel userNameAndPasword;
            if(! UsersManager.openToken(authorizationHeader.Parameter, out userNameAndPasword) || userNameAndPasword == null)
            {
                context.ErrorResult = new UnauthorizedResult(new AuthenticationHeaderValue[0], context.Request);
                return Task.FromResult(0);
            }
            string userName = userNameAndPasword.UserName;
            string password = userNameAndPasword.UserPassword;
            ClaimsPrincipal principal = UsersManager.authenticateUser(userName, password);
            if (principal == null)
            {
                context.ErrorResult = new UnauthorizedResult(new AuthenticationHeaderValue[0], context.Request);
            }
            else
            {
                context.Principal = principal;
            }
            return Task.FromResult(0);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }
    }
}