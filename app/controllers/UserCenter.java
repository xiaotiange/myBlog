package controllers;

import java.io.File;
import java.util.HashMap;

import models.Music;
import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import action.MusicAction;

public class UserCenter extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(UserCenter.class);
    
    public static void RefreshHeadPhoto(File musicFile){
        if(musicFile==null){
            render("/music/upload.html"); 
        }
        if (!musicFile.getName().toLowerCase().endsWith(".mp3"))
            render("/music/upload.html","要输入mp3文件才可以哦，亲！"); 
        
        String message="";
   
        User user = connect();
        if(user==null){
            message="亲，登录后才可以添加哦！";
            render("/music/upload.html",message);  
        }
        String filename = musicFile.getName();
        
        musicFile = MusicAction.saveMusicFile(musicFile, user.fullname);
        
        if(musicFile==null){
            message="对不起，添加失败！";
            render("/music/upload.html",message);  
        }
        HashMap<String, String> infoMap = MusicAction.getMusicInfo(musicFile);
         
        Music.saveMusic(user.id , user.fullname, filename, musicFile.getAbsolutePath(),infoMap);

        message="恭喜亲，添加成功！";
        log.info("Add Music Success!!!");
        render("/music/upload.html",message);  
            
    }
    

}
