import { Component, OnInit ,Input} from '@angular/core';
import { Car } from '../shared/models/car.model';
import { Router } from '@angular/router';
import { FavoriteCar } from '../shared/models/favoriteCar';

@Component({
  selector: 'app-car-display-small',
  templateUrl: './car-display-small.component.html',
  styleUrls: ['./car-display-small.component.css']
})
export class CarDisplaySmallComponent implements OnInit {
  @Input() car: Car;
  @Input() showButtons: boolean;

  validDates:boolean=true;
  reservationsDates:Array<any>;
  
  constructor(private router: Router) {
   
  }

  ngOnInit() {
  }
  OnCarPriceCalcClicked():void
  {
    FavoriteCar.saveFavoriteCar(this.car);
    this.router.navigate(['./../car/' , this.car.LicensePlate]);
  }
  OnCarOrderClicked():void
  {
    FavoriteCar.saveFavoriteCar(this.car);
    this.router.navigate(['./../carOrder/' , this.car.LicensePlate]);
  }

}
