import {CarType} from './cartype.model';
import {Branch} from './branch.model';
export class Car {
    LicensePlate:string;
    CarPhoto:string;
    CurrentKM:number;
    CarType:CarType;
    Branch:Branch;
    IsFunctional:boolean;
    constructor() {
        this.CarType= new CarType();
        this.Branch = new Branch();
        this.CurrentKM=0;
        this.IsFunctional=false;
    }
}
