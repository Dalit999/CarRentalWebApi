import { Component, OnInit } from '@angular/core';
import {User } from '../shared/models/user.model';
import {UserService} from './../shared/services/user.service';
import {BranchesService} from './../shared/services/branches.service';
import { Branch } from '../shared/models/branch.model';
import {IMyDpOptions, MyDatePickerModule, IMyDateModel, IMyDate} from './../../../node_modules/angular4-datepicker/src/my-date-picker';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class  UsersManagementComponent implements OnInit {
  public today:Date = new Date();
  public  currentUser:User=User.getAnonymousUser();
  newUserView:boolean=false;
  newUser:User=  User.getAnonymousUser();
  public usersList:User[];
  public userRolesList:string[] = new Array<string>();
  public newUserRoleIndex:number=0;
  public userToUpdate:User = new User();
  public userToUpdateId:number =0;
  public userToUpdateBDayObject:any;
  public userRoleToUpdateIndex:number= 0;
  public myDatePickerOptionsAdd: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    satHighlight:true,
    sunHighlight:false,
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'Sunday',
  };
  public myDatePickerOptionsUpdate: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    satHighlight:true,
    sunHighlight:false,
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'Sunday',
  };

  

  constructor(private myUsersService:UserService) 
  {
    this.usersList = new Array<User>();
    this.userToUpdateBDayObject=JSON.parse(`{"year":${this.today.getFullYear()},"month":${this.today.getMonth()+1},"day":${this.today.getDate()}}`);
   }

   ngOnInit() 
   {
     this.newUser.FullName="";
     this.newUser.Role="client";
     for(let i=0;i<this.userRolesList.length;i++)
        if(this.userRolesList[i]==this.newUser.Role)
          this.newUserRoleIndex= i;
     this.myUsersService.getAllUserRoles((roles:Array<any>)=>{this.userRolesList = roles;});
    this.myUsersService.getAllUsers((users:Array<any>)=>{this.usersList=users; });
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

  newUserRequired()
  {
    this.newUserView=!this.newUserView;
  }
  addNewUser()
  {
    this.newUser.Role=this.userRolesList[this.newUserRoleIndex];
    this.myUsersService.postNewUser(this.newUser,(t:User)=>{alert("New user added!");window.location.reload();},(resp:string)=>{alert(resp)});
  }
  deleteUser(user:User)
  {
    if (confirm(`Are you sure you want to delete user ${user.UserName} (${user.Role}) - ${user.FullName}??`)) 
      this.myUsersService.deleteUser(user,()=>{alert(`User  ${user.UserName} (${user.Role}) - ${user.FullName} was deleted`);window.location.reload();})
  }

  setNewUserRole(i:number)
  {
    this.newUser.Role = this.userRolesList[i];
  }

  updateUser(user:User)
  {
    this.userToUpdate= new User();
    this.userToUpdate.FullName= user.FullName;
    this.userToUpdate.IdentificationNumber= user.IdentificationNumber;
    this.userToUpdateId= parseInt(user.IdentificationNumber);
    this.userToUpdate.UserName= user.UserName;
    this.userToUpdate.UserPhoto= user.UserPhoto;
    this.userToUpdate.BirthDate=new Date( user.BirthDate);
    if(this.userToUpdate.BirthDate==null)
    {
      this.userToUpdateBDayObject= JSON.parse(`{"date": {"year":${this.today.getFullYear()},"month":${this.today.getMonth()+1},"day":${this.today.getDate()}}}`);
    }
    else
    {
      this.userToUpdateBDayObject= JSON.parse(`{"date": {"year":${this.userToUpdate.BirthDate.getFullYear()},"month":${this.userToUpdate.BirthDate.getMonth()+1},"day":${this.userToUpdate.BirthDate.getDate()}}}`);
    }
    this.userToUpdate.IsFemale= user.IsFemale;
    this.userToUpdate.Email= user.Email;
    this.userToUpdate.Password= user.Password;
    this.userToUpdate.Role= user.Role;
    this.userRoleToUpdateIndex= 0;
    for(let roleIndex in this.userRolesList)
    {
      if (this.userRolesList[roleIndex]==this.userToUpdate.Role)
      {
        this.userRoleToUpdateIndex=parseInt( roleIndex);
      }
    }
  }
  undoUpdate()
  {
    this.userToUpdate = new User();
    this.userRoleToUpdateIndex = 0;
    this.userToUpdateId = 0;
  }
  doUpdate(user:User)
  {
    this.userToUpdate.Role= this.userRolesList[this.userRoleToUpdateIndex];
    this.userToUpdate.IdentificationNumber= this.userToUpdateId.toString();
    this.myUsersService.updateUser(this.userToUpdate,this.onUpdateSuccess,(message:string)=>this.onUpdateFail(message));
  }

    onUpdateSuccess():void{
    alert('User data was updated!');
    window.location.reload();
  }
    onUpdateFail(message:string):void{
    alert('Could not update user data.\n' + message);
  }

  onGenderSelectionChange(isNew:boolean,isFemale: number)
  {
    if(isNew)
    {
    this.newUser.IsFemale=isFemale==1;
    }
    else
    {
      this.userToUpdate.IsFemale=(isFemale==1);
    }
  }
  onBirthDateChanged(event,isAdd:Boolean,username:string)
  {
    if (event.jsdate==null)
    {
      return;
    }
    if(isAdd)
    {
      this.newUser.BirthDate= new Date(event.jsdate.valueOf() - event.jsdate.getTimezoneOffset() * 60000);
    }
    else
    {
      if(username!=this.userToUpdate.UserName)
      {
        return;
      }
      this.userToUpdateBDayObject= event;
      this.userToUpdate.BirthDate= new Date(event.jsdate.valueOf() - event.jsdate.getTimezoneOffset() * 60000);
    }
  }
}
