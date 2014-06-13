import org.junit.*;
import java.util.*;

import play.test.*;
import models.*;

public class BasicTest extends UnitTest {

    @Before
    public void setup() {
        Fixtures.deleteAll();
    }

    @Test
    public void createAndRetrieveUsert() {
        // Create a new user and save it
        new User("bob@gmail.com", "secret", "Bob").save();

        // Retrieve the user with email address bob@gmail.com
        User bob = User.find("byEmail", "bob@gmail.com").first();

        // Test
        assertNotNull(bob);
        assertEquals("Bob", bob.fullname);
        assertEquals("secret", bob.password);
    }

    @Test
    public void tryConnectAsUser() {
        // Create a new User and save it
        new User("bob@gmail.com", "secret", "Bob").save();

        // Test
        assertNotNull(User.connect("bob@gmail.com", "secret"));
        assertNull(User.connect("bob@gmail.com", "password"));
        assertNull(User.connect("tom@gmail.com", "secret"));
    }

    @Test
    public void createPost() {
        // create a new user and save it
        User bob = new User("bob@gmail.com", "secret", "Bob").save();

        // create a new Post and save it
        Post post = new Post(bob, "My first Post", "Hello word").save();

        // Test that the Post has been created
        assertEquals(1, Post.count());

        // Retrieve all Post created by bob
        List<Post> bobPosts = Post.find("byAuthor", bob).fetch();

        // Test
        assertEquals(1, bobPosts.size());
        Post firstPost = bobPosts.get(0);
        assertNotNull(firstPost);
        assertEquals(firstPost.title, "My first Post");
        assertEquals(firstPost.author, bob);
        assertNotNull(firstPost.postedAt);
    }

    @Test
    public void postComments() {

        // Create a new user and save it
        User bob = new User("bob@gmail.com", "secret", "Bob").save();
        // Create a new post
        Post bobPost = new Post(bob, "My first post", "Hello world").save();

        // Post a first comment
        new Comment(bobPost, "Jeff", "Nice post").save();
        new Comment(bobPost, "Tom", "I knew that !").save();

        // Retrieve all comments
        List<Comment> bobPostComments = Comment.find("byPost", bobPost).fetch();

        // Tests
        assertEquals(2, bobPostComments.size());
        Comment firstComment = bobPostComments.get(0);
        assertNotNull(firstComment);
        assertEquals("Jeff", firstComment.author);
        assertEquals("Nice post", firstComment.content);
        assertNotNull(firstComment.postedAt);
        Comment secondComment = bobPostComments.get(1);
        assertNotNull(secondComment);
        assertEquals("Tom", secondComment.author);
        assertEquals("I knew that !", secondComment.content);
        assertNotNull(secondComment.postedAt);
    }

    @Test
    public void useTheCommentsRelation() {
        // create a new user and save it
        User bob = new User("bob@gmail.com", "secret", "Bob").save();

        // create a Post
        Post post = new Post(bob, "My First Post", "Hello World!").save();

        // post a comment
        post.addComment("Tom", "fine comment");
        post.addComment("Lucy", "I know it");

        // count these
        assertEquals(1, User.count());
        assertEquals(1, Post.count());
        assertEquals(2, Comment.count());

        // test
        post = Post.find("byAuthor", bob).first();
        assertNotNull(post);

        assertEquals("Tom", post.comments.get(0).author);
        assertEquals(2, post.comments.size());

        // delete the post
        post.delete();

        // check all the comments has deleted
        assertEquals(1, User.count());
        assertEquals(0, Post.count());
        assertEquals(0, Comment.count());
    }

    @Test
    public void fullTest() {
        Fixtures.load("data.yml");
        
        // Count things
        assertEquals(2, User.count());
        assertEquals(3, Post.count());
        assertEquals(3, Comment.count());
        
        // Try to connect as users
        assertNotNull(User.connect("bob@gmail.com", "secret"));
        assertNotNull(User.connect("jeff@gmail.com", "secret"));
        assertNull(User.connect("jeff@gmail.com", "badpassword"));
        assertNull(User.connect("tom@gmail.com", "secret"));
        
        // Find all of Bob's posts
        List<Post> bobPosts = Post.find("author.email", "bob@gmail.com").fetch();
        assertEquals(2, bobPosts.size());
        
        // Find all comments related to Bob's posts
        List<Comment> bobComments = Comment.find("post.author.email","bob@gmail.com").fetch();
        assertEquals(3, bobComments.size());
        
        // Find the most recent post
        Post frontPost = Post.find("order by postedAt desc").first();
        assertNotNull(frontPost);
        assertEquals("About the model layer", frontPost.title);
        
        // Check that this post has two comments
        assertEquals(2, frontPost.comments.size());
        
        // Post a new comment
        frontPost.addComment("Jim", "Hello guys");
        assertEquals(3, frontPost.comments.size());
        assertEquals(4, Comment.count());
    }
    
    @Test
    public void testTags() {
        // Create a new user and save it
        User bob = new User("bob@gmail.com", "secret", "Bob").save();
     
        // Create a new post
        Post bobPost = new Post(bob, "My first post", "Hello world").save();
        Post anotherBobPost = new Post(bob, "Hop", "Hello world").save();
     
        // Well
        assertEquals(0, Post.findTaggedWith("Red").size());
     
        // Tag it now
        bobPost.tagItWith("Red").tagItWith("Blue").save();
        anotherBobPost.tagItWith("Red").tagItWith("Green").save();
     
        // Check
        assertEquals(2, Post.findTaggedWith("Red").size());
        assertEquals(1, Post.findTaggedWith("Blue").size());
        assertEquals(1, Post.findTaggedWith("Green").size());
        
        assertEquals(1, Post.findTaggedWith("Red", "Blue").size());
        assertEquals(1, Post.findTaggedWith("Red", "Green").size());
        assertEquals(0, Post.findTaggedWith("Red", "Green", "Blue").size());
        assertEquals(0, Post.findTaggedWith("Green", "Blue").size());
        
        List<Map> cloud = Tag.getCloud();
        assertEquals(
        "[{tag=Blue, pound=1}, {tag=Green, pound=1}, {tag=Red, pound=2}]",
        cloud.toString()
        );
    
    }

}
