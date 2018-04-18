import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { CarsComponent } from './cars/cars.component';
import { CarDisplayDetailedComponent } from './car-display-detailed/car-display-detailed.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarOrderFormComponent } from "./car-order-form/car-order-form.component";
import { MyOrdersComponent } from "./my-orders/my-orders.component";
import { BranchesComponent } from "./branches/branches.component";
import { CartypesComponent } from "./cartypes/cartypes.component";
import { CarManagementComponent } from "./car-management/car-management.component";
import { UsersManagementComponent } from "./users-management/users-management.component";
import {ReturnCarComponent } from "./return-car/return-car.component";
import { AuthGuard } from "./shared/Guards/AuthGuard";
import { ManageOrdersComponent } from "./manage-orders/manage-orders.component";

const appRoutes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "cars", component: CarsComponent },
    { path: "car/:licensePlate", component: CarDisplayDetailedComponent },
    { path: "carOrder/:licensePlate", component: CarOrderFormComponent ,canActivate: [AuthGuard]},
    { path: "login", component: LoginComponent },
    { path: "myOrders", component: MyOrdersComponent ,canActivate: [AuthGuard]},
    { path: "register", component: RegisterComponent },
    { path: "branches", component: BranchesComponent },
    { path: "CarTypes", component: CartypesComponent,canActivate: [AuthGuard]},
    { path: "CarsManagement", component: CarManagementComponent,canActivate: [AuthGuard]},
    { path: "UsersManagement", component: UsersManagementComponent,canActivate: [AuthGuard]},
    { path: "OrdersManagement", component: ManageOrdersComponent,canActivate: [AuthGuard]},
    { path: "ReturnCar", component: ReturnCarComponent,canActivate: [AuthGuard]},
    { path: "", redirectTo: "/home", pathMatch: "full" },

];

const appRouter = RouterModule.forRoot(appRoutes);

@NgModule({
    imports: [appRouter]
})
export class AppRoutingModule {}