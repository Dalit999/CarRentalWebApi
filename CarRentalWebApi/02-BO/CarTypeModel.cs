using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    public class CarTypeModel
    {
        public const string AUTOMATIC = "Automatic";
        public const string MANUAL = "Manual";
    
        [Required]
        [StringLength(20,MinimumLength =3)]
        public string Producer { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Model { get; set; }

        [Required]
        [Range(50,500)]
        public decimal DailyCost { get; set; }

        [Required]
        [Range(100, 1000)]
        public decimal DailyPenaltyFee { get; set; }

        [Required]
        [Range(1950,2050)]
        public int ManufacturingYear { get; set; }

        [Required]
        [StringLength(10,MinimumLength =6)]
        public string Gear { get; set; }
    }
}
