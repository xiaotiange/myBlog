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

            alert("ok");

            ShowInfo.container = container;

            container.find(".submit").unbind().click(function(){
                ShowInfo.show.dosubmit(container, postId);
            });


        },
        getContainer: function() {
            return ShowInfo.container;
        }
    }, ShowInfo.init);

    ShowInfo.submit = ShowInfo.submit || {};
    ShowInfo.submit = $.extend({
        dosubmit: function(container, postId){

            var param =  ShowInfo.submit.getParameter();
            param.postId = postId;

            $.ajax({
                type: 'post',
                url: '/Application/postComment',
                data: param,
                success: function (dataJson) {

                    if(dataJson.isOk == false){
                        alert(dataJson.msg);
                    }
                    alert(dataJson.msg);

                    window.location.onload;
                }
            })

        },
        getParameter: function(){

            var container = ShowInfo.init.getContainer();
            var author = container.find(".author").val();
            var content = container.find(".content").val();
            var code = container.find(".code").val();
            var randomID = container.find(".randomID").val();

            if(author == ""){
               alert("请输入评价人！");
                return;
            }
            if(content == ""){
               alert("请输入评价！");
                return;
            }
            if(code == ""){
               alert("请输入验证码！");
                return;
            }

            var param = {};

            param.author = author;
            param.content = content;
            param.code = code;
            param.randomID =randomID;

            return param;

        }

    }, ShowInfo.submit);




})(jQuery, window));
