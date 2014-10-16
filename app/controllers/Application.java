package controllers;

import play.*;
import play.cache.Cache;
import play.data.validation.Required;
import play.db.jpa.GenericModel.JPAQuery;
import play.libs.Codec;
import play.libs.Images;
import play.mvc.*;
import sun.java2d.loops.RenderCache;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ciaosir.client.utils.JsonUtil;

import models.*;

public class Application extends CheckUserLogin {
//    @Before
//    static void addDefaults() {
//        renderArgs.put("blogTitle", Play.configuration.getProperty("blog.title"));
//        renderArgs.put("blogBaseline", Play.configuration.getProperty("blog.baseline"));
//    }
    
    private static final Logger log = LoggerFactory.getLogger(Application.class);
            
    public static void show(Long id){
        Post post=Post.findById(id);
        String randomID=Codec.UUID();
        render(post,randomID);
    }
    
    public static void index() {
        render("/music/music.html");
        //render("/home.html");
    }
    
    public static void postComment(Long postId, String author,String content, String code,String randomID) {
        
        User user = connect();
        if(user == null){
            ControllerUtils.renderSuccess("请登录后再发表评论！");
        }
        
        Post post = Post.findById(postId);
           
        log.info("code is:"+code+" and cache is: "+Cache.get(randomID).toString());
        if(code.equalsIgnoreCase(Cache.get(randomID).toString())){
            post.addComment(author, content);
            Cache.delete(randomID); 
            ControllerUtils.renderSuccess("评论成功");
        }else{
            ControllerUtils.renderError("验证码错误！");  
        }
    }
     
    public static void captcha(String id){
        Cache.delete(id);
        Images.Captcha captcha=Images.captcha();
        String code=captcha.getText("#666666");
        Cache.set(id, code, "10mn"); 
        renderBinary(captcha);
    }
    
    public static void listTagged(String tag) {
        List<Post> posts = Post.findTaggedWith(tag);
        render(tag, posts);
        }
}