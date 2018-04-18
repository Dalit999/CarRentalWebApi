import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CarType} from './../models/cartype.model';
import { CartypesComponent } from '../../cartypes/cartypes.component';

@Injectable()
export class CarTypesService {

  constructor(private myHttpClient:HttpClient) { }
  postNewCarType (carType:CarType,callBack:(t:CarType)=>void,errorCallBack:(message:string)=>void):void
  {
      this.myHttpClient.post<CarType>("http://localhost:62463/api/cartypes/add/",carType)
      .subscribe(
        data=>  {callBack(data)}, 
        error=>{errorCallBack(error.error.Message);}
      );   
  }

  getAllCarTypes(callBack:(t:Array<any>)=>void):void
  {
    this.myHttpClient.get<Array<CarType>>("http://localhost:62463/api/cartypes/all/")
    .subscribe(
        callBack
    );   
  
  }
  
  deleteCarType( carType:CarType,callBack:()=>void):void
  {
    this.myHttpClient.delete<CarType>(`http://localhost:62463/api/cartypes/${carType.Producer}/${carType.Model}/${carType.ManufacturingYear}/${carType.Gear}`)
    .subscribe(
        callBack
    );   
  
  }
  

}

