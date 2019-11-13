import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy{

  userId: string;
  postsLength = 0;
  postsPerPage = 2;
  currentPage=1
  pageSizeOptions = [1,2,5,10]
  private postsSubscription: Subscription;
  posts : Post[] = [];
  isloading: boolean = false;
  isLoggedIn=false;
  private authListenerSubscription: Subscription;

  constructor(private postsService: PostsService,private authService: AuthService) { }

  ngOnInit() {
    
      this.isloading = true;
      this.postsService.getPosts(this.postsPerPage,this.currentPage)
      this.userId = this.authService.getUserId();
      console.log(this.userId)
      this.postsSubscription=this.postsService.getPostsUpdateListener().subscribe(( postData : { posts: Post[], postCount: number })=>{
      this.isloading=false;
      this.posts = postData.posts;
      this.postsLength = postData.postCount;
      
    })
    this.authListenerSubscription = this.authService.getAuthStatusListener()
      .subscribe( isAuthenticated => {
        console.log(isAuthenticated)
        this.isLoggedIn = isAuthenticated;
        this.userId = this.authService.getUserId();
        console.log(this.userId)
      });
   
  }
  ngOnDestroy(){
    this.postsSubscription.unsubscribe()
    this.authListenerSubscription.unsubscribe();
  }

  onDelete(id:string){
    this.isloading = true;
    this.postsService.deletePost(id).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isloading = true;
    this.currentPage = pageData.pageIndex+1
    this.postsPerPage = pageData.pageSize
    console.log(this.postsPerPage,this.currentPage)
    this.postsService.getPosts(this.postsPerPage,this.currentPage)
  }

}
