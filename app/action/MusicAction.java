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

import models.Music;

import org.apache.commons.lang3.StringUtils;
import org.cmc.music.myid3.id3v2.MyID3v2;
import org.cmc.music.myid3.id3v2.MyID3v2FrameText;
import org.cmc.music.myid3.id3v2.MyID3v2Read;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.id3.AbstractID3v2Frame;
import org.jaudiotagger.tag.id3.AbstractID3v2Tag;
import org.jaudiotagger.tag.id3.framebody.FrameBodyAPIC;
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
    
    public static File getMusicImgFile(Music music) {
        if (music.imgPath == null) {
          return null;
        }
        
        File file = new File(music.imgPath);
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
   /*
    public static void main(String[] args) {
        File src=new File("/home/bigexibo/下载/歌路.mp3");
        HashMap<String, String> map = getDetailInfo(src);
        System.out.println(map.get("TIT2"));
    }
    */
    
    public static File changeMusicCover(File sourceFile,String imgPath, int index,String imgName){

        String imagePath = imgPath.subSequence(0, index)+imgName;
        File targetFile = new File(imagePath);
      
        File imgFile = saveFile(sourceFile, targetFile);
      
        return imgFile;
    }
    
    public static String getMusicImage(File sourceFile,String imgpath){

        MP3File mp3file = null;
        FileOutputStream fos = null;
        String imagePath = "";
            try {
                mp3file = new MP3File(sourceFile);
                AbstractID3v2Tag tag = mp3file.getID3v2Tag();  
                if(tag == null){
                    return "";
                }
                
                AbstractID3v2Frame frame = (AbstractID3v2Frame) tag.getFrame("APIC");  
                if(frame == null){
                    return "";
                }
                
                FrameBodyAPIC body = (FrameBodyAPIC) frame.getBody();  
                byte[] imageData = body.getImageData();  
                 
                int index = imgpath.indexOf(sourceFile.getName());
                imagePath = imgpath.subSequence(0, index)+sourceFile.getName()+".jpg";

                fos = new FileOutputStream(imagePath);  
                fos.write(imageData);  
                return imagePath;
            } catch (Exception e) {              
                log.error(e.getMessage(), e);
                return "";
            }finally{
                // 关闭流
                if (fos != null) {
                    try {
                        fos.close();
                    } catch (Exception ex) {
                        log.error(ex.getMessage(), ex);
                    }
                }
            }
    
              
    }
    public static HashMap getMusicInfo(File sourceFile){
       
        MP3File mp3file = null;
        HashMap<String, String> map = new HashMap<String,String>();
        try {
            mp3file = new MP3File(sourceFile);
            AbstractID3v2Tag tag = mp3file.getID3v2Tag();  
            
            if(tag == null){
                log.error("can not get music cover info!!!");
                return null;
            }
            String[] tagArray = {"TPE1","TALB","TIT2","TYER"};
            for(String tagStr : tagArray){
                AbstractID3v2Frame text =  (AbstractID3v2Frame) tag.getFrame(tagStr);
                if(text == null){
                    map.put(tagStr, null);
                }else{
                    map.put(tagStr, text.getContent());
                }
            }

            return map;
        } catch (IOException e) {              
            log.error(e.getMessage(), e);
            return null;
        } catch (TagException e) {
            log.error(e.getMessage(), e);
            return null;
        } catch (ReadOnlyFileException e) {
            log.error(e.getMessage(), e);
            return null;
        } catch (InvalidAudioFrameException e) {
            log.error(e.getMessage(), e);
            return null;
        }

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
    
private static File saveFile(File file, File targetFile) {
             
        InputStream inBuff = null;
        OutputStream outBuff = null;
        try {
            // 新建文件输入流并对它进行缓冲
            inBuff = new BufferedInputStream(new FileInputStream(file));

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
 private static File copyToFolder(File folder,File musicFile, String username) {
        
        
        File targetFile = new File(folder, genFileName(username));
        
        while (targetFile.exists()) {
            targetFile = new File(folder, genFileName(username)
                    + "_" + new Random().nextInt(100000));
        }
        
        targetFile = saveFile(musicFile, targetFile);
        
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
