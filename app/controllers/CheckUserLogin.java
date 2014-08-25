
package controllers;

import models.User;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.codehaus.jackson.annotate.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import action.LoginUserGetAction;

import com.ciaosir.client.utils.JsonUtil;

import play.Play;
import play.mvc.After;
import play.mvc.Before;
import play.mvc.Controller;
import result.ALResult;
import utils.PlayUtil;

public class CheckUserLogin extends Controller {

    private static final Logger log = LoggerFactory.getLogger(CheckUserLogin.class);
    
    private final static String USER_ARG_KEY = "_user_";
   
 
    @Before
    static void check(){
        User user = checkIsLogin();
        if(user != null){
            renderArgs.put("user", user);
        }
    }
    
    static User checkIsLogin() {

         User user = (User) request.args.get(USER_ARG_KEY);
        
        if (user != null) {
          return user;
        }
         
        String sid = ALLogin.getSidFromCookie();
        
        if (StringUtils.isEmpty(sid)) {
          return null;
        }
        
        String ip = ControllerUtils.getRemoteIp();
        user = LoginUserGetAction.fetchUserBySid(sid, ip);
        
        if (user == null) {
           return null;
        }
        
        ALLogin.putSidToCookie(sid);     
        request.args.put(USER_ARG_KEY, user);
    
        return user;
    }
 
    static User connect() {
        
        User user = (User) request.args.get(USER_ARG_KEY);
        
        if (user == null) {
            ControllerUtils.renderLoginFail("找不到用户，您尚未登录，请先登录！");
        }
        
        return user;
    }     
}
