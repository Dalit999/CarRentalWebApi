using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _02_BO;
using _01_DAL;


namespace _03_BLL
{
    public class CarTypesManager
    {
        public List<CarTypeModel> getAllCarTypes()
        {
            List<CarTypeModel> carTypes = new List<CarTypeModel>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                foreach (CarType carType in carEntities.CarTypes)
                {
                    carTypes.Add(new CarTypeModel()
                    {
                        Producer = carType.Manufacturer,
                        Model = carType.Model,
                        DailyCost = carType.DailyCost,
                        DailyPenaltyFee = carType.DailyPenaltyFee,
                        ManufacturingYear = carType.ProductionYear,
                        Gear= carType.AutomaticGear ? CarTypeModel.AUTOMATIC : CarTypeModel.MANUAL
                    });
                }
            }
            return carTypes;
        }
        internal static CarTypeModel getCarTypeById(int carTypeId)
        {
            CarType carType;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                carType = carEntities.CarTypes.Where(t => t.CarTypeId == carTypeId).FirstOrDefault();
            }
            if (carType == null)
                return null;
            return new CarTypeModel
            {
                Producer = carType.Manufacturer,
                Model = carType.Model,
                ManufacturingYear = carType.ProductionYear,
                Gear = carType.AutomaticGear ? CarTypeModel.AUTOMATIC : CarTypeModel.MANUAL,
                DailyCost = carType.DailyCost,
                DailyPenaltyFee = carType.DailyPenaltyFee
            };
        }
        internal static int getCarTypeId(string manufacturer, string model, int year, string gear)
        {
            CarType carType;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                carType = carEntities.CarTypes.Where(t =>  t.Manufacturer == manufacturer && t.Model == model && t.ProductionYear == year && (t.AutomaticGear && gear == CarTypeModel.AUTOMATIC || !t.AutomaticGear && gear == CarTypeModel.MANUAL)).FirstOrDefault();
            }
            if (carType == null)
                return -1;
            return carType.CarTypeId;
        }

        public CarTypeModel getCarTypeCosts(CarTypeModel carTypeModel)
        {
            CarType carType;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                carType = carEntities.CarTypes.Where(t => t.Manufacturer == carTypeModel.Producer && t.Model == carTypeModel.Model && t.ProductionYear == carTypeModel.ManufacturingYear && (t.AutomaticGear && carTypeModel.Gear == CarTypeModel.AUTOMATIC || !t.AutomaticGear && carTypeModel.Gear == CarTypeModel.MANUAL)).FirstOrDefault();
            }
            if (carType == null)
                return null;
            carTypeModel.DailyCost = carType.DailyCost;
            carTypeModel.DailyPenaltyFee = carType.DailyPenaltyFee;
            return carTypeModel;
        }
        public bool UpdateCarType(CarTypeModel updatedCarType)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    CarType carType = carEntities.CarTypes.Where(t => t.Manufacturer == updatedCarType.Producer && t.Model == updatedCarType.Model && t.ProductionYear == updatedCarType.ManufacturingYear && (t.AutomaticGear && updatedCarType.Gear == CarTypeModel.AUTOMATIC || !t.AutomaticGear && updatedCarType.Gear == CarTypeModel.MANUAL)).FirstOrDefault();
                    if (carType == null) throw new ArgumentException($"Car type with the required specifications was not found");//todo: write the specifications
                    carType.DailyCost = updatedCarType.DailyCost;
                    carType.DailyPenaltyFee = updatedCarType.DailyPenaltyFee;
                    carEntities.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        public CarTypeModel AddCarType(CarTypeModel addCarType)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    CarType carType = new CarType();
                    carType.Manufacturer = addCarType.Producer;
                    carType.Model = addCarType.Model;
                    carType.ProductionYear = addCarType.ManufacturingYear;
                    carType.AutomaticGear = addCarType.Gear == CarTypeModel.AUTOMATIC;
                    carType.DailyCost = addCarType.DailyCost;
                    carType.DailyPenaltyFee = addCarType.DailyPenaltyFee;
                    carEntities.CarTypes.Add(carType);
                    carEntities.SaveChanges();
                }
                return addCarType;
            }
            catch
            {
                return null;
            }
        }
        public bool deleteCarType(CarTypeModel carTypeToDelete)//todo: add field isactive and instead of delete, set to inactive. change the select all to ignore inactive
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    CarType carTypeToDel = null;
                    foreach (var singleCarType in carEntities.CarTypes)
                    {
                        if (singleCarType.Manufacturer == carTypeToDelete.Producer &&
                           singleCarType.Model == carTypeToDelete.Model && singleCarType.ProductionYear == carTypeToDelete.ManufacturingYear && (singleCarType.AutomaticGear && carTypeToDelete.Gear == CarTypeModel.AUTOMATIC || !singleCarType.AutomaticGear && carTypeToDelete.Gear == CarTypeModel.MANUAL))
                        {
                            //found!!
                            carTypeToDel = singleCarType;
                            break;
                        }
                    }
                    if (carTypeToDel != null)
                    {
                        carEntities.CarTypes.Remove(carTypeToDel);
                        carEntities.SaveChanges();
                        return true;
                    }
                }
                return false;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
