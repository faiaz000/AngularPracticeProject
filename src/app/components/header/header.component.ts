import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  private authListenerSubscription: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authListenerSubscription = this.authService.getAuthStatusListener()
    .subscribe( isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });
  }
  ngOnDestroy(){
    this.authListenerSubscription.unsubscribe();
  }

  onLogOut(){
    console.log('hi')
    this.authService.logout();
  }
}
