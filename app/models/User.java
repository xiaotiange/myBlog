package models;

import javax.persistence.Entity;

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

    public User(String email, String password, String fullname) {
        this.email = email;
        this.fullname = fullname;
        this.password = password;
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
    
    public static User findByUserId(Long id){
        return find("byId",id).first();
    }
}
