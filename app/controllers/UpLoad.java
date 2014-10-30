package controllers;

import java.io.File;

import models.Music;
import models.User;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import action.MusicAction;
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
    
    //更换封面
    public static void RefreshMusicCover(File coverImg, Long musicId){
        
        User user = connect();
        Music music = Music.find("byId", musicId).first();
        String errMessage="";
        if(music == null){
            errMessage = "找不到该歌曲！";
            log.error(errMessage+"id: "+musicId);
            render("/music/musicDetails.html",errMessage,music);  
        }
        if(user==null){
            errMessage = "亲，登录后才可以添加哦！";
            log.error(errMessage);
            render("/music/musicDetails.html",errMessage,music);  
        }
               
        if(coverImg==null){
            errMessage = "系统异常，文件传递错误！";
            log.error(errMessage);
            render("/music/musicDetails.html",errMessage,music);  
        }
      
         String imgPath = music.filePath;     
         File musicFile = new File(imgPath);
         coverImg = MusicAction.changeMusicCover(coverImg, imgPath,musicFile.getName());
        
        if(coverImg==null){
            errMessage="对不起，添加失败！";
            log.error(errMessage);
            render("/music/musicDetails.html",errMessage,music);  
        }
        
        if(!StringUtils.isEmpty(music.imgPath)){
            File preFile = new File(music.imgPath);
            if(preFile.exists()){
                preFile.delete();
            }
        }
         
        music.imgPath = coverImg.getAbsolutePath();
        music.save();

        errMessage="恭喜亲，封面更换成功！";
        log.info("Refresh Cover image Success!!!");
        render("/music/musicDetails.html",errMessage,music);  
            
    }
}
