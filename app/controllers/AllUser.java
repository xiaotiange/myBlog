package controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import models.User;

public class AllUser extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(AllUser.class);
    
    public static void getUser(){
        User user = connect();
        
        if(user==null){
            ControllerUtils.renderError("尚未登录"); 
        }
        hideUserInfo(user);
        ControllerUtils.renderResultJson(user);
        
    }
    
    public static String tryGetUser(){
        User user = connect();
        
        if(user==null){
            return "";
        }
        hideUserInfo(user);
      
        return user.fullname;
        
    }
    
    public static boolean tryGetUserRole(){
        User user = connect();
        
        if(user==null){
            return false;
        }
        hideUserInfo(user);
      
        return user.isAdmin;
        
    }
    
    private static User hideUserInfo(User user){
        if(user == null){
            return null;
        }
        
        user.password = "***";
        return user;
    }

}
