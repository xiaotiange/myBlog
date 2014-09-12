package controllers;

import models.User;

public class AllUser extends CheckUserLogin {
    
    public static void getUser(){
        User user = connect();
        
        if(user==null){
            ControllerUtils.renderError("尚未登录"); 
        }
        ControllerUtils.renderResultJson(user);
        
    }

}
