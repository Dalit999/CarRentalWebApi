import { Component, OnInit } from '@angular/core';
import {CarService} from './../shared/services/car.service';
import {CarTypesService} from './../shared/services/car.types.service';
import {BranchesService} from './../shared/services/branches.service';
import {Car} from './../shared/models/car.model';
import {CarDisplaySmallComponent} from './../car-display-small/car-display-small.component';
import { FavoriteCar } from '../shared/models/favoriteCar';
import { Router } from '@angular/router';
import { CarType } from '../shared/models/cartype.model';
import { Branch } from '../shared/models/branch.model';
import { Order } from '../shared/models/order.model';
import {IMyDpOptions, MyDatePickerModule, IMyDateModel, IMyDate} from './../../../node_modules/angular4-datepicker/src/my-date-picker';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit 
{
  itemsInLine:number=5;

  carList:Car[] = new Array<Car>();
  carTable:Car[][] = new Array<Car[]>();
  favoriteCars:FavoriteCar[] = new Array<FavoriteCar>();
 
  searchAutomatic:number=0;//0-all, 1-automatic, 2-manual
  searchProducer:string="All";
  searchModel:string="All";
  searchYear:number=0;
  searchMaxPrice:number=9999;
  searchBranch:string="All";
  searchFreeText:string="";
  searchStartDate:Date= new Date();
  searchEndDate:Date= new Date();;
  public carTypeList:CarType[] = new Array<CarType>();
  public branchesList:Branch[] = new Array<Branch>();
  public carsReservationsDates:Array<any>;

  //Date Picker parameters:
  //validDates:boolean=true;
  dateFrom:Date=null;
  dateTo:Date=null;
  dateFromObject:IMyDate=null;
  dateToObject:IMyDate=null;;
  dateToday:Date=new Date();
  dateYesterday:Date=new Date(this.dateToday.getTime()-24*60*60*1000);
  toggle:boolean=false;

  public myDatePickerOptionsFrom: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    satHighlight:true,
    sunHighlight:false,
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'Sunday',
    disableUntil:  { "year": 2000, "month": 1, "day": 1 } ,
    disableDateRanges:[{    "begin": { "year": 2000, "month": 0, "day": 1 },      "end":{"year": 2000, "month":0, "day": 2} }],
  };
  public myDatePickerOptionsTo: IMyDpOptions = {
  dateFormat: 'dd.mm.yyyy',
  satHighlight:true,
  sunHighlight:false,
  todayBtnTxt: 'Today',
  firstDayOfWeek: 'Sunday',
  disableUntil:  { "year": 2000, "month": 1, "day": 1 } ,
  disableDateRanges:[{    "begin": { "year": 2000, "month":0, "day":1  },      "end":{"year": 2000, "month":0, "day": 2} }],
  };
    

  constructor(private myCarService:CarService,private router: Router,private myCarTypesService:CarTypesService,private myBranchesService:BranchesService,private myCarsService:CarService) 
  {
    this.dateFrom=new Date();
    this.dateTo=new Date();
   }

  ngOnInit() 
  {
    this.myDatePickerOptionsFrom.disableUntil= JSON.parse(`{"year":${this.dateYesterday.getFullYear()},"month":${this.dateYesterday.getMonth()+1},"day":${this.dateYesterday.getDate()}}`);
    this.myDatePickerOptionsTo.disableUntil= JSON.parse(`{"year":${this.dateToday.getFullYear()},"month":${this.dateToday.getMonth()+1},"day":${this.dateToday.getDate()}}`);
    
    //get all car types
    this.myCarTypesService.getAllCarTypes((types:Array<any>)=>{this.carTypeList = types; this.searchMaxPrice=this.getMaxPrice();});
    //get all branches
    this.myBranchesService.getAllBranches((branches:Array<any>)=>{this.branchesList = branches;});
    //get all reservations by car
    this.myCarsService.getCarReservationDates("All",(r:Array<any>)=>{this.carsReservationsDates=r; this.toggle=true;});    
    //get cars viewed
    let temp = localStorage.getItem('favoriteCars');
    if(temp!=null)
    {
      let tempParsed = JSON.parse(temp);
      if(tempParsed!=null)
        this.favoriteCars =tempParsed; 
    }

    let func:(b:Array<Car>)=>void=(b:Array<Car>)=>
    {
      this.carList=b; 
      this.createCarTable()
    }
    this.myCarService.getAllAvailableCars(func);
  }
  createCarTable()
  {
    this.carTable=  new Array<Car[]>();
    let carIndex:number = 0;
    for(let car of this.carList)
    {
      if(this.failedSearchCriteria(car))      
        continue;
      let col:number = carIndex % this.itemsInLine;
      let row:number= (carIndex-col)/this.itemsInLine;
      if (col==0)
      {
        this.carTable[row] = new Array<Car>();
      }
      this.carTable[row][col] = car;
      carIndex++;
    }
  }
  OnFavCarOrderClicked(fav:FavoriteCar)
  {
    FavoriteCar.saveFavoriteCar(fav.FavCar);
    this.router.navigate(['./../carOrder/' , fav.FavCar.LicensePlate]);

  }

  getMinPrice():number
  {
      let minPrice:number=9999;
      for(let type of this.carTypeList)
        if (type.DailyCost<minPrice)
          minPrice= type.DailyCost;
      return minPrice;
  }
  getMaxPrice():number
  {
      let maxPrice:number=0;
      for(let type of this.carTypeList)
        if (type.DailyCost>maxPrice)
          maxPrice= type.DailyCost;
      return maxPrice;
  }

  failedSearchCriteria(singleCar:Car):boolean
  {
    //Gear
    if(this.searchAutomatic==1 && singleCar.CarType.Gear=="Manual")
      return true;
    if(this.searchAutomatic==2 && singleCar.CarType.Gear=="Automatic")
      return true;
      //Producer
    if(this.searchProducer!="All" && this.searchProducer!=singleCar.CarType.Producer)
      return true;
      //Model
    if(this.searchModel!="All" && this.searchModel!=singleCar.CarType.Model)
      return true;
      //Year
    if(this.searchYear!=0 && this.searchYear>singleCar.CarType.ManufacturingYear)
      return true;
      //Price
    if(this.searchMaxPrice<singleCar.CarType.DailyCost)
      return true;
      //Branch
    if(this.searchBranch!="All" && this.searchBranch!=singleCar.Branch.BranchName)
      return true;
    if(this.checkCarReserved(singleCar))
      return true;
      //Start Date Only
      //End Date Only
      //Start + End Date
   
    if(!this.freeTextSearchMatch(singleCar))
      return true;

    return false;
  }

  checkCarReserved(singleCar:Car):boolean
  {
    if(this.dateFrom==null || this.dateFrom.getFullYear()<2000) //no date from
    {
      if(this.dateTo==null || this.dateTo.getFullYear()<2000) //no date to
      {
        return false; //no dates - no reservetion for the car
      }
      else //Only Date to
      {
          return this.carReservedOnDate(singleCar,this.dateTo,false);
      }
    }
    else
    {
      if(this.dateTo==null || this.dateTo.getFullYear()<2000) //only date from
      {
        return this.carReservedOnDate(singleCar,this.dateFrom,true);
      }
      else//both from and to
      {
        return this.carReservedOnDateRange(singleCar,this.dateFrom,this.dateTo);
      }      
    }
  }

  carReservedOnDateRange(singleCar:Car,checkDateFrom:Date,checkDateTo:Date):boolean
  {
    for(let ords of this.carsReservationsDates)
    {
      if(ords.CarLicensePlate==singleCar.LicensePlate)
      {
        if (!Order.checkRequiredOrderDates(checkDateFrom,checkDateTo,ords.CarReservations,singleCar.LicensePlate))
          return true; //some clash found
        return false; //the car is free on this date
      }
    }
    return false; //car free on this date range
  }
  carReservedOnDate(singleCar:Car,checkDate:Date,isFrom:boolean):boolean
  {
      for(let ords of this.carsReservationsDates)
      {
        if(ords.CarLicensePlate==singleCar.LicensePlate)
        {
            for(let ord of ords.CarReservations)
            {
              let ordFrom:Date= new Date(ord.m_Item1);    
              let ordTo:Date= new Date(ord.m_Item2);    
              if(isFrom && checkDate>=ordFrom && checkDate<ordTo) //car is taken on this date!!
              return true;
              if(!isFrom && checkDate>ordFrom && checkDate<=ordTo) //car is taken on this date!!
              return true;
            }
            return false; //the car is free on this date
        }
      }
      return false; //car free on this date
  }

  freeTextSearchMatch(singleCar:Car):boolean
  {
    if (this.searchFreeText=="")
      return true;
    let fragments:string[] = this.searchFreeText.split(" ");
    for(let fragment of fragments)
    {
      if(fragment=="")
        continue;
      if(singleCar.CarType.Producer.toLowerCase().indexOf(fragment.toLowerCase())>=0)
        return true;
      if(singleCar.CarType.Model.toLowerCase().indexOf(fragment.toLowerCase())>=0)
        return true;
      if(singleCar.CarType.ManufacturingYear==parseInt(fragment))
        return true;
      if(singleCar.CarType.Gear.toLowerCase().indexOf(fragment.toLowerCase())>=0)
        return true;
    }
    return false;
  }
  getTodayDate():Date{
    return new Date();
  }


changedStartDate(d:Date)
{
  this.searchStartDate=d;
}
changedEndDate(d:Date)
{
  this.searchEndDate=d;
}
onDateFromChanged(event)
{
  this.dateFrom= new Date(event.jsdate);
  this.createCarTable();
}
onDateToChanged(event)
{
  this.dateTo= new Date(event.jsdate);
  this.createCarTable();
}
searchAutomaticChanged(selection:number)
{
  this.searchAutomatic=selection;
  this.createCarTable();
}
searchProducerChanged(event)
{
  this.searchProducer= event;
  this.createCarTable();
}
searchModelChanged(event)
{
  this.searchModel= event;
  this.createCarTable();
}
searchYearChanged(event)
{
  this.searchYear= event;
  this.createCarTable();
}
searchMaxPriceChanged(event)
{
  this.searchMaxPrice= event;
  this.createCarTable();
}
searchBranchChanged(event)
{
  this.searchBranch= event;
  this.createCarTable();
}
searchFreeTextChanged(event)
{
  this.searchFreeText= event;
  this.createCarTable();
}

}