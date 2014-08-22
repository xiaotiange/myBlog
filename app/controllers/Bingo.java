package controllers;

import play.mvc.Controller;

public class Bingo extends Controller{

    public static void index(){
        render("/bingo/bingohome.html");
    }


}
