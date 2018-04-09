using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    [JsonObject(MemberSerialization.OptIn)]
    public class RentalOrderModel
    {
        public RentalOrderModel(DateTime start,DateTime end)
        {
            if (start > end) throw new ArgumentOutOfRangeException("End date of rental cannot be before start of rental.");
            StartRent = start;
            EndRent = end;
        }
        public RentalOrderModel()
        {
            StartRent = DateTime.MinValue;
            EndRent = DateTime.MinValue;
        }

        [Required]
        [JsonProperty]
        public DateTime StartRent { get; set; }

        [Required]
        [JsonProperty]
        public DateTime EndRent { get; set; }

        [JsonProperty]
        public DateTime? ActualEndRent { get;  set; }
        public void CarReturned(DateTime returnDate,int kilometersOnReturn)//todo: add field in DB kilometersOnStartRent and kilometersOnEndRent, display KM of each rent
        {
            ActualEndRent = returnDate;
            CarToRent.CurrentKM = kilometersOnReturn;
        }

        [Required]
        [JsonProperty]
        public UserModel RentingUser { get; set; }

        [Required]
        [JsonProperty]
        public CarModel CarToRent { get; set; }

        [JsonProperty]
        public int OrderId { get; set; }
    }
}
