package models;

import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class ListenNum extends Model {
    
    @Required
    public Long musicId;
    
    @Required
    public Long listenCount;
    
    @Required
    public Long firstListenTs;
    
    @Required
    public Long lastListenTs;
    
    public ListenNum(){
        super();
    }
    
    public ListenNum(Long musicId, Long listenCount, Long firstListenTs){
        super();
        this.musicId = musicId;
        this.listenCount = listenCount;
        this.firstListenTs = firstListenTs;
        this.lastListenTs = firstListenTs;
    }
    
    public static void addListenLog(Long musicId){
        ListenNum listenLog = ListenNum.find("byMusicId", musicId).first();
        
        if(listenLog == null){
            Long firstListenTs = System.currentTimeMillis();
            Long listenCount = (long) 1;
            listenLog = new ListenNum(musicId, listenCount, firstListenTs);
        }else{
            listenLog.listenCount += 1;
            listenLog.lastListenTs = System.currentTimeMillis();
        }
        
        listenLog.save();
    }

}
