package controllers;

import play.*;
import play.mvc.*;
import java.util.*;
import models.*;

@With(Secure.class)
public class Admin extends Controller{

/*
    static void setConnectedUser(){
        if(Security.isConnected()){
            User user=User.find("byEmail", Security.connected()).first();
            renderArgs.put("user", user.email);
             }
        }
    public static void index(){
        List<Post> posts=Post.find("author.email", Security.connected()).fetch();
        render(posts);
    }
    
    public static void form(Long id){
        if(id !=null){
            Post post=Post.findById(id);
            render(post);
        }
        render();
    }
    public static void delete(Long id){
        if(id != null){
            Post post=Post.findById(id);
            post.delete();
        }
        index();
    }
    public static void save(Long id,String title, String content, String tags){
        Post post;
           if(id == null){
         // Create post
            User author = User.find("byEmail", Security.connected()).first();
            post = new Post(author, title, content);
            }else{
                //Retrieve post
                post=Post.findById(id);
               // edit
                post.title=title;
                post.content=content;
                post.tags.clear();
            }
              //set tag list
           for(String tag : tags.split("\\s+")) {
               if(tag.trim().length() > 0){
                   post.tags.add(Tag.findOrCreateByName(tag));
               }
           }
              // Validate
            validation.valid(post);
            if(validation.hasErrors()) {
                render("@form", post);
                        }
            // Save
            post.save();
            index();
    }
    */
}
