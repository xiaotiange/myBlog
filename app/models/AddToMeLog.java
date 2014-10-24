package models;

import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class AddToMeLog extends Model {
    
    @Required
    public Long musicId;
    
    @Required
    public Long userId;
    
    @Required
    public Long createTs;

    
    public AddToMeLog(){
        super();
    }
    
    public AddToMeLog(Long musicId, Long userId){
        super();
        this.musicId = musicId;
        this.userId = userId;
        this.createTs = System.currentTimeMillis();
   
    }
    
    public static void doHeartMusic(Long musicId,Long userId){
        AddToMeLog music = AddToMeLog.find("byMusicIdandUserId", musicId,userId).first();
        ListenNum.addMusicLog(musicId);
        
        if(music == null){
            music = new AddToMeLog(musicId, userId);
            music.save();            
        }
         
    }

}
