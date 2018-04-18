import { Component, OnInit } from '@angular/core';
import {CarService} from './../shared/services/car.service';
import {Car} from './../shared/models/car.model';
import { Router, ActivatedRoute } from '@angular/router';
import {CarDisplaySmallComponent} from './../car-display-small/car-display-small.component';
import { Order } from '../shared/models/order.model';
import {IMyDpOptions, MyDatePickerModule, IMyDateModel, IMyDate} from './../../../node_modules/angular4-datepicker/src/my-date-picker';
import { read } from 'fs';


@Component({
  selector: 'app-car-display-detailed',
  templateUrl: './car-display-detailed.component.html',
  styleUrls: ['./car-display-detailed.component.css']
})
export class CarDisplayDetailedComponent implements OnInit {
  validDates:boolean=true;
  private currentCar: Car;
  private sub: any;
  reservationsDates:Array<any>;
  dateToday:Date=new Date();
  dateYesterday:Date=new Date(this.dateToday.getTime()-24*60*60*1000);
  dateFrom:Date=new Date();
  dateTo:Date=new Date();
  dateFromObject:IMyDate;
  dateToObject:IMyDate;
  total:number=0;
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
  constructor(private myCarService:CarService,private activeRouter: ActivatedRoute,private router: Router) 
  {
    this.dateFrom=new Date();
    this.dateTo=new Date();
   }

  ngOnInit() {
    this.myDatePickerOptionsFrom.disableUntil= JSON.parse(`{"year":${this.dateYesterday.getFullYear()},"month":${this.dateYesterday.getMonth()+1},"day":${this.dateYesterday.getDate()}}`);
    this.myDatePickerOptionsTo.disableUntil= JSON.parse(`{"year":${this.dateYesterday.getFullYear()},"month":${this.dateYesterday.getMonth()+1},"day":${this.dateYesterday.getDate()}}`);
    this.sub = this.activeRouter.params.subscribe(params => {
      let licensePlate: any= params['licensePlate'];
      let func:(c:Car)=>void=(c:Car)=>
      {
        this.currentCar=c; 
        this.myCarService.getCarReservationDates(this.currentCar.LicensePlate,(r:Array<any>)=>{this.reservationsDates=r;
                                                                                               this.disableCarReservationDates();
                                                                                               this.setDefaultStartEndDates();
                                                                                               this.toggle=true});   
      }
      this.myCarService.getCar(licensePlate,func);
     });    

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
  doCalcPrice()
  {

    let order:Order = new Order();
    order.CarToRent= this.currentCar;
    order.StartRent=this.dateFrom;
    order.EndRent = this.dateTo;
    this.validDates = Order.checkRequiredOrderDates(order.StartRent,order.EndRent,this.reservationsDates,order.CarToRent.LicensePlate);
    this.total = Order.calcTotalOrderCost(order);
  }

 
  OnCarOrderClicked():void
  {
    this.router.navigate(['./../carOrder/' , this.currentCar.LicensePlate]);
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
