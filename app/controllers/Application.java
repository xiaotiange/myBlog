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

import com.ciaosir.client.utils.JsonUtil;

import models.*;

public class Application extends ControllerUtils {
    @Before
    static void addDefaults() {
        renderArgs.put("blogTitle", Play.configuration.getProperty("blog.title"));
        renderArgs.put("blogBaseline", Play.configuration.getProperty("blog.baseline"));
    }
    
    public static void show(Long id){
        Post post=Post.findById(id);
        String randomID=Codec.UUID();
        render(post,randomID);
    }
    
    public static void index() {
        Post frontPost=Post.find("order by postedAt desc").first();
        List<Post> olderPosts=Post.find("order by postedAt desc").from(1).fetch(10);
        render(frontPost,olderPosts);
    }

    public static void postComment(Long postId, String author,String content, String code,String randomID) {
        Post post = Post.findById(postId);
              
        if(code.equalsIgnoreCase(Cache.get(randomID).toString())){
            post.addComment(author, content);
            Cache.delete(randomID); 
            renderSuccess("评论成功");
        }else{
            renderError("验证码错误！");  
        }
    }
    
    public static void captcha(String id){
        Images.Captcha captcha=Images.captcha();
        String code=captcha.getText("#E4EAFD");
        Cache.set(id, code, "10mn"); 
        renderBinary(captcha);
    }
    
    public static void listTagged(String tag) {
        List<Post> posts = Post.findTaggedWith(tag);
        render(tag, posts);
        }
}