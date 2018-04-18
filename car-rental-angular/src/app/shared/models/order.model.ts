import {Car} from './car.model';
import {User} from './user.model';
export class Order {
    OrderId:number;
    StartRent:Date;
    EndRent:Date;
    ActualEndRent :Date;
    RentingUser:User;
    CarToRent:Car;
    constructor() {
        this.RentingUser= User.getAnonymousUser();
        this.CarToRent = new Car();
    }
    public static regularDays(order:Order) : number {
        if (order==null)
            return 0;
        let startDate:Date = new Date(order.StartRent);
        let endDate:Date = new Date(order.EndRent);
        let dateToday:Date=new Date();
        //order not closed yet
        if (order.ActualEndRent==null)
        {
            return Order.daysDifferance(startDate,endDate);
        }
        let actualEndDate:Date = new Date(order.ActualEndRent);
         let dateToUseAsEndDate:Date = endDate;
         if (actualEndDate<endDate)//early return
             dateToUseAsEndDate = actualEndDate;
        return Order.daysDifferance(startDate,dateToUseAsEndDate);
    }
    public static penaltyDays(order:Order) : number {
        let startDate:Date = new Date(order.StartRent);
        let endDate:Date = new Date(order.EndRent);
        let dateToday:Date=new Date();
        //order not closed yet
        if (order.ActualEndRent==null)
        {
            if (endDate>dateToday)
                return 0;
            return Order.daysDifferance(endDate,dateToday);
        }
        let actualEndDate:Date = new Date(order.ActualEndRent);
        if (actualEndDate<=endDate)//early or normal return
            return 0;
        return Order.daysDifferance(endDate,actualEndDate);
    }
    
        public static calcNumberOfDays(order:Order) : number {
            return this.regularDays(order)+   this.penaltyDays(order);
        }
    
    
    public static calcTotalOrderCost(order:Order):number
    {
        return this.regularDays(order)*order.CarToRent.CarType.DailyCost + this.penaltyDays(order)*order.CarToRent.CarType.DailyPenaltyFee;
    }
    public static getPriceComment(order:Order):string
    {
       if(order.ActualEndRent==null && order.EndRent<new Date())
       {
        return "Includes penalty for late return";
       }
       else if (order.ActualEndRent>order.EndRent)
       {
           return "Includes penalty for late return";
       }
       return "";
    }
    

    public static daysDifferance(dateFrom:Date, dateTo:Date):number
    {
        let tempDateFrom:Date = new Date(dateFrom);
        tempDateFrom.setHours(0);
        tempDateFrom.setMinutes(0);
        tempDateFrom.setSeconds(0);
        tempDateFrom.setMilliseconds(0);
        let tempDateTo:Date = new Date(dateTo);
        tempDateTo.setHours(0);
        tempDateTo.setMinutes(0);
        tempDateTo.setSeconds(0);
        tempDateTo.setMilliseconds(0);
        
        let diff:number = Math.abs(tempDateTo.getTime() - tempDateFrom.getTime());
        let diffDays:number = Math.ceil(diff / (1000 * 3600 * 24)); 
        return diffDays;            
    }

    public static checkRequiredOrderDates(from:Date,to:Date, reservationsDates:Array<any>,licensePlate:string):boolean
    {
        for(let reservation of reservationsDates)
        {
            let reservationStartDate:Date = new Date(reservation.m_Item1);
            let reservationEndDate:Date = new Date(reservation.m_Item2);
          if(from>= reservationEndDate || to <=reservationStartDate)
          {
              if(from<=reservationStartDate && to >=reservationEndDate)
              {
                return false;
              }
            // No clash between the 2 reservations
          }
          else
          {
              return false;
          }
        };
        return true;
    }
    public static checkAllCarsRequiredOrderDates(from:Date,to:Date, reservationsDates:Array<any>,licensePlate:string):boolean
    {
        reservationsDates.forEach(carReservations=>{
            if(carReservations.CarLicensePlate==licensePlate)
             return  Order.checkRequiredOrderDates(from,to,carReservations.carReservations,licensePlate);
        });
        return true;
    }
}
