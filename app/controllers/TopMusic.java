package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Music;
import models.SearchLog;
import models.User;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TopMusic extends CheckUserLogin {
    
    private static final Logger log = LoggerFactory.getLogger(TopMusic.class);
    
    public static void topHouse(){
        render("/bangdan/topMusic.html");
    }
    
    public static void searchTopMusic(){
        List<Music> firstList = new ArrayList<Music>();
        List<Music> secondList = new ArrayList<Music>();
        List<Music> thirdList = new ArrayList<Music>();
        List<Music> fourList = new ArrayList<Music>();
       
        firstList = Music.find("select m from Music m where listenCount > 0 order by listenCount desc").fetch(10);
        secondList = Music.find("select m from Music m where heartCount > 0 order by heartCount desc").fetch(10);
        thirdList = Music.find("select m from Music m where addCount > 0 order by addCount desc").fetch(10);
        fourList = Music.find("select m from Music  m order by createTs desc").fetch(10);

         Object[] res = new Object[] { firstList, secondList,thirdList, fourList};
         ControllerUtils.renderResultJson(res);
    }

}
