package action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Random;
import java.util.Vector;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import play.Play;




public class UserCenterAction {

    private static final Logger log = LoggerFactory.getLogger(UserCenterAction.class);
        
    private static final String ImageFolderPrefix = Play.configuration.getProperty("image.savefilepath",
            "/data/image");
    
    public static File getHeaderImage(String filePath) {
        if (StringUtils.isEmpty(filePath)) {
            return null;
        }
        
        File file = new File(filePath);
        if (file.exists() == false) {
            return null;
        }
        
        return file;
        
    }
    
    public static File saveHeaderImage(File imgFile, Long userId){
       
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
        
         imgFile = copyToFolder(folder, imgFile, userId);
         return imgFile;
    }

    private static String getAbsolutePath(String relativePath) {
        String absolutePth = "";
        if (ImageFolderPrefix.trim().endsWith("/")) {
            absolutePth = ImageFolderPrefix.trim() + relativePath;
        } else {
            absolutePth = ImageFolderPrefix.trim() + "/" + relativePath;
        }
        
        return absolutePth;
    }
    
    
 private static File copyToFolder(File folder,File imgFile, Long userId) {
        
        
        File targetFile = new File(folder, genFileName(userId));
        
        while (targetFile.exists()) {
            targetFile = new File(folder, genFileName(userId)
                    + "_" + new Random().nextInt(100000));
        }
        
        
        InputStream inBuff = null;
        OutputStream outBuff = null;
        try {
            // 新建文件输入流并对它进行缓冲
            inBuff = new BufferedInputStream(new FileInputStream(imgFile));

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
 
 private static String genFileName(Long userId) {
     
     String fileName = "imgFile_";
     
     fileName += userId + "_";
     String timeStr = System.currentTimeMillis() + "";
     
     if (timeStr.length() > 5) {
         timeStr = timeStr.substring(timeStr.length() - 5);
     }
     
     fileName += timeStr;
     
     return fileName;
     
 }
    
    
}
