package models;

import java.util.Date;
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
    public Long createTs;
    

    public Music(Long userId, String username, String filaName, String filePath) {
        this.username = username;
        this.filaName = filaName;
        this.filePath = filePath;
        this.userId = userId;
        this.createTs = System.currentTimeMillis();
    }
    
    public  static Music saveMusic(Long userId, String username, String filaName, String filePath){
        Music music = new Music(userId, username, filaName, filePath);
        music.save();
        return music;
    }
    
    public static List<Music> findListByUserId(Long userId){
        List<Music> musicList = Music.find("byUserId", userId).fetch();
        return musicList;
    }
}
