using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    public class BranchModel
    {

        [Required]
        [StringLength(100,MinimumLength =7)]
        public string Address { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string BranchName { get; set; }

        [Required]
        public GeographicCoordinates Coordinates { get; set; }

        public int BranchId { get; set; }
    }
}
