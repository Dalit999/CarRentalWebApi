import {Injectable} from '@angular/core';
import {Car} from './../models/car.model';
import {HttpClient} from '@angular/common/http';
@Injectable()
export class CarService{
constructor(private myHttpClient:HttpClient){}

    
    getAllAvailableCars (callBack:(b:Array<Car>)=>void):void
    {
        this.myHttpClient.get<Array<Car>>("http://localhost:62463/api/car/all")
        .subscribe(
            callBack
        );   
    }
    
    getCar (licensePlate:string,callBack:(c:Car)=>void):void
    {
        this.myHttpClient.get<Car>("http://localhost:62463/api/car/" + licensePlate)
        .subscribe(
            callBack
        );   
    }
    getCarReservationDates(licensePlate:string,callBack:(d:Array<any>)=>void):void
    {
        this.myHttpClient.get<Array<any>>("http://localhost:62463/api/car/ReservationsDates/" + licensePlate)
        .subscribe(
            callBack
        );   
    }

    postNewCar (car:Car,callBack:(t:Car)=>void,errorCallBack:(message:string)=>void):void
    {
        this.myHttpClient.post<Car>("http://localhost:62463/api/car/add/",car)
        .subscribe(
            data=>  {callBack(data)}, 
        error=>{errorCallBack(error.error.Message);}
        );   
    }
    deleteCar( car:Car,callBack:()=>void):void
    {
      this.myHttpClient.delete<Car>(`http://localhost:62463/api/car/${car.LicensePlate}`)
      .subscribe(
          callBack
      );   
    
    } 
    updateCar(carToUpdate:Car,callBack:()=>void,errorCallBack:(message:string)=>void):void
{
this.myHttpClient.put("http://localhost:62463/api/car/edit",carToUpdate).subscribe(data=>
  {callBack()}, error=>{errorCallBack(error.error.Message)});
} 
}
