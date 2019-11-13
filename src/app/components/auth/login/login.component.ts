import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading =false;
  constructor(public authservice: AuthService) { }

  ngOnInit() {
  }
  onLogin(loginForm: NgForm){
    if(loginForm.invalid){
      return;
    }
    this.authservice.login(loginForm.value.email,loginForm.value.password);
  }

}
