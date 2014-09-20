package controllers;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.io.UnsupportedEncodingException;


public class ReadMedia {
	RandomAccessFile randomAccessFile=null;
	static byte[] buffer = new byte[128];
	
	   public static void main(String[] args) throws Exception {
	       File MP3FILE = new File("/home/bigexibo/下载/photo/Music/Media/Good Time.mp3");
	        try {
	            ReadMedia info = new ReadMedia(MP3FILE);

	            System.out.println(info.getSongName());
	            System.out.println(info.getArtist());
	            System.out.println(info.getAlbum());
	            System.out.println(info.getYear());
	            System.out.println(info.getComment());
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
	    }
	
	public ReadMedia(File filename) throws Exception{
		randomAccessFile = new RandomAccessFile(filename,"r");
        randomAccessFile.seek(randomAccessFile.length() - 128);
        randomAccessFile.read(buffer);
        if (buffer.length == 128) {
            String tag = new String(buffer, 0, 3,"utf-8");
           System.out.println("tag is:"+tag);
        }
        
        this.songName = new String(buffer, 3, 30,"GB2312").trim();
        this.artist = new String(buffer, 33, 30,"utf-8").trim();
        this.album = new String(buffer, 63, 30,"utf-8").trim();
        this.comment = new String(buffer, 97, 28,"utf-8").trim();
        
        
        
	}
	private final String TAG = "TAG"; // 文件头1-3  
	  
	private String songName; // 歌曲名4-33  
	  
	private String artist; // 歌手名34-63  
	  
	private String album; // 专辑名61-93  
	  
	private String year; // 年94-97  
	  
	private String comment; // 备注98-125  
	  
	private byte r1, r2, r3; // 三个保留位126，127，128  
	  
	private boolean valid; // 是否合法  
	  
	public transient String fileName; // 此歌曲对应的文件名,没有封装  
	
	
	public String getSongName() throws UnsupportedEncodingException{
	
		return songName;
	}
	
	public String getArtist(){
		return artist;
	}
	
	public String getAlbum() throws UnsupportedEncodingException{
		return album;
	}
	
	public String getYear() throws UnsupportedEncodingException{
		return new String(buffer, 93, 4,"utf-8").trim();
	}
	
	public String getComment() throws UnsupportedEncodingException{
		return comment;
	}
}
