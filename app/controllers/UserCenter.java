package controllers;

import java.io.File;
import java.util.HashMap;

import models.Music;
import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jd.open.api.sdk.internal.util.StringUtil;

import config.TMConfigs;

import action.MusicAction;
import action.UserCenterAction;
import antlr.StringUtils;

public class UserCenter extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(UserCenter.class);
    
    public static void getHeaderImg() {
        User user = connect();
        
        File file = UserCenterAction.getHeaderImage(user.headerImage);
        
        if (file == null) {
            File imgfile = new File(TMConfigs.configDir, "touxiang.jpg");            
            renderBinary(imgfile);
        }
        
        renderBinary(file);
       
    }
    
    public static void getUserImg(Long userId){
         User user = User.findByUserId(userId);
         
         if(user == null){
             return;
         }
        
        File file = UserCenterAction.getHeaderImage(user.headerImage);
        
        if (file == null) {
            File imgfile = new File(TMConfigs.configDir, "touxiang.jpg");            
            renderBinary(imgfile);
        }
        
        renderBinary(file);
       
    }
    
    
    public static void RefreshHeadPhoto(File image_file){
        
        User user = connect();
        String imessage="";
        if(user==null){
            imessage="亲，登录后才可以添加哦！";
            render("/music/header.html",imessage);  
        }
        
        if(image_file==null){
            render("/music/header.html");  
        }
        
        if(StringUtil.isEmpty(user.headerImage) == false){
            File file = new File(user.headerImage);
            if(file.exists()){
                file.delete();
            }         
        }
               
        image_file = UserCenterAction.saveHeaderImage(image_file, user.id);
        
        if(image_file==null){
            imessage="对不起，添加失败！";
            render("/music/header.html",imessage);  
        }
         
        User.saveUser(user, image_file.getAbsolutePath());

        imessage="恭喜亲，头像更换成功！";
        log.info("Add header image Success!!!");
        render("/music/header.html",imessage);  
            
    }
    

}
