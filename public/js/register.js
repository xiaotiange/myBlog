function isValidMail(mail) {
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return (filter.test(mail));
}

var yabe = yabe || {};

yabe.Util =  yabe.Util || {};
yabe.Util.isValidMail = isValidMail;
((function($, window){

    yabe.Register = {};

    yabe.Register = yabe.Register || {};

    var Register = yabe.Register;

    Register.init = Register.init || {};
    Register.init = $.extend({
        doInit: function(container){

            Register.container = container;

            Register.event.setStaticEvent(container);

        },
        getContainer: function() {
            return Register.container;
        }
    }, Register.init);

    Register.event = Register.event || {};
    Register.event = $.extend({
        setStaticEvent: function(container){

            container.find(".username").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Register.submit.dosubmit(container);
                }
            });

            container.find(".password").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Register.submit.dosubmit(container);
                }
            });

            container.find(".password1").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Register.submit.dosubmit(container);
                }
            });

            container.find(".email").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Register.submit.dosubmit(container);
                }
            });

            container.find(".captcha").unbind().click(function(){
                Register.show.showNewCaotcha(container);
            });

            container.find(".code").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    Register.submit.dosubmit(container);
                }
            });

            container.find(".submit").unbind().click(function(){
                Register.submit.dosubmit(container);
            });

        }

    }, Register.event);

    Register.show = Register.show || {};
    Register.show = $.extend({
        showNewCaotcha: function(container){
            var randomID = Math.uuid();
            container.find(".randomID").val(randomID);
            container.find(".captcha").attr("src","/Application/captcha?id="+randomID);
        }

    }, Register.show);

    Register.submit = Register.submit || {};
    Register.submit = $.extend({
        dosubmit: function(container){

            var param =  Register.submit.getParameter();
            if(param==null){
               return;
            }

            $.ajax({
                type: 'post',
                url: '/ALLogin/doRegister',
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

            var container = Register.init.getContainer();
            var username = container.find(".username").val();
            var password = container.find(".password").val();
            var password1 = container.find(".password1").val();
            var email = container.find(".email").val();
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

            if(password1.trim() != password.trim()){
                alert("输入两次密码不同！");
                return null;
            }

            if(email.trim() == ""){
                alert("请输入邮箱！");
                return null;
            }
            if(!yabe.Util.isValidMail(email)){
                alert("请输入合法的邮箱！");
                return null;
            }

            if(code.trim() == ""){
                alert("请输入验证码！");
                return null;
            }

            param.username = username.trim();
            param.password = password.trim();
            param.code = code.trim();
            param.email = email.trim();
            param.randomID =randomID.trim();

            return param;

        }

    }, Register.submit);




})(jQuery, window));
