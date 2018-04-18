import { Component, OnInit } from '@angular/core';
import{User} from '../shared/models/user.model';
import{UserService} from '../shared/services/user.service';
import { allResolved } from 'q';
import {  Router } from '@angular/router';
import {IMyDpOptions, MyDatePickerModule, IMyDateModel, IMyDate} from './../../../node_modules/angular4-datepicker/src/my-date-picker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public newUser:User =  User.getAnonymousUser();
  // public newUserBirthDateObject:any=null;
  public confirmPassword:string="";
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    satHighlight:true,
    sunHighlight:false,
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'Sunday',
  };

  constructor(private myUserService:UserService,private router: Router) { }

  ngOnInit() {
    this.newUser.FullName="";
  }
  onGenderSelectionChange(isFemale: boolean)
  {
    this.newUser.IsFemale=isFemale;
  }
  RegisterNewUser()
  {
    if (this.confirmPassword == this.newUser.Password)
    {
    this.newUser.Role="client";
    this.myUserService.postNewUser(this.newUser,()=>{alert('Welcome!');this.router.navigateByUrl("");},(message:string)=>{alert('Error ocurred, please check you input:\n' + message);})
    }
    else alert("Passwords don't match");
  }
  onBirthDateChanged(event)
  {
    this.newUser.BirthDate = new Date(event.jsdate.valueOf() - event.jsdate.getTimezoneOffset() * 60000);
  }
}
