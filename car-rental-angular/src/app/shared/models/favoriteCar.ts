import {Car} from './car.model';
export class FavoriteCar {
    FavCar:Car;
    FavDate:Date;
    constructor() {
        this.FavCar= new Car();
        this.FavDate = new Date();
    }
    public static saveFavoriteCar(car:Car)
    {
      let temp = localStorage.getItem('favoriteCars');
      let tempParsed:FavoriteCar[] = new Array<FavoriteCar>();
      let favoriteCars:FavoriteCar[] = new Array<FavoriteCar>();
      if(temp!=null)
      {
        tempParsed = JSON.parse(temp);
        if(tempParsed!=null)
          favoriteCars =tempParsed; 
      }
      let found:boolean=false;
      for(let fCar of favoriteCars)
      {
        if(fCar.FavCar.LicensePlate==car.LicensePlate)
        {
          found=true;
          fCar.FavDate= new Date();
          break;
        }
      }
        if(!found)
        {
          let fCar = new FavoriteCar();
          fCar.FavCar= car;
          favoriteCars.push(fCar);
        }
        favoriteCars=favoriteCars.sort( (date1:FavoriteCar,date2:FavoriteCar):number=>
                                                    {
                                                        let a = new Date(date1.FavDate);
                                                        let b = new Date(date2.FavDate);
                                                        if(a>b)
                                                        {
                                                            return -1;
                                                        }
                                                            if(b>a)
                                                            {
                                                                return 1;
                                                            }
                                                            return 0;
                                                    }  );
        localStorage.setItem('favoriteCars',JSON.stringify( favoriteCars));
      }
    }

