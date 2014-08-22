package notifiers;

import org.apache.commons.mail.EmailAttachment;

import models.User;
import play.Play;
import play.mvc.Mailer;

public class Mails extends Mailer{

    public static void welcome(User user) {
        setSubject("Welcome %s", user.fullname);
        addRecipient(user.email);
        setFrom("Me <18768113677@163.com>");
        EmailAttachment attachment = new EmailAttachment();
        attachment.setDescription("A pdf document");
        attachment.setPath(Play.getFile("rules.pdf").getPath());
        addAttachment(attachment);
        send(user);
     }
   
     public static void lostPassword(User user) {
        String newpassword = user.password;
        setFrom("Robot <18768113677@163.com>");
        setSubject("Your password has been reset");
        addRecipient(user.email);
        send(user, newpassword);
     }
}
