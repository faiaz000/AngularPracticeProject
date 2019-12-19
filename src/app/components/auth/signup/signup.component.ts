import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {

  isLoading =false;
  authStatusSub: Subscription;
  constructor( public auth: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading = false;
      }
    )
  }
  onSignUp(signUpForm: NgForm){
   
    if(signUpForm.invalid){
      return;
    }
   this.isLoading=true;
   this.auth.createUser(signUpForm.value.username,signUpForm.value.email,signUpForm.value.password)
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
