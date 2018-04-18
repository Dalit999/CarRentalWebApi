using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using _02_BO;
using _01_DAL;
using System.Security.Claims;
using Newtonsoft.Json;


namespace _03_BLL
{
    public class UsersManager
    {
        public List<UserModel> getAllUsers()
        {
            List<UserModel> users = new List<UserModel>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {

                foreach (User user in carEntities.Users)
                {
                    try
                    {
                        users.Add(toUserModel(user, carEntities.UserRoles.Where(r => r.UserRoleId == user.UserRoleId).First()));
                    }
                    catch
                    {

                    }
                }
            }
            return users;
        }
        public List<string> getAllUserRoles()
        {
            List<string> roles = new List<string>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                foreach (UserRole role in carEntities.UserRoles)
                {
                    try
                    {
                        roles.Add(role.UserRoleName);
                    }
                    catch
                    {

                    }
                }
            }
            return roles;
        }
        private static UserModel toUserModel(User user, UserRole role)
        {
            return new UserModel()
            {
                FullName = user.FullName,
                IdentificationNumber = user.IdentificationNumber,
                UserName = user.UserName,
                BirthDate = user.BirthDate,
                IsFemale = user.IsFemale,
                Email = user.Email,
                //Password=user.Password,   //you can't see the password. Admin can reset it, though
                UserPhoto = user.Photo,
                Role = role.UserRoleName
            };
        }
        private static User toDALUser(UserModel user,int userRoleId)
        {
            return new User()
            {
                FullName = user.FullName,
                IdentificationNumber = user.IdentificationNumber,
                UserName = user.UserName,
                BirthDate = user.BirthDate,
                IsFemale = user.IsFemale,
                Email = user.Email,
                Password=user.Password,
                Photo = user.UserPhoto,
                UserRoleId = userRoleId
            };
        }
        public UserModel getUserByUserName(string userName)
        {
            User user;
            UserRole role = null;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                user = carEntities.Users.Where(c => c.UserName == userName).FirstOrDefault();
                if (user != null)
                    role = carEntities.UserRoles.Where(r => r.UserRoleId == user.UserRoleId).FirstOrDefault();
            }
            if (user == null)
                return null;
            return toUserModel(user, role);
        }

        public static ClaimsPrincipal authenticateUser(string userName, string userPassword)
        {
            User user;
            UserRole role = null;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                user = carEntities.Users.Where(c => c.UserName == userName && c.Password == userPassword).FirstOrDefault();
                if (user != null)
                    role = carEntities.UserRoles.Where(r => r.UserRoleId == user.UserRoleId).FirstOrDefault();
            }
            if (user == null || role == null)
                return null;
            var claims = new List<Claim>() { new Claim(ClaimTypes.Name, user.UserName), new Claim(ClaimTypes.Role, role.UserRoleName) };
            var id = new ClaimsIdentity(claims, "Token");
            return new ClaimsPrincipal(new[] { id });
        }
        public static string loginUser(string userName, string userPassword) //returns response that includes the token and user model info in a json string
        {
            User user;
            UserRole role = null;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                user = carEntities.Users.Where(c => c.UserName == userName && c.Password == userPassword).FirstOrDefault();
                if (user != null)
                    role = carEntities.UserRoles.Where(r => r.UserRoleId == user.UserRoleId).FirstOrDefault();
            }
            if (user == null)
                return string.Empty;
            UserModel userModel = toUserModel(user, role);
            var token = createToken(userName, userPassword);
            var jsonString = token;
            return jsonString;
        }

        public static string createToken(string username, string password)
        {
            var userInfoJsonStr = "{ username: \"" + username + "\",userpassword: \"" + password + "\"}";
            byte[] buffer = new byte[userInfoJsonStr.Length];
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(userInfoJsonStr));
            return token;
        }
        public static bool openToken(string token, out UserLoginInfoModel user)
        {
            user = null;
            try
            {
                byte[] data = Convert.FromBase64String(token);
                string userInfoJsonStr = Encoding.UTF8.GetString(data);
                user = JsonConvert.DeserializeObject<UserLoginInfoModel>(userInfoJsonStr);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public static UserModel getUserByUserID(int userID)
        {
            User user;
            UserRole role = null;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                user = carEntities.Users.Where(c => c.UserId == userID).FirstOrDefault();
                if (user != null)
                    role = carEntities.UserRoles.Where(r => r.UserRoleId == user.UserRoleId).FirstOrDefault();
            }
            if (user == null)
                return null;
            return toUserModel(user, role);
        }
        internal static int getUserIdByUserName(string userName)
        {
            User user;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                user = carEntities.Users.Where(c => c.UserName == userName).FirstOrDefault();
            }
            if (user == null)
                return -1;
            return user.UserId;
        }
        public UserModel AddUser(UserModel addUser)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    UserRole userRole = carEntities.UserRoles.Where(r => r.UserRoleName == addUser.Role).FirstOrDefault();
                    if (userRole == null)
                        throw new Exception("No valid user role");

                    User user =toDALUser(addUser,userRole.UserRoleId);
                    carEntities.Users.Add(user);
                    carEntities.SaveChanges();
                }
                return addUser;
            }
            catch (Exception e)
            {
                throw;
            }
        }
        public bool deleteUser(UserModel userToDelete)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    User userToDel = null;
                    foreach (var singleUser in carEntities.Users)
                    {
                        if (singleUser.UserName == userToDelete.UserName)
                        {
                            //found!!
                            userToDel = singleUser;
                            break;
                        }
                    }
                    if (userToDel != null)
                    {
                        carEntities.Users.Remove(userToDel);
                        carEntities.SaveChanges();
                        return true;
                    }
                }
                return false;

            }
            catch (Exception e)
            {
                return false;
            }
        }
        public bool UpdateUser(UserModel updatedUser)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    User user = carEntities.Users.Where(u => u.UserName == updatedUser.UserName).FirstOrDefault();
                    if (user == null) throw new ArgumentException($"User name {updatedUser.UserName} was not found");
                    UserRole role = carEntities.UserRoles.Where(r => r.UserRoleName == updatedUser.Role).FirstOrDefault();
                    if (role == null) throw new ArgumentException($"User role {updatedUser.Role} was not found");

                    user.FullName = updatedUser.FullName;
                    user.IdentificationNumber = updatedUser.IdentificationNumber;
                    user.UserName = updatedUser.UserName;
                    user.BirthDate = updatedUser.BirthDate;
                    user.IsFemale = updatedUser.IsFemale;
                    user.Email = updatedUser.Email;
                    user.Password = updatedUser.Password;
                    user.Photo= updatedUser.UserPhoto;
                    user.UserRoleId = role.UserRoleId;

                    carEntities.SaveChanges();
                }
                return true;
            }
            catch(Exception e)
            {
                return false;
            }
        }
    }
}


