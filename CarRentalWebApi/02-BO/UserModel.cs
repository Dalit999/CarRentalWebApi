using System;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    public class UserLoginInfoModel
    {
        public string UserName { get; set; }
        public string UserPassword{ get; set; }
    }
    [JsonObject(MemberSerialization.OptIn)]
    public class UserModel
    {
        [Required]
        [StringLength(50, MinimumLength = 5)]
        [JsonProperty]
        public string FullName { get; set; }

        [Required]
        [StringLength(20, MinimumLength =5)]
        [JsonProperty]
        public string Password { get; set; }

        [Required]
        [StringLength(9,MinimumLength =5)]
        [IdentificationNumber ]
        [JsonProperty]
        public string IdentificationNumber { get; set; }
        
        private string userName;
        [Required]
        [StringLength(10, MinimumLength = 3)]
        [JsonProperty]
        public string UserName//todo: add validity checks - no invalid characters
        {
            get { return userName; }
            set { userName = value; }
        }

        private DateTime? birthDate;
        [JsonProperty]
        public DateTime? BirthDate//todo: validity checks (age within reasonable range)
        {
            get { return birthDate; }
            set { birthDate = value; }
        }

        [Required]
        [JsonProperty]
        public bool IsFemale { get; set; }

        private string email;
        [Required]
        [StringLength(50)]
        [Email]
        [JsonProperty]
        public string Email 
        {
            get { return email; }
            set { email = value; }
        }

        [JsonProperty]
        public string UserPhoto { get; set; }

        [JsonProperty]
        public string Role { get; set; }

    }
}
