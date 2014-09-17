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
        //log.info("用户"+user.fullname+"已登录");
        ControllerUtils.renderResultJson(user);
        
    }

}
