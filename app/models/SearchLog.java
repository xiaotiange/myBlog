package models;

import javax.persistence.Entity;


import play.data.validation.Required;
import play.db.jpa.Model;

@Entity(name = SearchLog.TABLE_NAME)
public class SearchLog extends Model {
    
    public final static String TABLE_NAME = "search_log";
    
    @Required
    public String keyword;
    
    @Required
    public int searchCount;
    
    @Required
    public Long  firstSearchTs;
    
    @Required
    public Long  lastSearchTs;
    
    public SearchLog(){
        super();
    }
    
    public SearchLog(String keyword){
        super();
        this.searchCount = 1;
        this.keyword = keyword;
        this.firstSearchTs = System.currentTimeMillis();
        this.lastSearchTs = this.firstSearchTs;
    }
    
    public static void addSearchLog(String keyword){
        SearchLog log = SearchLog.find("byKeyword", keyword).first();
        if(log == null){
            log = new SearchLog(keyword);
        }else{
            log.searchCount += 1;
            log.lastSearchTs = System.currentTimeMillis();
        }
        
        log.save();
        
    }

}
