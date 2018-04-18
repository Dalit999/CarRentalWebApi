import { Component, OnInit } from '@angular/core';
import {User } from '../shared/models/user.model';
import {Car } from '../shared/models/car.model';
import {Order } from '../shared/models/order.model';
import {OrdersService} from './../shared/services/orders.service';
import { UserService } from '../shared/services/user.service';
import { CarService } from '../shared/services/car.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class  ManageOrdersComponent implements OnInit {
  public  currentUser:User= User.getAnonymousUser();
  newOrderView:boolean=false;
  newOrder:Order=  new Order();
  public ordersList:Order[];
  public orderToUpdate:Order = new Order();
  public usersList:User[] = new Array<User>();
  public carsList:Car[]= new Array<Car>();

  constructor(private myOrdersService:OrdersService,private myUsersService:UserService,private myCarsService:CarService) 
  {
    this.ordersList = new Array<Order>();
   }

   ngOnInit() 
   {
    this.myUsersService.getAllUsers((users:Array<any>)=>{this.usersList=users; });
    this.myCarsService.getAllAvailableCars((cars:Array<any>)=>{this.carsList=cars; });
    this.myOrdersService.getAllUserOrders((orders:Array<any>)=>{this.ordersList=orders; });
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

  newOrderRequired()
  {
    this.newOrderView=!this.newOrderView;
  }
  addNewOrder()
  {
    for(let u of this.usersList)
    {
      if(u.UserName==this.newOrder.RentingUser.UserName)
      {
        this.newOrder.RentingUser = u;
      }
    }
    for(let c of this.carsList)
    {
      if(c.LicensePlate==this.newOrder.CarToRent.LicensePlate)
      {
        this.newOrder.CarToRent = c;
      }
    }
    this.newOrder.RentingUser.Password="Hidden";
    this.myOrdersService.postNewOrder(this.newOrder,(o:Order)=>{alert("New Order added!");window.location.reload();},(resp:string)=>{alert(resp)});
  }
  deleteOrder(order:Order)
  {
    if (confirm(`Are you sure you want to delete order ${order.OrderId}??`)) 
      this.myOrdersService.deleteOrder(order,()=>{alert(`Order  ${order.OrderId} was deleted`);window.location.reload();})
  }

  updateOrder(order:Order)
  {
    this.orderToUpdate= new Order();
    this.orderToUpdate.OrderId= order.OrderId;
    this.orderToUpdate.StartRent= order.StartRent;
    this.orderToUpdate.EndRent= order.EndRent;
    this.orderToUpdate.ActualEndRent= order.ActualEndRent;
    this.orderToUpdate.RentingUser= order.RentingUser;
    this.orderToUpdate.CarToRent= order.CarToRent;
  }
  undoUpdate()
  {
    this.orderToUpdate = new Order();
  }
  doUpdate(order:Order)
  {
    this.orderToUpdate.RentingUser.Password= "Hidden";
    this.myOrdersService.updateOrder(this.orderToUpdate,this.onUpdateSuccess,(message:string)=>this.onUpdateFail(message));
  }

    onUpdateSuccess():void{
    alert('Order data was updated!');
    window.location.reload();
  }
    onUpdateFail(message:string):void
    {
    alert('Could not update order data.\n' + message);
  }
  getPenaltyDays(order:Order):number
  {
    return Order.penaltyDays(order);
  }
}
