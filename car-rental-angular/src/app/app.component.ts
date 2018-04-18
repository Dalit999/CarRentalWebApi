import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SharedServiceService } from './shared/services/shared-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(HeaderComponent)
  private header: HeaderComponent;
  title = "Dalit's Car Rental Project";

  constructor(private mySharedService: SharedServiceService) 
  {
      mySharedService.changeEmitted$.subscribe(
          text => {
            this.header.refreshAfterLogin();
                  });
  }
}
