package controllers;

import java.io.File;
import java.util.HashMap;

import models.Music;
import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import action.MusicAction;
import action.UserCenterAction;

public class UserCenter extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(UserCenter.class);
    
    public static void RefreshHeadPhoto(File imageFile){
        if(imageFile==null){
            render(""); 
        }
        
        String message="";
   
        User user = connect();
        if(user==null){
            message="亲，登录后才可以添加哦！";
            render("/music/upload.html",message);  
        }
        
        imageFile = UserCenterAction.saveHeaderImage(imageFile, user.id);
        
        if(imageFile==null){
            message="对不起，添加失败！";
            render("",message);  
        }
         
        User.saveUser(user, imageFile.getAbsolutePath());

        message="恭喜亲，添加成功！";
        log.info("Add Music Success!!!");
        render("",message);  
            
    }
    

}
