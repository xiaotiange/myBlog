function isValidMail(mail) {
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return (filter.test(mail));
}
var yabe = yabe || {};

yabe.Util =  yabe.Util || {};
yabe.Util.isValidMail = isValidMail;

((function($, window){

    yabe.LoginRegister = {};

    yabe.LoginRegister = yabe.LoginRegister || {};

    var LoginRegister = yabe.LoginRegister;

    LoginRegister.init = LoginRegister.init || {};
    LoginRegister.init = $.extend({
        doInit: function(container){
           /*
           container.find(".to-login-btn").unbind().click(function(){
               LoginRegister.submit.toLogin();
           });
             */
            LoginRegister.event.setStaticEvent();
        }
    }, LoginRegister.init);

    LoginRegister.event = LoginRegister.event || {};
    LoginRegister.event = $.extend({
        setStaticEvent: function() {
            var l_container = $('.login-container');
            var r_container = $('.reg-container');

            $('#register-container').on('show.bs.modal', function () {
                r_container.find("input").unbind().keydown(function(event) {
                    if (event.keyCode == 13) {//按回车
                        LoginRegister.submit.doRegsubmit(r_container);
                    }
                });

                r_container.find(".reg-submit").unbind().click(function(){
                    LoginRegister.submit.doRegsubmit(r_container);
                });
            })

            $('#login-container').on('show.bs.modal', function () {
                l_container.find("input").unbind().keydown(function(event) {
                    if (event.keyCode == 13) {//按回车
                        LoginRegister.submit.doLoginsubmit(l_container);
                    }
                });

                l_container.find(".login-submit").unbind().click(function(){
                    LoginRegister.submit.doLoginsubmit(l_container);
                });
            })

        }
    }, LoginRegister.event);

    LoginRegister.submit = LoginRegister.submit || {};
    LoginRegister.submit = $.extend({
        doLoginsubmit: function(container){

            var param =  LoginRegister.submit.getloginParameter(container);
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

                    container.find(".close").click();
                    location.reload();
                }
            })


        },
        doRegsubmit: function(container){

            var param =  LoginRegister.submit.getRegParameter(container);
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
                    container.find(".close").click();
                    location.href = '/Application/index';

                }
            })

        },
        getloginParameter: function(container){

            var username = container.find(".username").val();
            var password = container.find(".password").val();

            var param = {};

            if(username.trim() == ""){
                alert("请输入用户名！");
                return null;
            }

            if(password.trim() == ""){
                alert("请输入密码！");
                return null;
            }

            param.username = username.trim();
            param.password = password.trim();

            return param;
        },
        getRegParameter: function(container){
            var username = container.find(".username").val();
            var password = container.find(".password").val();
            var password1 = container.find(".password1").val();
            var email = container.find(".email").val();

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

            param.username = username.trim();
            param.password = password.trim();
            param.email = email.trim();
            return param;

        }


    }, LoginRegister.submit);


})(jQuery, window));
