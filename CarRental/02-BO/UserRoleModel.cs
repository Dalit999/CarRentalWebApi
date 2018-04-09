using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    public class UserRoleModel
    {
        public const string ADMIN_ROLE = "admin";
        private string roleName;

        [Required]
        [StringLength(50, MinimumLength =3)]
        public string RoleName
        {
            get { return roleName; }
            set { roleName = value; }
        }
    }
}
