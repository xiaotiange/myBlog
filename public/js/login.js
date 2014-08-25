
var yabe = yabe || {};
((function($, window){

    yabe.Login = {};

    yabe.Login = yabe.Login || {};

    var Login = yabe.Login;

    Login.init = Login.init || {};
    Login.init = $.extend({
        doInit: function(container){

            Login.container = container;

            Login.event.setStaticEvent(container);

        },
        getContainer: function() {
            return Login.container;
        }
    }, Login.init);

    Login.event = Login.event || {};
    Login.event = $.extend({
        setStaticEvent: function(container){

            container.find(".username").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Login.submit.dosubmit(container);
                }
            });

            container.find(".password").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Login.submit.dosubmit(container);
                }
            });

            container.find(".captcha").unbind().click(function(){
                Login.show.showNewCaotcha(container);
            });

            container.find(".code").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Login.submit.dosubmit(container);
                }
            });

            container.find(".submit").unbind().click(function(){
                Login.submit.dosubmit(container);
            });

        }

    }, Login.event);

    Login.show = Login.show || {};
    Login.show = $.extend({
        showNewCaotcha: function(container){
            var randomID = Math.uuid();
            container.find(".randomID").val(randomID);
            container.find(".captcha").attr("src","/Application/captcha?id="+randomID);
        }

    }, Login.show);

    Login.submit = Login.submit || {};
    Login.submit = $.extend({
        dosubmit: function(container){

            var param =  Login.submit.getParameter();
            if(param==null){
                return;
            }

            $.ajax({
                type: 'post',
                url: '/ALLogin/doLogin',
                data: param,
                success: function (dataJson) {

                    if(dataJson.isOk == false){
                         alert(dataJson.msg);
                         return;
                    }

                    location.href = '/Application/index';

                }
            })

        },
        getParameter: function(){

            var container = Login.init.getContainer();
            var username = container.find(".username").val();
            var password = container.find(".password").val();
            var code = container.find(".code").val();
            var randomID = container.find(".randomID").val();

            var param = {};

            if(username.trim() == ""){
                alert("请输入用户名！");
                return null;
            }


            if(password.trim() == ""){
                alert("请输入密码！");
                return null;
            }

            if(code.trim() == ""){
                alert("请输入验证码！");
                return null;
            }

            param.username = username.trim();
            param.password = password.trim();
            param.code = code.trim();
            param.randomID =randomID.trim();

            return param;

        }

    }, Login.submit);




})(jQuery, window));
