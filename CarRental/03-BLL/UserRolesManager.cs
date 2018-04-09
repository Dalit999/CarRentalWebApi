using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _02_BO;
using _01_DAL;
using System.Security.Claims;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;

namespace _03_BLL
{
    public class UserRolesManager//todo: complete!
    {
        public static UserRoleModel getUserRole(int roleId)
        {
            UserRole userRole;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                userRole = carEntities.UserRoles.Where(r => r.UserRoleId== roleId).FirstOrDefault();
            }
            if (userRole == null)
                return null;
            return new UserRoleModel() {RoleName= userRole.UserRoleName } ;
        }
    }
}
