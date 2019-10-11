import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy{

  private postsSubscription: Subscription;
  posts : Post[] = []
  constructor(private postsService: PostsService) { }

  ngOnInit() {
      this.postsService.getPosts()
      this.postsSubscription=this.postsService.getPostsUpdateListener().subscribe((posts:Post[])=>{
      this.posts= posts
    })
  }
  ngOnDestroy(){
    this.postsSubscription.unsubscribe()
  }

  onDelete(id:string){
    this.postsService.deletePost(id);
  }

}
