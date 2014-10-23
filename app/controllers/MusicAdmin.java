package controllers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import models.Music;
import models.Tag;
import models.User;

import org.apache.commons.lang3.StringUtils;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.TagException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import result.ALResult;

import com.ciaosir.client.pojo.PageOffset;
import com.ciaosir.client.utils.JsonUtil;

import action.MusicAction;

public class MusicAdmin extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(MusicAdmin.class);
   
    public static void myHouse(){
        render("/group/groupMusic.html");
      //  render("musiclisten.html");
    }
    public static void index(String songinfo){
        if(StringUtils.isEmpty(songinfo)){
            render("/music/music.html"); 
        }
        render("/music/music.html",songinfo);
    }
    public static void DetailsInfo(Long musicId){
        Music music = Music.findById(musicId);
        render("/music/musicDetails.html",music);
    }
    public static void groupMusic(){
        render("/group/groupMusic.html");
    }
    public static void deleteMusic(){
        render("/delete/deleteMusic.html");
    }
    public static void uploadMusic(File musicFile) throws IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException{
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
        String musicPath =  musicFile.getAbsolutePath();
        String imagePath = MusicAction.getMusicImage(musicFile, musicPath);
        
        HashMap<String, String> infoMap = MusicAction.getMusicInfo(musicFile);
         
        Music music = Music.saveMusic(user.id , user.fullname, filename, musicPath,imagePath,infoMap);
             
        if(music==null){
            message="添加失败，请重试！";
            render("/music/upload.html",message);  
        }
        message="恭喜亲，添加成功！";
        log.info("Add Music Success!!!");
        boolean isOk = true;
        render("/music/upload.html",music,isOk);  
            
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
    
    public static void getMusicImage(Long musicId) {
        Music music = Music.findById(musicId);        
        File file = MusicAction.getMusicImgFile(music);
        
        if (file == null) {
            return;
        }
                      
        renderBinary(file);
    }
    
    private static User checkUser(){
        User user = connect();
        if(user==null){
            ControllerUtils.renderError("亲，请先登录吧！");        
        }
        return user;
    } 
    
    public static void queryMyChooseMusic(String tags){
        
        User user = checkUser();
        List<Music> musicList = new ArrayList<Music>();
        if(StringUtils.isEmpty(tags)){
           musicList = Music.find("byUserId order by id desc", user.id).fetch();
        }else{
            musicList = Music.findMyMusicTaggedWith(user.id, tags);
        }     
        
        ControllerUtils.renderResultJson(musicList);
        
    }
    
    public static void queryMusic(String songinfo){
        
    //    PageOffset po = new PageOffset(pn, ps);
        
        List<Music> musicList = new ArrayList<Music>();
        List<User> userList = new ArrayList<User>();
       
 
         if(StringUtils.isEmpty(songinfo)){
             musicList =  Music.find("order by id desc ").fetch(50);  
             userList = Music.find("select id,email,headerImage from User where id in( select userId from Music)").fetch();
         }else{
             String str = getSearchStr();
             String info = "%"+songinfo+"%";
             musicList =  Music.find(str,info,info,info,info).fetch();    
             userList = Music.find("select id,email,headerImage from User" +
             		" where id in( select userId from Music where filaName" +
             		" like ? or songTitle like ? or singer like ? or album like ? )",info,info,info,info).fetch();
           //  count = (int)Music.count(str,info,info,info,info);
         }
         
    
       
         Object[] res = new Object[] { musicList, userList };
         ControllerUtils.renderResultJson(res);
       
    }
    
    private static String getSearchStr(){
        return "filaName like ? or songTitle like ? or singer like ? or album like ? order by id desc";
    }
    public static void queryChooseMusic(String tags){
        
        List<Music> musicList = new ArrayList<Music>();
        if(StringUtils.isEmpty(tags)){           
           musicList = Music.find("order by id desc").fetch();
        }else{
            musicList = Music.findTaggedWith(tags);
        }     
        
        ControllerUtils.renderResultJson(musicList);
    }
    
    public static void doDeleteMusic(Long musicId){
        log.error("id: "+musicId );
        Music music = Music.find("byId", musicId).first();      
        if(music == null){
            log.error("找不到该歌曲");
            ControllerUtils.renderError("找不到该歌曲");       
        }
            
        File file = MusicAction.getMusicFile(music.filePath);
        
        if(file.exists()){
            file.delete();
        }
        
        music.delete();
        ControllerUtils.renderSuccess("删除成功");   
        
    }
    
}
