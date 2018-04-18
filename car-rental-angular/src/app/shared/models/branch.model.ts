export class Branch {
    Address:string;
    BranchName:string;
    Coordinates:GeographicCoordinates;
    BranchId:number;
    /**
     *
     */
    constructor() {
        this.Coordinates= new GeographicCoordinates();
    }
}
export class GeographicCoordinates {

    Latitude:number;
    LatitudeMinutes :number;
    IsNorth :boolean=true;
    Longitude :number;
    LongitudeMinutes :number;
    IsEast :boolean=true;
    toString ():string
     {
        return `${this.Latitude}°${this.LatitudeMinutes}'${this.IsNorth?'N':'S'} ${this.Longitude}°${this.LongitudeMinutes}'${this.IsEast?'E':'W'}`;
      }
}
