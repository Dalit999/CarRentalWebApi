import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user.model';
import {UserService} from './../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
public  currentUser:User=User.getAnonymousUser();
  constructor(private myUserService:UserService,private router: Router) { 
    this.refreshUser();
  }

  refreshUser()
  {
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

OnLogout()
{
  this.myUserService.logout();
  this.currentUser= User.getAnonymousUser();
  alert('logout!');
  this.router.navigate(['./../home/']);
}
  ngOnInit() {
  }

  refreshAfterLogin()
  {
    window.location.reload();
  }
}
