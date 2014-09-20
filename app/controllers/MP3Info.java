package controllers;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.io.UnsupportedEncodingException;


/**
 * ���MP3�ļ�����Ϣ
 * 
 */
public class MP3Info {
	
	public static void main(String[] args) {

		
		try {  
		    File file = new File("/home/bigexibo/下载/music/mp3/Good Time.mp3");
              
          
            String songName=file.getID3v2Tag().frameMap.get("TIT2").toString();  
            String singer=file.getID3v2Tag().frameMap.get("TPE1").toString();  
            String author=file.getID3v2Tag().frameMap.get("TALB").toString();  
            System.out.println(new String(songName.getBytes("ISO-8859-1"),"GB2312"));  
            System.out.println(new String(singer.getBytes("ISO-8859-1"),"GB2312"));  
            System.out.println(new String(author.getBytes("ISO-8859-1"),"GB2312"));  
        } catch (IOException e) {  
            e.printStackTrace();  
        } catch (TagException e) {  
            e.printStackTrace();  
        } catch (ReadOnlyFileException e) {  
            e.printStackTrace();  
        } catch (InvalidAudioFrameException e) {  
            e.printStackTrace();  
        } 
		}
		
	}
	
	
}
