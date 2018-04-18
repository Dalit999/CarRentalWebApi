using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _02_BO;
using _01_DAL;

namespace _03_BLL
{
    public class BranchesManager
    {
        public List<BranchModel> getAllBranches()
        {
            List<BranchModel> branches = new List<BranchModel>();
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                foreach (Branch branch in carEntities.Branches)
                {
                    branches.Add(toBranchModel(branch));
                }
            }
            return branches;
        }
        private static BranchModel toBranchModel(Branch branch)
        {
            return new BranchModel()
            {
                Address = branch.Address,
                BranchName = branch.BranchName,
                Coordinates = new GeographicCoordinates()
                { Latitude = branch.Latitude, LatitudeMinutes = branch.LatitudeMinutes, IsNorth = branch.IsNorth, Longitude = branch.Longitude, LongitudeMinutes = branch.LongitudeMinutes, IsEast = branch.IsEast },
                BranchId=branch.BranchId
            };
        }
        public BranchModel getBranchByName(string branchName)
        {
            Branch branch;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                branch = carEntities.Branches.Where(b => b.BranchName == branchName).FirstOrDefault();
            }
            if (branch == null)
                return null;
            return toBranchModel(branch);
        }
        internal static BranchModel getBranchById(int branchId)
        {
            Branch branch;
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                branch = carEntities.Branches.Where(b => b.BranchId== branchId).FirstOrDefault();
            }
            if (branch == null)
                return null;
            return toBranchModel(branch);
        }
        internal static int getBranchId(string branchName)
        {
            using (CarRentalEntities carEntities = new CarRentalEntities())
            {
                Branch branch = carEntities.Branches.Where(b => b.BranchName == branchName).FirstOrDefault();
                if (branch == null)
                    return - 1;
                return branch.BranchId;
            }
        }
        public bool UpdateBranch(BranchModel updatedBranch)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Branch branch = carEntities.Branches.Where(b => b.BranchId == updatedBranch.BranchId).FirstOrDefault();
                    if (branch == null) throw new ArgumentException($"Branch not found");
                    branch.Address = updatedBranch.Address;
                    branch.BranchName = updatedBranch.BranchName;
                    branch.Latitude = updatedBranch.Coordinates.Latitude;
                    branch.LatitudeMinutes = updatedBranch.Coordinates.LatitudeMinutes;
                    branch.IsNorth = updatedBranch.Coordinates.IsNorth;
                    branch.Longitude = updatedBranch.Coordinates.Longitude;
                    branch.LongitudeMinutes = updatedBranch.Coordinates.LongitudeMinutes;
                    branch.IsEast = updatedBranch.Coordinates.IsEast;
                    carEntities.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        public BranchModel AddBranch(BranchModel addBranch)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Branch branch = new Branch();
                    branch.Address = addBranch.Address;
                    branch.BranchName = addBranch.BranchName;
                    branch.Latitude = addBranch.Coordinates.Latitude;
                    branch.LatitudeMinutes = addBranch.Coordinates.LatitudeMinutes;
                    branch.IsNorth = addBranch.Coordinates.IsNorth;
                    branch.Longitude = addBranch.Coordinates.Longitude;
                    branch.LongitudeMinutes = addBranch.Coordinates.LongitudeMinutes;
                    branch.IsEast = addBranch.Coordinates.IsEast;
                    carEntities.Branches.Add(branch);
                    carEntities.SaveChanges();
                    addBranch.BranchId = branch.BranchId;
                }
                return addBranch;
            }
            catch
            {
                return null;
            }
        }
        public bool deleteBranch(string branchToDelete)
        {
            try
            {
                using (CarRentalEntities carEntities = new CarRentalEntities())
                {
                    Branch branch = carEntities.Branches.Where(b => b.BranchName == branchToDelete).FirstOrDefault();
                    if (branch != null)
                    {
                        carEntities.Branches.Remove(branch);
                        carEntities.SaveChanges();
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
