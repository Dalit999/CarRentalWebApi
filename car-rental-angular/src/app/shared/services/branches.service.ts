import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Branch} from './../models/branch.model';
import { BranchesComponent } from '../../branches/branches.component';

@Injectable()
export class BranchesService {

  constructor(private myHttpClient:HttpClient) { }

  postNewBranch (branch:Branch,callBack:(b:Branch)=>void,errorCallBack:(message:string)=>void):void
  {
      this.myHttpClient.post<Branch>("http://localhost:62463/api/branches/add/",branch)
      .subscribe(
        data=>  {callBack(data)}, 
        error=>{errorCallBack(error.error.Message);}
      );   
  }

getAllBranches(callBack:(b:Array<any>)=>void):void
{
  this.myHttpClient.get<Array<Branch>>("http://localhost:62463/api/branches/all/")
  .subscribe(
      callBack
  );   

}

deleteBranch( branchName:string,callBack:()=>void):void
{
  this.myHttpClient.delete<Branch>("http://localhost:62463/api/branches/" + branchName)
  .subscribe(
      callBack 
  );   

}
updateBranch(branchToUpdate:Branch,callBack:()=>void,errorCallBack:(message:string)=>void):void
{
this.myHttpClient.put("http://localhost:62463/api/branches/edit",branchToUpdate).subscribe(data=>
  {callBack()}, error=>{errorCallBack(error.error.Message)});
}   
}
