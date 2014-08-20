package models.admin;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Transient;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ciaosir.client.pojo.PageOffset;

import play.db.jpa.Model;
import transaction.JDBCBuilder;
import transaction.CodeGenerator.DBDispatcher;
import transaction.CodeGenerator.PolicySQLGenerator;
import transaction.DBBuilder.DataSrc;

@Entity(name = Member.TABLE_NAME)
public class Member extends Model implements PolicySQLGenerator<Long> {

    private static final Logger log = LoggerFactory.getLogger(Member.class);

    public static final String TABLE_NAME = "member";

    @Transient
    public static Member Empty = new Member();
    
    @Transient
    public static DBDispatcher dp = new DBDispatcher(DataSrc.BASIC, Empty);
    
    private Long memberId;
    
    private String memberName;
    
    private String password;
    
    private String email;
    
    private int memberRole;//会员等级

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getMemberRole() {
        return memberRole;
    }

    public void setMemberRole(int memberRole) {
        this.memberRole = memberRole;
    }
    
    public Member(){
        super();
    }
    
    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

    @Override
    public String getTableHashKey(Long t) {
        return null;
    }

    @Override
    public String getIdColumn() {
        return "id";
    }

    @Override
    public String getIdName() {
        return "id";
    }
    
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
    
   public static long findExistId(Long id) {
        
        String query = " select id from " + TABLE_NAME + " where id = ? ";
        return dp.singleLongQuery(query, id);
    }
   
   @Override
   public boolean jdbcSave() {
       
       long existId = findExistId(this.id);

       if (existId <= 0L) {
           return rawInsert();
       } else {
           this.setId(existId);
           return rawUpdate();
       }
   }
   
   private boolean rawInsert() {
       
       String insertSQL = "insert into `" + TABLE_NAME + "`(`memberId`,`password`,`email`," +
               "`memberName`,`memberRole``) " +
               " values(?,?,?,?,?)";
       

       long id = dp.insert(insertSQL, this.memberId, this.password, this.email, this.memberName, this.memberRole);

       if (id > 0L) {
           return true;
       } else {
           log.error("Insert Fails....." + "[memberId : ]" + this.memberId);
           return false;
       }

   }

   private boolean rawUpdate() {

       String updateSQL = "update `" + TABLE_NAME + "` set `memberId` = ?,`password` = ?, " +
               "`email` = ?, `memberName` = ? ,`memberRole` = ? " +
               " where `id` = ? ";
       

       long updateNum = dp.update(updateSQL, this.memberId, this.password, this.email, this.memberName, this.memberRole,
               this.getId());

       if (updateNum == 1) {
           return true;
       } else {
           log.error("update failed...for :" + "[id : ]" + this.getId());
           return false;
       }
   }
   
   public boolean rawDelete() {
       
       String sql = " delete from " + TABLE_NAME + " where id = ? ";
       
       dp.update(sql, this.id);
       
       return true;
       
   }
    
   public static Member  findByMissionId(Long memberId) {
       String query = " select " + SelectAllProperty + " from " + TABLE_NAME + " where memberId = ? ";
       
       return findByJDBC(query, memberId);
   }
   
   public static int countBySearchRules(int tag, Long memberId){
   List<Object> paramList = new ArrayList<Object>();

           String whereSql = " memberId = ? ";
           paramList.add(memberId);

       
       String query = " select count(*) from " + TABLE_NAME + " where " + whereSql;
       Object[] paramArray = paramList.toArray();
       
       return (int) dp.singleLongQuery(query, paramArray); 
       
   }
   
   private static Member findByJDBC(String query, Object... params) {
       return new JDBCBuilder.JDBCExecutor<Member>(dp, query, params) {

           @Override
           public Member doWithResultSet(ResultSet rs) throws SQLException {
               if (rs.next()) {
                   return parseMember(rs);
               } else {
                   return null;
               }
           }
           
           
       }.call();
   }
  
   public static List<Member> findBySearchRules(int tag, Long userId, String orderBy, boolean isDesc, PageOffset po) {
       
       List<Object> paramList = new ArrayList<Object>();
       String whereSql = " 1=1 ";
       if (tag == 1) {
           whereSql += " and toUserId = ? ";
           paramList.add(userId);
       }else if(tag == 2){
           whereSql += " and fromUserId = ? ";
           paramList.add(userId);
       }
       
       String query = " select " + SelectAllProperty + " from " + TABLE_NAME + " where " + whereSql;
       
       if (StringUtils.isEmpty(orderBy)) {
           orderBy = " createTs ";
       }
       query += " order by " + orderBy + " ";
       if (isDesc == true) {
           query += " desc ";
       } else {
           query += " asc ";
       }
       query += " limit ?, ? ";
       
       paramList.add(po.getOffset());
       paramList.add(po.getPs());
       
       Object[] paramArray = paramList.toArray();
       
       return findListByJDBC(query, paramArray);
       
   }
   private static List<Member> findListByJDBC(String query, Object... params) {
       return new JDBCBuilder.JDBCExecutor<List<Member>>(dp, query, params) {

           @Override
           public List<Member> doWithResultSet(ResultSet rs) throws SQLException {
               
               List<Member> memberList = new ArrayList<Member>();
               
               while (rs.next()) {
                   Member comments = parseMember(rs);
                   if (comments != null) {
                       memberList.add(comments);
                   }
               } 
               
               return memberList;
           }
           
           
       }.call();
   }
   
   private static final String SelectAllProperty = " id, memberId, password, email, " +
           "memberName, memberRole ";
   
   private static Member parseMember(ResultSet rs) {
       try {
           
           Member member = new Member();
           
           member.setId(rs.getLong(1));
           member.setMemberId(rs.getLong(2));
           member.setPassword(rs.getString(3));
           member.setEmail(rs.getString(4));
           member.setMemberName(rs.getString(5));
           member.setMemberRole(rs.getInt(6));
          
           return member;
           
       } catch (Exception ex) {
           log.error(ex.getMessage(), ex);
           return null;
       }
   } 

   @Override
   public String toString() {
       return "Comment [memberId=" + memberId + ", password=" + password
               + ", memberName=" + memberName + ", email=" + email + ", memberRole="
               + memberRole +  "]";
   }
   
}
