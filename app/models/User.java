package models;

import java.io.File;

import javax.persistence.Entity;

import org.apache.commons.lang3.StringUtils;

import play.data.validation.Email;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class User extends Model {
    @Email
    @Required
    public String email;
    @Required
    public String password;
    @Required
    public String fullname;
    public boolean isAdmin;
       
    public String headerImage;

    public User(String email, String password, String fullname) {
        this.email = email;
        this.fullname = fullname;
        this.password = password;
    }
    
    public User(String email, String password, String fullname, String headerImage) {
        this.email = email;
        this.fullname = fullname;
        this.password = password;
        this.headerImage = headerImage;
    }
    
    public static User connect(String email ,String password){
        return find("byEmailAndPassword",email,password).first();
    } 
    
    public static User login(String fullname ,String password){
        return find("byFullnameAndPassword",fullname,password).first();
    }
    
    public static User findByName(String fullname){
        return find("byFullname",fullname).first();
    }
    
    public  static User saveUser(String email, String password, String fullname){
        User user = new User(email, password, fullname);
        user.save();
        return user;
    }
    
    public  static User saveUser(User user, String headerImage){
        String path = user.headerImage;
        if(!StringUtils.isEmpty(path.trim())){
            File file = new File(path);
            if(file.exists()){
             file.delete();
            }
        }    
        user.headerImage = headerImage;
        user.save();
        return user;
    }
    
    public static User findByUserId(Long id){
        return find("byId",id).first();
    }
}
