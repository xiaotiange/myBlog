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
    
    //更换封面
    public static void DetailsInfo(File coverImg, Long musicId){       
        if(coverImg == null){
            Music music = Music.findById(musicId);
            render("/music/musicDetails.html",music);
        }
        
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
        
        if(!StringUtils.isEmpty(music.imgPath)){
            File preFile = new File(music.imgPath);
            if(preFile.exists()){
                preFile.delete();
            }
        }
      
         String imgPath = music.filePath;     
         File musicFile = new File(imgPath);
         int index = imgPath.indexOf(musicFile.getName());
         
         String imgName = coverImg.getName();
         
         coverImg = MusicAction.changeMusicCover(coverImg, imgPath, index, imgName);
        
        if(coverImg==null){
            errMessage="对不起，添加失败！";
            log.error(errMessage);
            render("/music/musicDetails.html",errMessage,music);  
        }  
         
        music.imgPath = coverImg.getAbsolutePath();
        music.save();

        errMessage="恭喜亲，封面更换成功！";
        log.info("Refresh Cover image Success!!!");
        render("/music/musicDetails.html",errMessage,music);  
            
    }
}
