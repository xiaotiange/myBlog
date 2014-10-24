package models;

import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class ListenLog extends Model {
    
    @Required
    public Long musicId;
    
    @Required
    public Long userId;
    
    @Required
    public Long listenTs;

    
    public ListenLog(){
        super();
    }
    
    public ListenLog(Long musicId, Long userId){
        super();
        this.musicId = musicId;
        this.userId = userId;
        this.listenTs = System.currentTimeMillis();
   
    }
    
    public static void addListenLog(Long musicId,Long userId){
        ListenLog music = new ListenLog(musicId, userId);
        music.save();   
         
    }

}
