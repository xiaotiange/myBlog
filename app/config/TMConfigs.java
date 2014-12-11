package config;

import java.io.File;

import play.Play;

public class TMConfigs {

    public static File configDir = new File(Play.applicationPath, "conf");

    public static File sqlDir = new File(configDir, "sql");
    
}
