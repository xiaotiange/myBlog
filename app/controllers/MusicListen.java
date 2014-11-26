package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Music;
import models.Tag;

import org.apache.commons.lang3.StringUtils;

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
}
