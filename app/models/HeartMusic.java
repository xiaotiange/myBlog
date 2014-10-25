package models;

import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;
import result.ALResult;

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
    
    public static ALResult doHeartMusic(Long musicId,Long userId){
        HeartMusic music = HeartMusic.find("byMusicIdAndUserId", musicId,userId).first();
        ListenNum.addHeartLog(musicId);
        
        if(music == null){
            music = new HeartMusic(musicId, userId);                  
        }else{
            music.createTs = System.currentTimeMillis();
        }
             
        HeartMusic sMusic = music.save();   
        if(sMusic == null){
            return new ALResult(false, "失败失败，请重试！");
        }else{
            return new ALResult(true, "收藏成功！");
        }
    }
    
   

}
