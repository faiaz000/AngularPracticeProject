import { Injectable } from '@angular/core';
import { Post} from '../models/post.model';
import { Subject } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
 
  private posts: Post[]=[];
  private postsUpdated = new Subject<Post[]>()
  constructor(private http : HttpClient) { }

  getPosts(){
    this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      
      return postData.posts.map(post => {
        
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
    }))
    .subscribe(
      (postData)=>{
        
        this.posts = postData;
        this.postsUpdated.next([...this.posts])
    })
  }
  getPostsUpdateListener(){
    return this.postsUpdated.asObservable();
  }
  
  addPost(title:string,content:string){
    const post: Post = {id:'null',title: title, content:content};
    this.http.post<{message:string,postId:string}>("http://localhost:3000/api/post",post).subscribe((result)=>{
      post.id=result.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts])
    })
    
  }
  deletePost(id:string){
    console.log(id)
    this.http.delete('http://localhost:3000/api/posts/'+id)
      .subscribe(()=>{
       const updatedPost = this.posts.filter(post=>post.id !==id)
       this.posts = updatedPost;
       this.postsUpdated.next([...this.posts])
        console.log('Deleted');
      })
  }
}
