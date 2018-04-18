import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from './../models/order.model';

@Injectable()
export class OrdersService {

  constructor(private myHttpClient:HttpClient) { }

  postNewOrder (order:Order,callBack:(o:Order)=>void,errorCallBack:(resp:string)=>void):void
  {
      this.myHttpClient.post<Order>("http://localhost:62463/api/reservation/add/",order)
      .subscribe(
        data=>
        {callBack(data)}, error=>{errorCallBack(error.error.Message)}      );   
  }
getAllUserOrders(callBack:(o:Array<any>)=>void):void
{
  this.myHttpClient.get<Array<Order>>("http://localhost:62463/api/reservation/all/")
  .subscribe(
      callBack
  );   

}

updateOrder(orderToUpdate:Order,callBack:()=>void,errorCallBack:(resp:string)=>void):void
{
this.myHttpClient.put("http://localhost:62463/api/reservation/edit",orderToUpdate).subscribe(data=>
  {callBack()}, error=>{errorCallBack(error.error.Message)});
} 

deleteOrder( order:Order,callBack:()=>void):void
{
  this.myHttpClient.delete<Order>("http://localhost:62463/api/reservation/" + order.OrderId)
  .subscribe(
      callBack
  );   
}

}
