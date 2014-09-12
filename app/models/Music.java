package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Music extends Model {
    
    @Required
    public String username;
    
    @Required
    public String filaName;
    
    @Required
    public String filePath;
    
    @Required
    public Long createTs;
    

    public Music(String username, String filaName, String filePath) {
        this.username = username;
        this.filaName = filaName;
        this.filePath = filePath;
        this.createTs = System.currentTimeMillis();
    }
    
    public  static Music saveMusic(String username, String filaName, String filePath){
        Music music = new Music(username, filaName, filePath);
        music.save();
        return music;
    }
}
