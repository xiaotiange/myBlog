
var yabe = yabe || {};
((function($, window){

    yabe.Login = {};

    yabe.Login = yabe.Login || {};

    var Login = yabe.Login;

    Login.init = Login.init || {};
    Login.init = $.extend({
        doInit: function(container){

            Login.container = container;

            container.find(".author").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Login.submit.dosubmit(container, postId);
                }
            });

            container.find(".content").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Login.submit.dosubmit(container, postId);
                }
            });

            container.find(".img").unbind().click(function(){
                Login.show.showNewCaotcha(container);
            });

            container.find(".code").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Login.submit.dosubmit(container, postId);
                }
            });

            container.find(".submit").unbind().click(function(){
                Login.submit.dosubmit(container, postId);
            });

        },
        getContainer: function() {
            return Login.container;
        }
    }, Login.init);

    Login.show = Login.show || {};
    Login.show = $.extend({


    }, Login.show);

    Login.submit = Login.submit || {};
    Login.submit = $.extend({
        dosubmit: function(container, postId){

            var param =  Login.submit.getParameter();
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

            var container = Login.init.getContainer();
            var author = container.find(".author").val();
            var content = container.find(".content").val();
            var code = container.find(".code").val();
            var randomID = container.find(".randomID").val();

            var param = {};

            if(author.trim() == ""){
                container.find(".author-blank").addClass("red");
                container.find(".author-blank").html("请输入评价人！");
                return;
            }
            container.find(".author-blank").html("");

            if(code.trim() == ""){
                container.find(".code-blank").addClass("red");
                container.find(".code-blank").html("请输入评价！");
                return;
            }
            container.find(".code-blank").html("");

            if(code.trim() == ""){
                container.find(".code-blank").addClass("red");
                container.find(".code-blank").html("请输入验证码！");
                return;
            }
            container.find(".code-blank").html("");

            param.author = author;
            param.content = content;
            param.code = code;
            param.randomID =randomID;

            return param;

        }

    }, Login.submit);




})(jQuery, window));
