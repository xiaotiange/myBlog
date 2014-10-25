package controllers;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import models.AddToMeLog;
import models.HeartMusic;
import models.Music;
import models.User;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ciaosir.client.CommonUtils;

import result.ALResult;

public class LogAdmin extends CheckUserLogin{
    
    private static final Logger log = LoggerFactory.getLogger(LogAdmin.class);
    
    //收藏
    public static void heartMyMusic(Long musicId){
         User user = connect();
         if(user == null){
             ControllerUtils.renderError("先去登录吧亲！");
         }
         ALResult res = HeartMusic.doHeartMusic(musicId, user.id);
         
         
         ControllerUtils.renderALResult(res);
         
    }
    
    //添加
    public static void addMyMusic(Long musicId){
        User user = connect();
        if(user == null){
            ControllerUtils.renderError("先去登录吧亲！");
        }
        
        ALResult res = AddToMeLog.doHeartMusic(musicId, user.id);
        
        ControllerUtils.renderALResult(res);
    }
    
    public static void doSearchMyHeartMusic(){
        User user = connect();
        if(user == null){
            ControllerUtils.renderError("先去登录吧亲！");
        }
        
         List<Music> musicList = Music.find("select  m from Music m where id in(select musicId from" +
         		" HeartMusic where userId = ? order by createTs desc)  ", user.id).fetch();
         
         List<User> userList = new ArrayList<User>();
         userList = Music.find("select id,email,headerImage,fullname from User" +
                 " where id in( select userId from Music where id in(select musicId from" +
                " HeartMusic where userId = ? ))", user.id).fetch();
        
         Object[] res = new Object[] { musicList, userList };
         ControllerUtils.renderResultJson(res);
        
        ControllerUtils.renderResultJson(musicList);
              
    }
    
    public static void queryMyAddedMusic(){
        User user = connect();
        if(user == null){
            ControllerUtils.renderError("先去登录吧亲！");
        }
        
         List<Music> musicList = Music.find("select  m from Music m where id in(select musicId from" +
                " AddToMeLog where userId = ? order by createTs desc)  ", user.id).fetch();
         
         List<User> userList = new ArrayList<User>();
         userList = Music.find("select id,email,headerImage,fullname from User" +
                 " where id in( select userId from Music where id in(select musicId from" +
                " AddToMeLog where userId = ? ))", user.id).fetch();
        
         Object[] res = new Object[] { musicList, userList };
         ControllerUtils.renderResultJson(res);
              
    }
    


}
