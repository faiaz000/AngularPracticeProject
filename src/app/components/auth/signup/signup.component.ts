import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading =false;
  constructor( public auth: AuthService) { }

  ngOnInit() {
  }
  onSignUp(signUpForm: NgForm){
   
    if(signUpForm.invalid){
      return;
    }
   this.auth.createUser(signUpForm.value.username,signUpForm.value.email,signUpForm.value.password)
  }

}
