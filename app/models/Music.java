package models;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Music extends Model {
    
    @Required
    public Long userId;
    
    @Required
    public String username;
    
    @Required
    public String filaName;
    
    @Required
    public String filePath;
    
    @Required
    public Long  createTs;//添加歌曲时间
    
    @Required
    public String  songTitle;
    
    @Required
    public String  singer;
    
    @Required
    public String  album;
    
    @Required
    public String  year;
    
    public static class musicInfo {
        private static final String songTitle = "TIT2";//歌名标识
        private static final String singer = "TPE1";//歌手标识
        private static final String album = "TALB";//专辑标识
        private static final String year = "TYER";//发行日期标识
    }

    public Music(Long userId, String username, String filaName, 
            String filePath, HashMap<String, String> map) {
        this.username = username;
        this.filaName = filaName;
        this.filePath = filePath;
        this.userId = userId;
        this.songTitle = map.get(musicInfo.songTitle);
        this.singer = map.get(musicInfo.singer);
        this.album = map.get(musicInfo.album);
        this.year = map.get(musicInfo.year);
        this.createTs =  System.currentTimeMillis();
    }
    
    public  static Music saveMusic(Long userId, String username, String filaName, 
            String filePath,HashMap<String, String> infoMap){
        Music music = new Music(userId, username, filaName, filePath,infoMap);
        music.save();
        return music;
    }
    
    public static List<Music> findListByUserId(Long userId){
        List<Music> musicList = Music.find("byUserId", userId).fetch();
        return musicList;
    }
}
