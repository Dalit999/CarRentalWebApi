import { Component, OnInit } from '@angular/core';
import {CarTypesService} from './../shared/services/car.types.service';
import {CarType } from '../shared/models/cartype.model';
import {User } from '../shared/models/user.model';


@Component({
  selector: 'app-cartypes',
  templateUrl: './cartypes.component.html',
  styleUrls: ['./cartypes.component.css']
})
export class CartypesComponent implements OnInit {
  public  currentUser:User=User.getAnonymousUser();
  newCarTypeView:boolean=false;
  newCarType:CarType= new CarType();
  public carTypesList:CarType[];

  constructor(private myCarTypesService:CarTypesService) { 
    this.carTypesList = new Array<CarType>();
    
  }

  ngOnInit() {
    this.myCarTypesService.getAllCarTypes((carTypes:Array<any>)=>{this.carTypesList=carTypes; });
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
  newCarTypeRequired()
  {
    this.newCarTypeView=!this.newCarTypeView;
  }
  addNewCarType()
  {
    this.myCarTypesService.postNewCarType(this.newCarType,(t:CarType)=>{alert("New car type added!");window.location.reload();},(message:string)=>{alert('Error ocurred, please check you input:\n' + message);});
  }
  deleteCarType(carType:CarType)
  {
    if (confirm(`Are you sure you want to delete car type ${carType.Producer} ${carType.Model} ${carType.ManufacturingYear} ${carType.Gear}??`)) 
      this.myCarTypesService.deleteCarType(carType,()=>{alert(`Car type ${carType.Producer} ${carType.Model} ${carType.ManufacturingYear} ${carType.Gear} was deleted`);window.location.reload();})
  }

}





