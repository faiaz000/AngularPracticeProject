import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatCardTitleGroup } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
              };
            }), maxPosts: postData.maxPosts
          } ;
        })
      )
      .subscribe(postData => {
        console.log(postData)
        this.posts = postData.posts;
        //console.log('hi',this.posts )
        this.postsUpdated.next({posts:[...this.posts], postCount: postData.maxPosts});
      });
  }
  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    //const post: Post = {id:'null',title: title, content:content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(result => {
        this.router.navigate(["/"]);
      });
  }
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator:string;
    }>("http://localhost:3000/api/posts/" + id);
  }
  deletePost(id: string) {
    
    return this.http.delete("http://localhost:3000/api/posts/" + id)
    
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    console.log("img", image);
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      postData.forEach(element => {
        console.log(element);
      });
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(result => {
        this.router.navigate(["/"]);
      });
  }
}
