import models.*;
import play.jobs.*;
import play.test.*;
import play.*;

@OnApplicationStart
public class Bootstrap extends Job{

    public void doJob(){
        //check if the data is empty
        if(User.count()==0){
            Fixtures.load("initial-data.yml");
        }
    }
}
