package controllers;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import models.Music;
import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import action.MusicAction;

public class MusicAdmin extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(MusicAdmin.class);
   
    public static void myHouse(){
        render("/music/myMusic.html");
    }
    public static void index(File musicFile){
        if(musicFile==null){
            render("/music/music.html"); 
        }
        if (!musicFile.getName().toLowerCase().endsWith(".mp3"))
            render("/music/music.html","要输入mp3文件才可以哦，亲！"); 
        
        String message="";
   
        User user = connect();
        if(user==null){
            message="亲，登录后才可以添加哦！";
            render("/music/music.html",message);  
        }
        String filename = musicFile.getName();
        
        musicFile = MusicAction.saveMusicFile(musicFile, user.fullname);
        
        if(musicFile==null){
            message="对不起，添加失败！";
            render("/music/music.html",message);  
        }
        HashMap<String, String> infoMap = MusicAction.getMusicInfo(musicFile);
         
        Music.saveMusic(user.id , user.fullname, filename, musicFile.getAbsolutePath(),infoMap);

        message="恭喜亲，添加成功！";
        log.info("Add Music Success!!!");
        render("/music/music.html",message);  
            
    }
    
    public static void getMusic(Long musicId) {
        Music music = Music.findById(musicId);
        File file = MusicAction.getMusicFile(music.filePath);
        
        if (file == null) {
            return;
        }
        
        renderBinary(file, music.filaName);
        
        /*
         * 前端下载链接：
         *  <a href="/MusicAdmin/downloadMusic" target="_blank" style="color: green;">下载>></a>
         *  前端歌曲链接：
         *  <source source="/MusicAdmin/getMusic?musicId=musicId" type="audio/mp3">
         */
    }
    
    public static void queryMyMusic(){
        User user = connect();
        if(user==null){
            ControllerUtils.renderError("亲，请先登录吧！");        
        }
        
        List<Music> musicList = Music.findListByUserId(user.id);
        
        ControllerUtils.renderResultJson(musicList);
        
    }
    
    public static void queryMusic(){

        List<Music> musicList = Music.findAll();
        
        ControllerUtils.renderResultJson(musicList);
        
    }


}
