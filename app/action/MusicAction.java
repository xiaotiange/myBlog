package action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.Random;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import play.Play;

public class MusicAction {

    private static final Logger log = LoggerFactory.getLogger(MusicAction.class);
    
    private static final String MusicFolderPrefix = Play.configuration.getProperty("music.savefilepath",
            "/data/music");
    
    public static File getMusicFile(String filePath) {
        if (StringUtils.isEmpty(filePath)) {
            return null;
        }
        
        File file = new File(filePath);
        if (file.exists() == false) {
            return null;
        }
        
        return file;
        
    }
    
    public static File saveMusicFile(File musicFile, String username){
       
        Calendar now = Calendar.getInstance();
         
         now.setTimeInMillis(System.currentTimeMillis());
         
         int year = now.get(Calendar.YEAR);
         
         int month = now.get(Calendar.MONTH);
         int day = now.get(Calendar.DAY_OF_MONTH);
         
         final String relativePath = year + "/" + (month + 1) + "-" + day + "/";
         final String absolutePath = getAbsolutePath(relativePath);
         
         File folder = new File(absolutePath);
         if (folder.exists() == false) {
             folder.mkdirs();
         }
        
         musicFile = copyToFolder(folder, musicFile, username);
         return musicFile;
    }
    
    private static String getAbsolutePath(String relativePath) {
        String absolutePth = "";
        if (MusicFolderPrefix.trim().endsWith("/")) {
            absolutePth = MusicFolderPrefix.trim() + relativePath;
        } else {
            absolutePth = MusicFolderPrefix.trim() + "/" + relativePath;
        }
        
        return absolutePth;
    }
    
    
 private static File copyToFolder(File folder,File musicFile, String username) {
        
        
        File targetFile = new File(folder, genFileName(username));
        
        while (targetFile.exists()) {
            targetFile = new File(folder, genFileName(username)
                    + "_" + new Random().nextInt(100000));
        }
        
        
        InputStream inBuff = null;
        OutputStream outBuff = null;
        try {
            // 新建文件输入流并对它进行缓冲
            inBuff = new BufferedInputStream(new FileInputStream(musicFile));

            // 新建文件输出流并对它进行缓冲
            outBuff = new BufferedOutputStream(new FileOutputStream(targetFile));

            // 缓冲数组
            byte[] b = new byte[1024 * 5];
            int len = 0;
            while ((len = inBuff.read(b)) != -1) {
                outBuff.write(b, 0, len);
            }
            // 刷新此缓冲的输出流
            outBuff.flush();
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return null;
        } finally {
            // 关闭流
            if (inBuff != null) {
                try {
                    inBuff.close();
                } catch (Exception ex) {
                    log.error(ex.getMessage(), ex);
                }
            }
                
            if (outBuff != null) {
                try {
                    outBuff.close();
                } catch (Exception ex) {
                    log.error(ex.getMessage(), ex);
                }
            }
                
        }
        
        return targetFile;
        
    }
 
 private static String genFileName(String qqNumber) {
     
     String fileName = "music_";
     
     fileName += qqNumber + "_";
     String timeStr = System.currentTimeMillis() + "";
     
     if (timeStr.length() > 5) {
         timeStr = timeStr.substring(timeStr.length() - 5);
     }
     
     fileName += timeStr;
     
     return fileName;
     
 }
    
    
}
