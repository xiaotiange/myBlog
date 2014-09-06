/**
 * Created with IntelliJ IDEA.
 * User: bigexibo
 * Date: 14-8-22
 * Time: 下午8:58
 * To change this template use File | Settings | File Templates.
 */

var yabe = yabe || {};
((function($, window){

    yabe.ShowInfo = {};

    yabe.ShowInfo = yabe.ShowInfo || {};

    var ShowInfo = yabe.ShowInfo;


    ShowInfo.init = ShowInfo.init || {};
    ShowInfo.init = $.extend({
        doInit: function(container,postId){

            ShowInfo.container = container;

            container.find(".author").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    ShowInfo.submit.dosubmit(container, postId);
                }
            });

            container.find(".content").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    ShowInfo.submit.dosubmit(container, postId);
                }
            });

            container.find(".img").unbind().click(function(){
                ShowInfo.show.showNewCaotcha(container);
            });

            container.find(".code").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    ShowInfo.submit.dosubmit(container, postId);
                }
            });

            container.find(".submit").unbind().click(function(){
                ShowInfo.submit.dosubmit(container, postId);
            });

        },
        getContainer: function() {
            return ShowInfo.container;
        }
    }, ShowInfo.init);

    ShowInfo.show = ShowInfo.show || {};
    ShowInfo.show = $.extend({
       showNewCaotcha: function(container){
           var randomID = Math.uuid();
           container.find(".randomID").val(randomID);
           container.find(".img").attr("src","/Application/captcha?id="+randomID);
       }

    }, ShowInfo.show);

    ShowInfo.submit = ShowInfo.submit || {};
    ShowInfo.submit = $.extend({
        dosubmit: function(container, postId){

            var param =  ShowInfo.submit.getParameter();
            if(param==null){
                return;
            }

            param.postId = postId;

            $.ajax({
                type: 'post',
                url: '/Application/postComment',
                data: param,
                success: function (dataJson) {

                    if(dataJson.isOk == false){
                         alert(dataJson.msg);
                        return;
                    }
                    alert(dataJson.msg);

                    window.location.reload();
                }
            })

        },
        getParameter: function(){

            var container = ShowInfo.init.getContainer();
            var author = container.find(".author").val();
            var content = container.find(".content").val();
            var code = container.find(".code").val();
            var randomID = container.find(".randomID").val();

            var param = {};

            if(author.trim() == ""){
                container.find(".author-blank").addClass("red");
                container.find(".author-blank").html("请输入名字！");
                return null;
            }
            container.find(".author-blank").html("");

            if(content.trim() == ""){
                container.find(".content-blank").addClass("red");
                container.find(".content-blank").html("请输入评论！");
                return null;
            }
            container.find(".content-blank").html("");

            if(code.trim() == ""){
                container.find(".code-blank").addClass("red");
                container.find(".code-blank").html("请输入验证码！");
                return null;
            }
            container.find(".code-blank").html("");

            param.author = author;
            param.content = content;
            param.code = code;
            param.randomID =randomID;

            return param;

        }

    }, ShowInfo.submit);




})(jQuery, window));
