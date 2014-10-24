package models;

import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class HeartMusic extends Model {
    
    @Required
    public Long musicId;
    
    @Required
    public Long userId;
    
    @Required
    public Long createTs;

    
    public HeartMusic(){
        super();
    }
    
    public HeartMusic(Long musicId, Long userId){
        super();
        this.musicId = musicId;
        this.userId = userId;
        this.createTs = System.currentTimeMillis();
   
    }
    
    public static void doHeartMusic(Long musicId,Long userId){
        HeartMusic music = HeartMusic.find("byMusicIdandUserId", musicId,userId).first();
        ListenNum.addHeartLog(musicId);
        
        if(music == null){
            music = new HeartMusic(musicId, userId);
            music.save();            
        }
   
       
    }

}
