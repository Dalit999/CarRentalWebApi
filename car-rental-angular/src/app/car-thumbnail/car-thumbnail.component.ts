import { Component, OnInit,Input } from '@angular/core';
import { Car } from '../shared/models/car.model';
import { FavoriteCar } from '../shared/models/favoriteCar';

@Component({
  selector: 'app-car-thumbnail',
  templateUrl: './car-thumbnail.component.html',
  styleUrls: ['./car-thumbnail.component.css']
})
export class CarThumbnailComponent implements OnInit {
  @Input() fav: FavoriteCar;
  constructor() { }

  ngOnInit() {
  }

}
