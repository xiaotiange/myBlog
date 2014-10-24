package models;

import javax.persistence.Column;
import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class ListenNum extends Model {
    
    @Required
    public Long musicId;
    
    @Required
    public int listenCount;
    
    @Required
    @Column(columnDefinition = "int default 0")
    public int heartCount;
    
    @Required
    @Column(columnDefinition = "int default 0")
    public int addCount;
    
    @Required
    public Long firstListenTs;
    
    @Required
    public Long lastListenTs;
    
    public ListenNum(){
        super();
    }
    
    public ListenNum(Long musicId, int listenCount,
            int heartCount,int addCount, Long firstListenTs){
        super();
        this.musicId = musicId;
        this.listenCount = listenCount;
        this.addCount = addCount;
        this.firstListenTs = firstListenTs;
        this.lastListenTs = firstListenTs;
    }
    
    public static void addListenLog(Long musicId){
        ListenNum listenLog = ListenNum.find("byMusicId", musicId).first();
        
        if(listenLog == null){
            Long firstListenTs = System.currentTimeMillis();
            int listenCount = 1;
            listenLog = new ListenNum(musicId, listenCount,0,0, firstListenTs);
        }else{
            listenLog.listenCount += 1;
            listenLog.lastListenTs = System.currentTimeMillis();
        }
        
        listenLog.save();
    }
    
    public static void addHeartLog(Long musicId){
        ListenNum heartLog = ListenNum.find("byMusicId", musicId).first();
        
        if(heartLog == null){
            Long firstListenTs = System.currentTimeMillis();
            int heartCount = 1;
            heartLog = new ListenNum(musicId, 0 , heartCount, 0 , firstListenTs);
        }else{
            heartLog.heartCount += 1;
            heartLog.lastListenTs = System.currentTimeMillis();
        }
        
        heartLog.save();
    }
    
    public static void addMusicLog(Long musicId){
        ListenNum addLog = ListenNum.find("byMusicId", musicId).first();
        
        if(addLog == null){
            Long firstListenTs = System.currentTimeMillis();
            int addCount = 1;
            addLog = new ListenNum(musicId, 0 , 0, addCount , firstListenTs);
        }else{
            addLog.heartCount += 1;
            addLog.lastListenTs = System.currentTimeMillis();
        }
        
        addLog.save();
    }

}
