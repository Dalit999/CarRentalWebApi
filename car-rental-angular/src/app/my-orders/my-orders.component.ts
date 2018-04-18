import { Component, OnInit } from '@angular/core';
import {OrdersService} from './../shared/services/orders.service';
import { Order } from '../shared/models/order.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  public ordersList:Order[];
  constructor(private myOrdersService:OrdersService) { 
    this.ordersList = new Array<Order>();

  }

  ngOnInit() {
    this.myOrdersService.getAllUserOrders((orders:Array<any>)=>{this.ordersList=orders; });
  }
  getNumberOfDays(order:Order):string
  {
    let days = Order.calcNumberOfDays(order);
    return  days.toString();
  }
  calcTotalOrderCost(order:Order):string
  {
    let cost = Order.calcTotalOrderCost(order);
    return  cost.toString();
  }
  getPriceComment(order:Order):string
  {
    let comment = Order.getPriceComment(order);
    return  comment;
  }
}
