package controllers;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import models.AddToMeLog;
import models.HeartMusic;
import models.Music;
import models.User;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import play.db.Model;
import play.db.jpa.GenericModel;
import play.db.jpa.JPA;

import com.ciaosir.client.CommonUtils;

import result.ALResult;
import weibo4j.model.Query;

public class LogAdmin extends CheckUserLogin {

    private static final Logger log = LoggerFactory.getLogger(LogAdmin.class);

    private static final int topLimit = 10;

    // 收藏
    public static void heartMyMusic(Long musicId) {
        User user = connect();
        if (user == null) {
            ControllerUtils.renderError("先去登录吧亲！");
        }
        ALResult res = HeartMusic.doHeartMusic(musicId, user.id);

        ControllerUtils.renderALResult(res);

    }

    // 添加
    public static void addMyMusic(Long musicId) {
        User user = connect();
        if (user == null) {
            ControllerUtils.renderError("先去登录吧亲！");
        }

        ALResult res = AddToMeLog.doHeartMusic(musicId, user.id);

        ControllerUtils.renderALResult(res);
    }

    public static void doSearchMyHeartMusic() {
        User user = connect();
        if (user == null) {
            ControllerUtils.renderError("先去登录吧亲！");
        }

        List<Music> musicList = Music
                .find("select  m from Music m where id in(select musicId from"
                        + " HeartMusic where userId = ? order by createTs desc )  ",
                        user.id).fetch();

        List<Music> popularMusicList = Music
                .find("select  m from Music m where heartCount > 0 order by heartCount desc ")
                .fetch(topLimit);

        Object[] res = new Object[] { musicList, popularMusicList };
        ControllerUtils.renderResultJson(res);

        ControllerUtils.renderResultJson(musicList);

    }

    public static void queryMyAddedMusic() {
        User user = connect();
        if (user == null) {
            ControllerUtils.renderError("先去登录吧亲！");
        }

        List<Music> musicList = Music
                .find("select  m from Music m where id in(select musicId from"
                        + " AddToMeLog where userId = ? order by createTs desc)  ",
                        user.id).fetch();

        List<Music> popularMusicList = Music
                .find("select  m from Music m where addCount > 0 order by addCount desc ")
                .fetch(topLimit);

        Object[] res = new Object[] { musicList, popularMusicList };
        ControllerUtils.renderResultJson(res);

    }

}
