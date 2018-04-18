import { Component, OnInit,Output } from '@angular/core';
import {UserService} from './../shared/services/user.service';
import {User} from './../shared/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Session } from 'protractor';
import { request } from 'https';
import { SharedServiceService } from '../shared/services/shared-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   userName:string="";
  userPass:string="";
  currentUser:User;
  returnUrl: string;
  constructor(private myUserService:UserService,private router: Router, private activatedRoute:ActivatedRoute,private mySharedService: SharedServiceService) { }

  ngOnInit() {
            // reset login status
            this.myUserService.logout();
 
            // get return url from route parameters or default to '/'
            this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }
  OnLogin()
  {
    let func:(r:any)=>void=(r:any)=>
    {
        this.mySharedService.emitChange('Refresh After Login');
        this.router.navigateByUrl(this.returnUrl);

    }
   this.myUserService.login(this.userName,this.userPass,func);
  }
}
