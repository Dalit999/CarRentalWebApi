import { EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute } from "@angular/router";
import {AppRoutingModule}  from './app.routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { MyDatePickerModule } from './../../node_modules/angular4-datepicker/src/my-date-picker';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CarsComponent } from './cars/cars.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarDisplaySmallComponent } from './car-display-small/car-display-small.component';
import { CarDisplayDetailedComponent } from './car-display-detailed/car-display-detailed.component'


import {CarService} from './shared/services/car.service';
import {UserService} from './shared/services/user.service';
import {OrdersService} from './shared/services/orders.service';
import {BranchesService} from './shared/services/branches.service';
import {CarTypesService} from './shared/services/car.types.service';
import {SharedServiceService} from './shared/services/shared-service.service';

import {JWTInterceptor} from './shared/HttpHeaders/RequestOptionsService';
import {AuthGuard} from './shared/Guards/AuthGuard';
import { CarOrderFormComponent } from './car-order-form/car-order-form.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { BranchesComponent } from './branches/branches.component';
import { CartypesComponent } from './cartypes/cartypes.component';
import { CarManagementComponent } from './car-management/car-management.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { ReturnCarComponent } from './return-car/return-car.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { CarThumbnailComponent } from './car-thumbnail/car-thumbnail.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CarsComponent,
    LoginComponent,
    RegisterComponent,
    CarDisplaySmallComponent,
    CarDisplayDetailedComponent,
    CarOrderFormComponent,
    MyOrdersComponent,
    BranchesComponent,
    CartypesComponent,
    CarManagementComponent,
    UsersManagementComponent,
    ReturnCarComponent,
    ManageOrdersComponent,
    CarThumbnailComponent,
  ],
  imports: [
    MyDatePickerModule ,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [CarService,UserService,OrdersService,BranchesService,CarTypesService,SharedServiceService,
     { provide: HTTP_INTERCEPTORS, useClass:JWTInterceptor,multi:true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
