package controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import models.Post;

public class Home extends CheckUserLogin {
    private static final Logger log = LoggerFactory.getLogger(Home.class);
    
    public static void index(){
        List<Post> Posts=Post.find("order by postedAt desc").from(0).fetch(10);
        render("/myHome/home.html",Posts);
    }
}
