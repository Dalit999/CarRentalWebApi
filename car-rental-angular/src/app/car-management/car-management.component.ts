import { Component, OnInit } from '@angular/core';
import {CarType } from '../shared/models/cartype.model';
import {Car } from '../shared/models/car.model';
import {User } from '../shared/models/user.model';
import {CarService} from './../shared/services/car.service';
import {CarTypesService} from './../shared/services/car.types.service';
import {BranchesService} from './../shared/services/branches.service';
import { Branch } from '../shared/models/branch.model';

@Component({
  selector: 'app-car-management',
  templateUrl: './car-management.component.html',
  styleUrls: ['./car-management.component.css']
})
export class CarManagementComponent implements OnInit {
  public  currentUser:User=User.getAnonymousUser();
  newCarView:boolean=false;
  newCar:Car= new Car();
  public carsList:Car[];
  public carTypeList:CarType[] = new Array<CarType>();
  public branchesList:Branch[] = new Array<Branch>();
  public newCarTypeIndex:number=0;
  public newBranchIndex:number=0;
  public carToUpdate:Car = new Car();
  public carTypeToUpdateIndex:number= 0;
  public branchToUpdateIndex:number= 0;

  constructor(private myCarsService:CarService,private myCarTypesService:CarTypesService,private myBranchesService:BranchesService) 
  {
    this.carsList = new Array<Car>();
   }

   ngOnInit() 
   {
     this.myCarTypesService.getAllCarTypes((types:Array<any>)=>{this.carTypeList = types;});
     this.myBranchesService.getAllBranches((branches:Array<any>)=>{this.branchesList = branches;});
    this.myCarsService.getAllAvailableCars((cars:Array<any>)=>{this.carsList=cars; });
    let userString = localStorage.getItem('currentUser');
    try
    {
        this.currentUser = JSON.parse(userString);
        if(this.currentUser.token==null || this.currentUser.token=="")
        {
          this.currentUser= User.getAnonymousUser();
        }
    }
    catch
    {
      this.currentUser= User.getAnonymousUser();
    }
  }

  newCarRequired()
  {
    this.newCarView=!this.newCarView;
  }
  addNewCar()
  {
    this.newCar.CarType=this.carTypeList[this.newCarTypeIndex];
    this.newCar.Branch= this.branchesList[this.newBranchIndex];
    this.myCarsService.postNewCar(this.newCar,(t:Car)=>{alert("New car added!");window.location.reload();},(message:string)=>{alert('Error ocurred, please check you input:\n' + message);});
  }
  deleteCar(car:Car)
  {
    if (confirm(`Are you sure you want to delete car ${car.LicensePlate} ${car.CarType.Producer} ${car.CarType.Model} ${car.CarType.ManufacturingYear} ${car.CarType.Gear}??`)) 
      this.myCarsService.deleteCar(car,()=>{alert(`Car  ${car.LicensePlate} ${car.CarType.Producer} ${car.CarType.Model} ${car.CarType.ManufacturingYear} ${car.CarType.Gear} was deleted`);window.location.reload();})
  }

  setNewCarType(i:number)
  {
    this.newCar.CarType = this.carTypeList[i];
  }
  setNewBranch(i:number)
  {
    this.newCar.Branch = this.branchesList[i];
  }

  updateCar(car:Car)
  {

    this.carToUpdate= new Car();
    this.carToUpdate.LicensePlate= car.LicensePlate;
    this.carToUpdate.CurrentKM= car.CurrentKM;
    this.carToUpdate.IsFunctional= car.IsFunctional;
    this.carToUpdate.CarPhoto= car.CarPhoto;
    this.carToUpdate.Branch= car.Branch;
    this.carToUpdate.CarType= car.CarType;
    this.carTypeToUpdateIndex = 0;
    for(let cartypeIndex in this.carTypeList)
    {
      if(this.carTypeList[cartypeIndex].Producer ==this.carToUpdate.CarType.Producer &&
        this.carTypeList[cartypeIndex].Model ==this.carToUpdate.CarType.Model &&
        this.carTypeList[cartypeIndex].ManufacturingYear ==this.carToUpdate.CarType.ManufacturingYear &&
        this.carTypeList[cartypeIndex].Gear ==this.carToUpdate.CarType.Gear 
      )
      this.carTypeToUpdateIndex = parseInt( cartypeIndex);
    }
    this.branchToUpdateIndex = 0;
    for(let branchIndex in this.branchesList)
    {
      if(this.branchesList[branchIndex].BranchName ==this.carToUpdate.Branch.BranchName)
      this.branchToUpdateIndex = parseInt( branchIndex);
    }
    
  }
  undoUpdate()
  {
    this.carToUpdate = new Car();
    this.carTypeToUpdateIndex = 0;
    this.branchToUpdateIndex = 0;
  }
  doUpdate(car:Car)
  {
    this.carToUpdate.CarType= this.carTypeList[this.carTypeToUpdateIndex];
    this.carToUpdate.Branch= this.branchesList[this.branchToUpdateIndex];
    this.myCarsService.updateCar(this.carToUpdate,this.onUpdateSuccess,(message:string)=>this.onUpdateFail(message));
  }

    onUpdateSuccess():void{
    alert('Car data was updated!');
    window.location.reload();
  }
    onUpdateFail(message:string):void{
    alert('Could not update car data.\n' + message);
  }

  
}
