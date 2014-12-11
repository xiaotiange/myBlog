package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Music;
import models.SearchLog;
import models.Tag;
import models.User;

import org.apache.commons.lang3.StringUtils;

import result.ALResult;

import com.ciaosir.client.pojo.PageOffset;

public class MusicListen extends CheckUserLogin {

    public static void listenMusic(){
        render("/listen/musicListen.html");
    }
    
    public static void listenHeartedMusic(){
        render("/heart/heartMusic.html");
    }
    
    public static void listenAddedMusic(){
        render("/add/addedMusic.html");
    }
    
    public static void listenMyMusic(){
        render("/music/myMusic.html");
    }
    
  public static void queryMusicTags(){
        
        List<Tag> tagList = Tag.find("byIdGreaterThan", 4L).fetch();
        
        ControllerUtils.renderResultJson(tagList);
    }
  
  public static void queryListenMusic(int pn, int ps){
      
      PageOffset po = new PageOffset(pn, ps);
      int offset = po.getOffset();
      
      List<Music> musicList = new ArrayList<Music>();

      musicList =  Music.find("order by id desc ").from(offset).fetch(ps);  
      int count = (int) Music.count();     

      ALResult res = new ALResult(musicList, count, po);
      ControllerUtils.renderALResult(res);
     
  }
  
}
