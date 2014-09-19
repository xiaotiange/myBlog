package controllers;

import org.apache.commons.lang3.StringUtils;

import com.ciaosir.client.utils.JsonUtil;

import action.UserLoginRegAction;

import models.User;
import models.ALSession;
import play.Play;
import play.cache.Cache;
import play.libs.Codec;
import result.ALResult;
import utils.PlayUtil;

public class ALLogin extends ControllerUtils {

    public static void index(String requestUrl){
        String randomID=Codec.UUID();
        render("/allogin/login.html", randomID, requestUrl);
    }
    
    public static void register(String url){
        String randomID=Codec.UUID();
        render("/allogin/register.html", randomID, url);
    }
    
    public static void doLogin(String username, String password){
       // checkCaptcha(code, randomID); 
        
        String ip = ControllerUtils.getRemoteIp();        
        ALResult<ALSession> loginRes = UserLoginRegAction.userLogin(username, password, ip);
        
        trySetCookie(loginRes);  
        renderResultJson(loginRes);
        
    }
    /*
    private static void checkCaptcha( String code, String randomID){
        if(!StringUtils.isBlank(code) && !StringUtils.isBlank(randomID) && code.equalsIgnoreCase(Cache.get(randomID).toString())){
            Cache.delete(randomID);          
        }else{
            renderError("验证码错误！");  
        }
    }
    */
  public static void doRegister(String username, String password,String email){
     // checkCaptcha(code, randomID); 
      
      String ip = ControllerUtils.getRemoteIp();
      ALResult<ALSession> registerRes = UserLoginRegAction.userRegister(username, password, email, ip);
      
      trySetCookie(registerRes);     
      renderSuccess("注册成功");
        
    }

  protected static void trySetCookie(ALResult<ALSession> res) {
      if (res == null) {
          return;
      }
      if (res.isOk() == false) {
          return;
      }
      ALSession ses = res.getRes();
      if (ses == null) {
          return;
      }
      putSidToCookie(ses.getId());
  }
  

  protected static void putSidToCookie(String sid) {
      session.put(SID_COOKIE_KEY, sid);
      response.setCookie(SID_COOKIE_KEY, sid, "14d");
  }
  
  protected static void clearCookie() {
      session.remove(SID_COOKIE_KEY);
      response.setCookie(SID_COOKIE_KEY, "", "14d");
      response.removeCookie(SID_COOKIE_KEY);
  }
  
  protected static String getSidFromCookie() {
      String sid = session.get(ALLogin.SID_COOKIE_KEY);
      
      if (StringUtils.isEmpty(sid)) {
          sid = PlayUtil.getCookieString(request, ALLogin.SID_COOKIE_KEY);
      }
      
      return sid;
  }
 
  private static String SID_COOKIE_KEY = "_sid";
  
  public static void doLogout() {      
      clearCookie();  
      Application.index();
  }
    
    
}
