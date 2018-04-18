import { Component, OnInit } from '@angular/core';
import {BranchesService} from './../shared/services/branches.service';
import {Branch, GeographicCoordinates } from '../shared/models/branch.model';
import {User } from '../shared/models/user.model';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  public  currentUser:User=User.getAnonymousUser();
  newBranchView:boolean=false;
  newBranch:Branch= new Branch();
  public branchesList:Branch[];
  public branchToUpdate = new Branch();
  public branchToUpdateId:number = -1;
  constructor(private myBranchesService:BranchesService) { 
    this.branchesList = new Array<Branch>();
    
  }


  ngOnInit() {
    this.myBranchesService.getAllBranches((branches:Array<any>)=>{this.branchesList=branches; });
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
  newBranchRequired()
  {
    this.newBranchView=!this.newBranchView;
  }
  addNewBranch()
  {
    this.myBranchesService.postNewBranch(this.newBranch,(b:Branch)=>{alert("New branch added!");window.location.reload();},(message:string)=>{alert('Error ocurred, please check you input:\n' + message);});
  }
  deleteBranch(branch:Branch)
  {
    if (confirm(`Are you sure you want to delete branch ${branch.BranchName} in ${branch.Address}??`)) 
    this.myBranchesService.deleteBranch(branch.BranchName,()=>{alert(`branch ${branch.BranchName} was deleted`);window.location.reload();})
  }
  updateBranch(branch:Branch)
  {
    this.branchToUpdateId = branch.BranchId;
    this.branchToUpdate= new Branch();
    this.branchToUpdate.BranchId= branch.BranchId;
    this.branchToUpdate.BranchName= branch.BranchName;
    this.branchToUpdate.Address= branch.Address;
    this.branchToUpdate.Coordinates.Latitude= branch.Coordinates.Latitude;
    this.branchToUpdate.Coordinates.LatitudeMinutes= branch.Coordinates.LatitudeMinutes;
    this.branchToUpdate.Coordinates.IsNorth= branch.Coordinates.IsNorth;
    this.branchToUpdate.Coordinates.Longitude= branch.Coordinates.Longitude;
    this.branchToUpdate.Coordinates.LongitudeMinutes= branch.Coordinates.LongitudeMinutes;
    this.branchToUpdate.Coordinates.IsEast= branch.Coordinates.IsEast;
  }
  undoUpdate()
  {
    this.branchToUpdate = new Branch();
    this.branchToUpdateId=-1;
  }
  doUpdate(branch:Branch)
  {
    this.myBranchesService.updateBranch(this.branchToUpdate,this.onUpdateSuccess,(message:string)=>this.onUpdateFail(message));
  }
    onUpdateSuccess():void
    {
    alert('Branch data was updated!');
    window.location.reload();
  }
    onUpdateFail(message:string):void{
    alert('Could not update branch data.\n' + message);
  }

  onNorthSelectionChange(val:boolean,isNew:boolean)
  {
    if(isNew)
    {
      this.newBranch.Coordinates.IsNorth=val;
    }
      else
      {
      this.branchToUpdate.Coordinates.IsNorth=val;
      }
    }
  onEastSelectionChange(val:boolean,isNew:boolean)
  {
    if(isNew)
    {
      this.newBranch.Coordinates.IsEast=val;
    }
    else
    {
    this.branchToUpdate.Coordinates.IsEast=val;
    }
  }
    
  }
  


