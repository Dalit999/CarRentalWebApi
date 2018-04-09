using System;
using System.Collections.Generic;
using System.Linq;
using _02_BO;
using _01_DAL;

namespace _03_BLL
{
    public class CarsManager
    {
        public List<CarModel> getAllCars(bool includeNonFunctional=false)//workers and manager can view non-functional cars
        {
            List<CarModel> cars = new List<CarModel>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                foreach (Car car in carEntities.Cars.Where(c=> includeNonFunctional || c.IsConditionOK))
                {
                    cars.Add(new CarModel()
                    {
                        CarType = CarTypesManager.getCarTypeById(car.CarTypeId),
                        CurrentKM = car.Kilometers,
                        CarPhoto = car.Photo,
                        IsFunctional = car.IsConditionOK,
                        LicensePlate = car.LicensePlate,
                        Branch = BranchesManager.getBranchById(car.BranchId)
                    });
                }
            }
            return cars;
        }
        internal static CarModel getCarById(int carId)
        {
            Car car;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                car = carEntities.Cars.Where(c => c.CarId== carId).FirstOrDefault();
            }
            if (car == null)
                return null;
            return new CarModel()
            {
                CarType = CarTypesManager.getCarTypeById(car.CarTypeId),
                CurrentKM = car.Kilometers,
                CarPhoto = car.Photo,
                IsFunctional = car.IsConditionOK,
                LicensePlate = car.LicensePlate,
                Branch = BranchesManager.getBranchById(car.BranchId)
            };
        }
        public CarModel getCarByLicensePlate(string licensePlate)
        {
            Car car;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                car = carEntities.Cars.Where(c => c.LicensePlate == licensePlate).FirstOrDefault();
            }
            if (car == null)
                return null;
            return new CarModel()
            {
                CarType = CarTypesManager.getCarTypeById(car.CarTypeId),
                CurrentKM = car.Kilometers,
                CarPhoto = car.Photo,
                IsFunctional = car.IsConditionOK,
                LicensePlate = car.LicensePlate,
                Branch = BranchesManager.getBranchById(car.BranchId)
            };
        }
        public bool UpdateCar(CarModel updatedCar)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Car car = carEntities.Cars.Where(c => c.LicensePlate == updatedCar.LicensePlate).FirstOrDefault();
                    if (car == null) throw new ArgumentException($"Car with license plate {updatedCar.LicensePlate} was not found");
                    car.CarTypeId = CarTypesManager.getCarTypeId( updatedCar.CarType.Producer, updatedCar.CarType.Model, updatedCar.CarType.ManufacturingYear, updatedCar.CarType.Gear);
                    car.Kilometers = updatedCar.CurrentKM ;
                    car.Photo = updatedCar.CarPhoto ;
                    car.IsConditionOK = updatedCar.IsFunctional ;
                    car.BranchId =updatedCar.Branch.BranchId ;
                    carEntities.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        public CarModel AddCar(CarModel addCar)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Car car = new Car();
                    car.CarTypeId = CarTypesManager.getCarTypeId(addCar.CarType.Producer, addCar.CarType.Model, addCar.CarType.ManufacturingYear, addCar.CarType.Gear);
                    car.Kilometers = addCar.CurrentKM;
                    car.Photo = addCar.CarPhoto;
                    car.IsConditionOK = addCar.IsFunctional;
                    car.BranchId = addCar.Branch.BranchId;
                    car.LicensePlate = addCar.LicensePlate;
                    carEntities.Cars.Add(car);
                    carEntities.SaveChanges();
                }
                return addCar;
            }
            catch(Exception e)
            {
                return null;
            }
        }
        public bool deleteCar(string carLicensePlateToDelete)//todo: add field isactive and instead of delete, set to inactive. change the select all to ignore inactive
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Car car = carEntities.Cars.Where(c => c.LicensePlate == carLicensePlateToDelete).FirstOrDefault();
                    if (car != null)
                    {
                        carEntities.Cars.Remove(car);
                        carEntities.SaveChanges();
                    }
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
