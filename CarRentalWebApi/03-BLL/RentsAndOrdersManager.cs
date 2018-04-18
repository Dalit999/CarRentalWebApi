using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _02_BO;
using _01_DAL;

namespace _03_BLL
{
    public class RentsAndOrdersManager
    {
        private static RentalOrderModel toRentalOrderModel(RentalOrder order)
        {
            return new RentalOrderModel(order.RentStartDate, order.RentEndDate)
            {
                ActualEndRent = order.ActualRentEndDate,
                RentingUser = UsersManager.getUserByUserID(order.UserId),
                CarToRent = CarsManager.getCarById(order.CarId),
                OrderId = order.RentalOrderId
            };
        }

        public List<RentalOrderModel> getAllOrdersForUser(string username)//a manager/employee will get orders for all the users
        {
            try
            {
                List<RentalOrderModel> orders = new List<RentalOrderModel>();
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    User user = carEntities.Users.Where(u => u.UserName == username).FirstOrDefault();
                    if (user == null)
                        return orders;
                    UserRole userRole = carEntities.UserRoles.Where(r => r.UserRoleId == user.UserRoleId).FirstOrDefault();
                    if (userRole == null)
                        return orders;
                    foreach (var order in carEntities.RentalOrders.Where(o => o.UserId == user.UserId || userRole.UserRoleName.ToLower() == UserRoleModel.ADMIN_ROLE || userRole.UserRoleName.ToLower() == "employee"))
                    {
                        orders.Add(toRentalOrderModel(order));
                    }
                }
                return orders;
            }
            catch
            {
                return null;
            }
        }

        public int AddNewOrder(string userName, RentalOrderModel order, out string errorMessage)
        {
            errorMessage = "";
            try
            {
                if (order.StartRent.Date < DateTime.Now.Date)
                {
                    errorMessage = $"The order start date {order.StartRent.Date} should be today {DateTime.Now.Date} or later";
                    return -3;
                }
                if (order.EndRent.Date <= order.StartRent.Date)
                {
                    errorMessage = "The order end date should be greater than the start date";
                    return -3;
                }
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Car car = carEntities.Cars.Where(c => c.LicensePlate == order.CarToRent.LicensePlate).FirstOrDefault();
                    if (car == null)
                    {
                        errorMessage = "Car not found";
                        return -1;
                    }
                    User user = carEntities.Users.Where(u => u.UserName == order.RentingUser.UserName).FirstOrDefault();
                    if (user == null)
                    {
                        errorMessage = "User not found";
                        return -1;
                    }
                    RentalOrder newOrder = new RentalOrder()
                    {
                        CarId = car.CarId,
                        UserId = user.UserId,
                        RentStartDate = order.StartRent,
                        RentEndDate = order.EndRent,
                        ActualRentEndDate= order.ActualEndRent
                    };

                    //In a real-life application, the following should be done using a transaction, or with some locking mechanism!
                    foreach (var o in carEntities.RentalOrders)
                    {
                        if (clash(o, newOrder))
                        {
                            errorMessage = "Sorry, the car you selected is not available on these dates. Please change the dates or select another car";
                            return -2;
                        }
                    }

                    carEntities.RentalOrders.Add(newOrder);
                    carEntities.SaveChanges();
                    return newOrder.RentalOrderId;
                }
            }
            catch (Exception e)
            {
                return -1;
            }
        }
        private bool clash(RentalOrder order, RentalOrder newOrder)
        {
            if (order.CarId != newOrder.CarId)
                return false; //not the same car
            if (order.ActualRentEndDate != null)
                return false; //irrelevant order - already returned
            if (order.RentalOrderId == newOrder.RentalOrderId)
                return false; //it's the same order, no problem
            if (newOrder.RentStartDate >= order.RentEndDate)
                return false; //no problem. New order is later
            if (newOrder.RentEndDate <= order.RentStartDate)
                return false; //no problem. New order is earlier
            return true; //Problem! new order overlaps the old one, maybe even completely contained in it's time period!
        }
        public bool UpdateOrder(RentalOrderModel updatedOrder,out string errorMessage)
        {
            try
            {
                errorMessage = "";

                if (updatedOrder.EndRent.Date <= updatedOrder.StartRent.Date)
                {
                    errorMessage = $"The order end date {updatedOrder.EndRent.Date} should be greater than the start date {updatedOrder.StartRent.Date}";
                    return false;
                }
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Car car = carEntities.Cars.Where(c => c.LicensePlate == updatedOrder.CarToRent.LicensePlate).FirstOrDefault();
                    if (car == null)
                    {
                        errorMessage=$"Car {updatedOrder.CarToRent.LicensePlate} was not found";
                        return false;
                    }
                    User user = carEntities.Users.Where(u => u.UserName == updatedOrder.RentingUser.UserName).FirstOrDefault();
                    if (user == null)
                    {
                        errorMessage=$"Renting user {updatedOrder.RentingUser.UserName} ({updatedOrder.RentingUser.FullName}) was not found";
                        return false;
                    }

                    RentalOrder order = carEntities.RentalOrders.Where(o => o.RentalOrderId == updatedOrder.OrderId).FirstOrDefault();
                    if (order == null)
                    {
                        errorMessage=$"Order number {updatedOrder.OrderId} was not found";
                        return false;
                    }
                    order.RentStartDate = updatedOrder.StartRent;
                    order.RentEndDate = updatedOrder.EndRent;
                    order.ActualRentEndDate = updatedOrder.ActualEndRent;
                    order.UserId = user.UserId;
                    order.CarId= car.CarId;
                    //In a real-life application, the following should be done using a transaction, or with some locking mechanism!
                    foreach (var o in carEntities.RentalOrders)
                    {
                        if (clash(o, order))
                        {
                            errorMessage="Sorry, the car you selected is not available on these dates. Please change the dates or select another car";
                            return false;
                        }
                    }

                    carEntities.SaveChanges();
                }
                return true;
            }
            catch(Exception e)
            {
                errorMessage = e.Message;
                return false;
            }
        }
        public bool DeleteOrder(RentalOrderModel updatedOrder)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    RentalOrder order = carEntities.RentalOrders.Where(o => o.RentalOrderId == updatedOrder.OrderId).FirstOrDefault();
                    if (order == null) throw new ArgumentException($"Order number {updatedOrder.OrderId} was not found");
                    carEntities.RentalOrders.Remove(order);
                    carEntities.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public List<Tuple<DateTime, DateTime>> getCarUnavailableDates(string licensePlate, DateTime fromDate)
        {
            List<Tuple<DateTime, DateTime>> reservationDateRanges = new List<Tuple<DateTime, DateTime>>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                var car = carEntities.Cars.Where(c => c.LicensePlate == licensePlate).FirstOrDefault();
                if (car != null)
                {
                    foreach (var order in carEntities.RentalOrders)
                    {
                        if (order.CarId != car.CarId || order.ActualRentEndDate != null || order.RentEndDate.Date <= fromDate.Date)
                        {
                            continue;
                        }
                        reservationDateRanges.Add(new Tuple<DateTime, DateTime>(order.RentStartDate, order.RentEndDate));
                    }
                }
            }
            return reservationDateRanges;
        }
        public List<ReservationsForCar> getAllCarsOpenReservations(DateTime fromDate)
        {
            List<ReservationsForCar> reservationDateRanges = new List<ReservationsForCar>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                foreach (var car in carEntities.Cars)
                    if (car != null)
                    {
                        foreach (var order in carEntities.RentalOrders.Where(o => o.CarId == car.CarId))
                        {
                            if (order.ActualRentEndDate != null )
                            {
                                continue;
                            }
                            if (!reservationDateRanges.Where(r => r.CarLicensePlate == car.LicensePlate).Any())
                            {
                                reservationDateRanges.Add(new ReservationsForCar() { CarLicensePlate = car.LicensePlate, CarReservations = new List<Tuple<DateTime, DateTime>>() });
                            }
                            reservationDateRanges.Where(r => r.CarLicensePlate == car.LicensePlate).First().CarReservations.Add(new Tuple<DateTime, DateTime>(order.RentStartDate, order.RentEndDate));
                        }
                    }
            }
            return reservationDateRanges;
        }

    }
}
