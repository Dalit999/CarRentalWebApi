import { Component, OnInit } from '@angular/core';
import {Car } from '../shared/models/car.model';
import {Order } from '../shared/models/order.model';
import {CarService} from './../shared/services/car.service';
import {OrdersService} from './../shared/services/orders.service';
import { stat } from 'fs';

@Component({
  selector: 'app-return-car',
  templateUrl: './return-car.component.html',
  styleUrls: ['./return-car.component.css']
})
export class ReturnCarComponent implements OnInit {
  public ordersList:Order[] = new Array<Order>();
  selectedCarLicensePlate:string="";
  selectedCar:Car = new Car();
  UpdatedKm:number=0;
  showTheSummary:boolean=false;
  KmBefore:number =-1;
   closedOrder:Order = new Order();
  constructor(private myCarsService:CarService,private myOrdersService:OrdersService) { }

  ngOnInit() {
    this.myOrdersService.getAllUserOrders(
            (orders:Array<any>)=>
            {
              this.ordersList=new Array<Order>();
              for(let order of orders)
               {
                 if(order.ActualEndRent==null && new Date(order.StartRent) <=new Date())
                    this.ordersList.push(order);
                 }
              })
            };
    returnCar(ord:Order)
    {
      this.KmBefore = ord.CarToRent.CurrentKM;
      ord.CarToRent.CurrentKM= this.UpdatedKm;
      this.closedOrder= ord;      
      this.myCarsService.updateCar(ord.CarToRent,()=>{this.closeOrder(ord,this.KmBefore)}, ()=>{alert("couldn't update the car kilometes!"); return;})
    }
    closeOrder(ord:Order,KmBefore:number)
    {
      ord.ActualEndRent = new Date();
      ord.RentingUser.Password="Hidden";
      this.myOrdersService.updateOrder(ord,()=>{this.showTheSummary=true;},(error:string)=>{alert("Failed to close the order," + error);});
    }

    getDaysDifferance(startDate:Date,endDate:Date):number
    {
      let temp:number = Order.daysDifferance(startDate,endDate);

        return temp;
    }
    calcNumberOfDays(ord:Order):number
    {
      let num:number = Order.calcNumberOfDays(ord);
      return num;
    }
    regularDays(ord:Order):number
    {
    return Order.regularDays(ord);
    }
    penaltyDays(ord:Order):number
    {
      return Order.penaltyDays(ord);
    }
  }


