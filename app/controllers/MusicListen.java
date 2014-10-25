package controllers;

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
    
}
