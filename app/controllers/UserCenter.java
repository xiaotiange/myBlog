package controllers;

import models.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserCenter extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(UserCenter.class);
    
    public static void myMusic(){
        User user = checkIsLogin();
        if(user ==null){
            ControllerUtils.renderLoginFail();
        }
        render("/music/myMusic.html");
    }

}
