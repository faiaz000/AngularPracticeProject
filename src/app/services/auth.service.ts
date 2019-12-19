import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model'
import { HttpClient } from '@angular/common/http';
import { Subject,BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private expirationTime: number;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated: boolean = false;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http : HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(username: string, email:string, password:string){
    const authData : AuthData = {
      username: username,
      email: email,
      password:password
    }
    this.http.post("http://localhost:3000/api/user/signup",authData)
              .subscribe(respose=>{
                console.log('res',respose)
                this.router.navigate(['/']);
              },error=>{
                this.authStatusListener.next(false);
              })
  }
   autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    console.log(authInfo)
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn>0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
      
    } 
  }
  private  setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },duration*1000)
  }
  login(email: string, password:string){
    const authData = {
      email: email,
      password:password
    }
    this.http.post<{message:string, token:string, expiresIn:number, userId:string}>("http://localhost:3000/api/user/login",authData).subscribe((result)=>{
      const token = result.token
      this.token = token
      if(token){
        this.expirationTime = result.expiresIn;
        this.setAuthTimer(this.expirationTime);
        this.userId = result.userId;
        console.log('userId',this.userId)
        this.authStatusListener.next(true);
        this.isAuthenticated = true;
        const now = new Date();
        const expirationDate = new Date( now.getTime()+this.expirationTime*1000);
        this.saveAuthData(token,expirationDate,this.userId);
        this.router.navigate(['/']);
      }
      //console.log('response',this.token,'msg: ',result.message)
    },error=>{
      this.authStatusListener.next(false);
    })
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  
  private saveAuthData(token: string, expirationDate: Date, userId: string ){
    localStorage.setItem('token',token);
    localStorage.setItem('userId',userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate =localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId:userId
    };
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration'); 
    localStorage.removeItem('userId');
  }
  getUserId(){
    return this.userId;
  }
}