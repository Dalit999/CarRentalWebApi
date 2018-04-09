using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    public class CarModel
    {
        [Required]
        public CarTypeModel CarType { get; set; }

        [Required]
        public long CurrentKM { get; set; }

        public string CarPhoto { get; set; }

        [Required]
        public bool IsFunctional { get; set; }

        public bool isFreeToUse(DateTime startDate, DateTime endDate, IEnumerable<RentalOrderModel> ordersForCar)
        {
            if (startDate.Date < DateTime.Today || endDate.Date<DateTime.Today || startDate.Date>endDate.Date)
                return false;
            bool isFree = true;//why not be optimistic?
            foreach (var order in ordersForCar.Where(o=> o.ActualEndRent==null)) //we are only interested in active orders 
            {
                if (order.EndRent < startDate)
                    continue;
                if (order.StartRent> endDate)
                    continue;
                return false;
            }
            return true;
        }

        private string licensePlate;
        [Required]
        [StringLength(10, MinimumLength = 5)]
        public string LicensePlate
        {
            get { return licensePlate; }
            set { licensePlate = value; }
        }

        [Required]
        public BranchModel Branch { get; set; }
    }
}
