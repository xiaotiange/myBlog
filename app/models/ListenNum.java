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
        Music music =  Music.findById(musicId);
        
        if(listenLog == null){
            Long firstListenTs = System.currentTimeMillis();
            int listenCount = 1;
            music.listenCount = 1;
            listenLog = new ListenNum(musicId, listenCount,0,0, firstListenTs);
        }else{
            listenLog.listenCount += 1;
            music.listenCount =  listenLog.listenCount ;
            listenLog.lastListenTs = System.currentTimeMillis();
        }
        
        listenLog.save();
    }
    
    public static void addHeartLog(Long musicId){
        ListenNum heartLog = ListenNum.find("byMusicId", musicId).first();
        Music music =  Music.findById(musicId);
        
        if(heartLog == null){
            Long firstListenTs = System.currentTimeMillis();
            int heartCount = 1;
            music.heartCount = 1;
            heartLog = new ListenNum(musicId, 0 , heartCount, 0 , firstListenTs);
        }else{
            heartLog.heartCount += 1;
            music.heartCount =  heartLog.heartCount ;
            heartLog.lastListenTs = System.currentTimeMillis();
        }
        
        heartLog.save();
        music.save();
    }
    
    public static void addMusicLog(Long musicId){
        ListenNum addLog = ListenNum.find("byMusicId", musicId).first();
        Music music =  Music.findById(musicId);
        
        if(addLog == null){
            Long firstListenTs = System.currentTimeMillis();
            int addCount = 1;
            music.addCount = 1;
            addLog = new ListenNum(musicId, 0 , 0, addCount , firstListenTs);
        }else{
            addLog.addCount += 1;
            music.addCount =  addLog.addCount ;
            addLog.lastListenTs = System.currentTimeMillis();
        }
        
        addLog.save();
        music.save();
    }

}
