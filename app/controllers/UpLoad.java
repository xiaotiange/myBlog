package controllers;

import java.io.File;

import models.Music;
import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import action.UserCenterAction;

public class UpLoad extends CheckUserLogin {

    private static final Logger log = LoggerFactory.getLogger(UpLoad.class);
    
    public static void RefreshMusicPhoto(File image_file, Long musicId){
        
        User user = connect();
        Music music = Music.findById(musicId);
        String errMessage="";
        if(user==null){
            errMessage = "亲，登录后才可以添加哦！";
            render("/MusicAdmin/DetailsInfo.html",errMessage,music);  
        }
        
        if(!user.id.equals(music.userId)){
            errMessage = "亲，这不是你的歌曲！！";
            render("/MusicAdmin/DetailsInfo.html",errMessage,music);  
        }
        
        if(image_file==null){
            render("/music/header.html");  
        }
               
        image_file = UserCenterAction.saveHeaderImage(image_file, user.id);
        
        if(image_file==null){
            errMessage="对不起，添加失败！";
            render("/music/header.html",errMessage);  
        }
         
        User.saveUser(user, image_file.getAbsolutePath());

        errMessage="恭喜亲，头像更换成功！";
        log.info("Add header image Success!!!");
        render("/music/header.html",errMessage);  
            
    }
}
