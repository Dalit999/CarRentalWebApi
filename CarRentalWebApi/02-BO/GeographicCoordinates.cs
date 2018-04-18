using System.ComponentModel.DataAnnotations;

namespace _02_BO
{

    public class GeographicCoordinates
    {
        [Required]
        [Range(0,90)]
        public int Latitude { get; set; }

        [Required]
        [Range(0, 60)]
        public int LatitudeMinutes { get; set; }

        [Required]
        public bool IsNorth { get; set; }

        [Required]
        [Range(0,180)]
        public int Longitude { get; set; }

        [Required]
        [Range(0, 60)]
        public int LongitudeMinutes { get; set; }

        [Required]
        public bool IsEast { get; set; }
    }
}
