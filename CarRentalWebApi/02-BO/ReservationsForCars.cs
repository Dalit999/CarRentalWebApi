using System;
using System.Collections.Generic;


namespace _02_BO
{
    public class ReservationsForCar
    {
        public string CarLicensePlate { get; set; }
        private List<Tuple<DateTime, DateTime>> carReservations = new List<Tuple<DateTime, DateTime>>();

        public List<Tuple<DateTime, DateTime>> CarReservations
        {
            get { return carReservations; }
            set { carReservations = new List<Tuple<DateTime, DateTime>>(value); }
        }
    }
}
