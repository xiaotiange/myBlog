package models;

import javax.persistence.Column;
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
    
    @Required
    @Column(columnDefinition = "int default 0")
    public int listenCount;

    
    public ListenLog(){
        super();
    }
    
    public ListenLog(Long musicId, Long userId,int listenCount){
        super();
        this.musicId = musicId;
        this.userId = userId;
        this.listenTs = System.currentTimeMillis();
        this.listenCount = listenCount;
   
    }
    
    public static void addListenLog(Long musicId,Long userId){
        ListenLog music = ListenLog.find("byMusicIdAndUserId", musicId,userId).first();
        if(music == null){
            music = new ListenLog(musicId, userId,1); 
        }else{
           music.listenCount += 1;
           music.listenTs = System.currentTimeMillis();
        }
 
        music.save();   
         
    }

}
