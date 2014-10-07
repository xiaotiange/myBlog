package controllers;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import models.Music;
import models.Tag;
import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import action.MusicAction;

public class MusicAdmin extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(MusicAdmin.class);
   
    public static void myHouse(){
        render("/music/myMusic.html");
    }
    public static void index(){
        render("/music/music.html");
    }
    public static void uploadMusic(File musicFile){
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
        String userid = user.id+"";
        
        musicFile = MusicAction.saveMusicFile(musicFile, userid);
        
        if(musicFile==null){
            message="添加失败，请重试！";
            render("/music/upload.html",message);  
        }
        HashMap<String, String> infoMap = MusicAction.getMusicInfo(musicFile);
         
        Music music = Music.saveMusic(user.id , user.fullname, filename, musicFile.getAbsolutePath(),infoMap);
             
        if(music==null){
            message="添加失败，请重试！";
            render("/music/upload.html",message);  
        }
        message="恭喜亲，添加成功！";
        log.info("Add Music Success!!!");
        
        render("/music/upload.html",message,music);  
            
    }
    
    public static void updateMusic(Long musicId,String tags,
            String songTitle, String singer, String fileName, String album){
        User user = checkUser();      
        Music music = Music.findById(musicId);
        
        if(music==null){
            ControllerUtils.renderError("亲，歌曲不存在了，可能已经删除了！");     
        }
        
        if(!user.id.equals(music.userId)){
            ControllerUtils.renderError("亲，这不是你的歌曲哦！");     
        }
        
        music.tags.clear();
        
        tags = tags.replace("，", ",");
        for(String tag : tags.split(",")) {
            if(tag.trim().length() > 0){
                music.tags.add(Tag.findOrCreateByName(tag));
            }
        }
        log.error(music.tags.toString());
        music.songTitle = songTitle;
        music.singer = singer;
        music.album = album;
        music.filaName = fileName;
        music.save();
        
        if(music==null) ControllerUtils.renderError("修改错误，请重试！");
        
        ControllerUtils.renderSuccess("修改成功！");
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
    
    private static User checkUser(){
        User user = connect();
        if(user==null){
            ControllerUtils.renderError("亲，请先登录吧！");        
        }
        return user;
    } 
    
    public static void queryMyMusic(){
        
        User user = checkUser();
      
        List<Music> musicList = Music.findListByUserId(user.id);
        
        ControllerUtils.renderResultJson(musicList);
        
    }
    
    public static void queryMusic(){

        List<Music> musicList = Music.all().from(0).fetch(50);
        
        ControllerUtils.renderResultJson(musicList);
        
    }
    
    public static void queryChooseMusic(String tags){
        List<Music> musicList = Music.findTaggedWith(tags);
        
        ControllerUtils.renderResultJson(musicList);
    }


}
