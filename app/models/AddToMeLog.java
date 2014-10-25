package models;

import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;
import result.ALResult;

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
    
    public static ALResult doHeartMusic(Long musicId,Long userId){
        AddToMeLog music = AddToMeLog.find("byMusicIdAndUserId", musicId,userId).first();
        ListenNum.addMusicLog(musicId);
        
        if(music == null){
            music = new AddToMeLog(musicId, userId);                
        }else{
            music.createTs = System.currentTimeMillis();
        }
        
        AddToMeLog sMusic = music.save();   
        if(sMusic == null){
            return new ALResult(false, "添加失败，请重试！");
        }else{
            return new ALResult(true, "添加成功！");
        }
    }

}
