package controllers;

import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserCenter extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(UserCenter.class);
    
    public static void myMusic(){
        User user = checkIsLogin();
        if(user ==null){
            render("/home.html");
        }
        render("/music/myMusic.html");
    }

}
