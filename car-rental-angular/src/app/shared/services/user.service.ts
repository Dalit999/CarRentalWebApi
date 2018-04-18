// import {Injectable, Output} from '@angular/core';
import {Injectable} from '@angular/core';
import {User} from './../models/user.model';
// import { Observable } from 'rxjs';
// import {HttpClient, HttpHeaders,HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
// import { userInfo } from 'os';
// import { ExpandOperator } from 'rxjs/operators/expand';
 import 'rxjs/add/operator/map';
// import { RequestOptions, RequestOptionsArgs } from '@angular/http';

@Injectable()
export class UserService{
   public token: string=null;
    public currentUser:User=null;
    constructor(private myHttpClient:HttpClient)
    {
                // set token if saved in local storage
                var currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string,callBack:(response:any)=>void): any {
        let func:(u:any)=>void=(u:any)=>
        {
            u.token=this.token;            
            this.currentUser= new User();
            this.currentUser = u;
            localStorage.setItem('currentUser',JSON.stringify(u));
        }
            
          this.myHttpClient.post("http://localhost:62463/api/user/login/", {UserName:username,UserPassword:password})
            .map((response: Response) => {
                let token = response;
                if (token) {
                    this.currentUser = new User();
                    this.currentUser.token= token.toString();
                    localStorage.setItem('currentUser',JSON.stringify(this.currentUser));
                    this.token = token.toString();
                    this.getCurrentUser(func);
                }
            }).subscribe(
                callBack
            ); 
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
    getAllUsers(callBack:(u:Array<any>)=>void):void
    {
      this.myHttpClient.get<Array<User>>("http://localhost:62463/api/user/all/")
      .subscribe(
          callBack
      );   
    
    }
    getAllUserRoles(callBack:(t:Array<any>)=>void):void
    {
      this.myHttpClient.get<Array<String>>("http://localhost:62463/api/user/roles/")
      .subscribe(
          callBack
      );   
    
    }
    public getCurrentUser(callBack:(u:any)=>void):void
    {
        this.myHttpClient.get<User>("http://localhost:62463/api/user/getUser/").subscribe(callBack);        
    }
    postNewUser (user:User,callBack:(u:User)=>void,errorCallBack:(message:string)=>void):void
    {
        this.myHttpClient.post<any>("http://localhost:62463/api/user/add/",user)
        .subscribe(
            data=>  {callBack(data)}, 
            error=>{
                errorCallBack(error.error.Message);
            }
        );   
    }
    deleteUser( user:User,callBack:()=>void):void
    {
      this.myHttpClient.delete<User>(`http://localhost:62463/api/user/${user.UserName}`)
      .subscribe(
          callBack
      );   
    
    }
      
    updateUser(userToUpdate:User,callBack:()=>void,errorCallBack:(message:string)=>void):void
    {
    this.myHttpClient.put("http://localhost:62463/api/user/edit",userToUpdate).subscribe(data=>
      {callBack()}, error=>{errorCallBack(error.error.Message)});
    } 
}
