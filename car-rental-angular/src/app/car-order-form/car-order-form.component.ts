import { Component, OnInit} from '@angular/core';
import { Car } from '../shared/models/car.model';
import {Order } from '../shared/models/order.model';
import{NgModel} from '@angular/forms';
import {CarService} from './../shared/services/car.service';
import {OrdersService} from './../shared/services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
import {IMyDpOptions, MyDatePickerModule, IMyDateModel, IMyDate} from './../../../node_modules/angular4-datepicker/src/my-date-picker';

@Component({
  selector: 'app-car-order-form',
  templateUrl: './car-order-form.component.html',
  styleUrls: ['./car-order-form.component.css']
})
export class CarOrderFormComponent implements OnInit {
  validDates:boolean=true;
  car:Car= new Car();
  dateFrom:Date=new Date();
  dateTo:Date=new Date();
  dateFromObject:IMyDate;
  dateToObject:IMyDate;
  dateToday:Date=new Date();
  dateYesterday:Date=new Date(this.dateToday.getTime()-24*60*60*1000);
  toggle:boolean=false;
reservationsDates:Array<any>;
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

public  currentUser:User=User.getAnonymousUser();
  constructor(private myCarService:CarService,private myOrdersService:OrdersService,private myUserService:UserService,private activeRoute: ActivatedRoute)    
  {   
    this.dateFrom=new Date();
    this.dateTo=new Date();
  }

  ngOnInit() {
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
    this.myUserService.getCurrentUser((u:User)=>{this.currentUser=u;this.currentUser.Password="Hidden"})

    this.myDatePickerOptionsFrom.disableUntil= JSON.parse(`{"year":${this.dateYesterday.getFullYear()},"month":${this.dateYesterday.getMonth()+1},"day":${this.dateYesterday.getDate()}}`);
    this.myDatePickerOptionsTo.disableUntil= JSON.parse(`{"year":${this.dateToday.getFullYear()},"month":${this.dateToday.getMonth()+1},"day":${this.dateToday.getDate()}}`);
   
    let licensePlate:string=this.activeRoute.snapshot.params['licensePlate']; 
    this.myCarService.getCar(licensePlate,(c:Car)=>{this.car=c;this.onCarDataArrived()});    

  }
  onCarDataArrived()
  {
    this.myCarService.getCarReservationDates(this.car.LicensePlate,(r:Array<any>)=>{this.reservationsDates=r;
                                                                                    this.disableCarReservationDates();
                                                                                    this.setDefaultStartEndDates();
                                                                                    this.toggle=true;});    
  }
  disableCarReservationDates()
  {
    let blockStringFrom:string[] = new Array<string>();
    let blockStringTo:string[] = new Array<string>();
    for(let dateRange of this.reservationsDates)
    {
      let blockStart:Date= new Date( dateRange.m_Item1);
      let blockEnd:Date= new Date( dateRange.m_Item2);
      let blockEndMinusDay= new Date(blockEnd.getTime()- 24*60*60*1000);
      let blockStartPlusDay= new Date(blockStart.getTime()+ 24*60*60*1000);
      blockStringFrom.push(`{    "begin": { "year": ${blockStart.getFullYear()}, "month":${blockStart.getMonth()+1}, "day": ${blockStart.getDate()} },      "end":{"year": ${blockEndMinusDay.getFullYear()}, "month":${blockEndMinusDay.getMonth()+1}, "day": ${blockEndMinusDay.getDate()}} }`);
      blockStringTo.push(`{    "begin": { "year": ${blockStartPlusDay.getFullYear()}, "month":${blockStartPlusDay.getMonth()+1}, "day": ${blockStartPlusDay.getDate()} },      "end":{"year": ${blockEnd.getFullYear()}, "month":${blockEnd.getMonth()+1}, "day": ${blockEnd.getDate()}} }`);
    }
    let blockRangeString:string="[" + blockStringFrom.join(",") + "]";
    this.myDatePickerOptionsFrom.disableDateRanges = JSON.parse( blockRangeString);
    blockRangeString="[" + blockStringTo.join(",") + "]";
    this.myDatePickerOptionsTo.disableDateRanges = JSON.parse( blockRangeString);
  }
  setDefaultStartEndDates()
  {
    while(this.isBlocked( this.dateFrom))
    {
      this.dateFrom= new Date(this.dateFrom.getTime() + 24*60*60*1000);
    }
    this.dateTo= new Date(this.dateFrom.getTime() + 24*60*60*1000);
    this.dateFromObject= JSON.parse(`{"date":   {"year":${this.dateFrom.getFullYear()},"month":${this.dateFrom.getMonth()+1},"day":${this.dateFrom.getDate()}}}`);
    this.dateToObject= JSON.parse(`{"date":   {"year":${this.dateTo.getFullYear()},"month":${this.dateTo.getMonth()+1},"day":${this.dateTo.getDate()}}}`);
  }
  isBlocked(aDate:Date):boolean
  {
    for(let range of this.reservationsDates)
    {
      let blockStart:Date= new Date( range.m_Item1);
      let blockEnd:Date= new Date( range.m_Item2);
      if(aDate>=blockStart && aDate<blockEnd)
        return true;
    }
    return false;
  }

    doOrder()
  {
    if(!this.checkRequiredOrderDates(this.dateFrom,this.dateTo))
    {
      alert('Sorry, the car you selected is not available on these dates. Please select other dates or try another car');
      return;
    }
    if (confirm(`Are you sure you want to reserve this car from ${this.dateFrom} to ${this.dateTo}?`)) 
    {
        this.doReserve();
    }
    else 
    {
        return;
    }
  }

  checkRequiredOrderDates(from:Date,to:Date):boolean
  {
    return Order.checkRequiredOrderDates(from, to, this.reservationsDates,this.car.LicensePlate);
  }
doReserve()
{
  let order:Order= new Order();
  order.CarToRent= this.car;
  order.RentingUser= this.currentUser;
  order.StartRent= new Date(this.dateFrom.valueOf() - this.dateFrom.getTimezoneOffset() * 60000);
  order.EndRent= new Date(this.dateTo.valueOf() - this.dateFrom.getTimezoneOffset() * 60000);
  this.myOrdersService.postNewOrder(order,this.confirmOrder,(resp:string)=>{alert('Order failed: ' + resp)});    

}
confirmOrder(order:Order):void
{
  alert(`Your reservation number ${order.OrderId} was accepted and will be checked and proccessed.\nYou will receive an e-mail confirmation within 24 hours.`);
  window.location.reload();
}
onDateFromChanged(event)
{
  this.dateFrom= new Date(event.jsdate);
  if(this.dateTo<this.dateFrom)  
  {
    this.dateTo=this.dateFrom;
    this.dateToObject=event;
  }
  this.validDates=true;
}
onDateToChanged(event)
{
  this.dateTo= new Date(event.jsdate);
  if(this.dateTo<this.dateFrom)  
  {
    this.dateFrom=this.dateTo;
    this.dateFromObject=event;
  }
  this.validDates=true;
}
}
