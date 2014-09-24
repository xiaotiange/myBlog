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

           container.find(".to-my-home").unbind().click(function(){
               $.ajax({
                   type: 'post',
                   url: '/AllUser/getUser',
                   data: {},
                   success: function (dataJson) {

                       var isOk = dataJson.isOk;

                       if(isOk==false){
                           LoginRegister.submit.toLogin();
                           return;
                       }
                       location.href = "/MusicAdmin/myHouse"
                   }
               })
           });
            container.find(".to-login-btn").unbind().click(function(){
                LoginRegister.submit.toLogin();
            });

        }
    }, LoginRegister.init);



    LoginRegister.submit = LoginRegister.submit || {};
    LoginRegister.submit = $.extend({
        toLogin: function(){

            $('.login-dialog-body').remove();

            var dialogHtml = '' +
                ' <div class="login-dialog-body dialog-body">'+
                '<div class="left-div">'+
                '<table border="0" class="dialog-table login-dialog-table" cellspacing="0" width="100%"> '+
                '  <tbody> '+
                '      <tr>  '+
                '         <td> '+
                '              <span class="red error-tip glyphicon glyphicon-remove" style="display: none;"></span> '+
                '          </td>   '+
                '     </tr> '+
                '      <tr>  '+
                '         <td> '+
                '          <input type="text" class="username" name="username" size="30"  placeholder="请输入用户名" > '+
                '              <span class="login-icon glyphicon glyphicon-user">|</span> '+
                '          </td>   '+
                '     </tr> '+
                '   <tr> '+
                '      <td>  '+
                '          <input type="password" class="password" name="password" size="30"  placeholder="请输入密码" > '+
                '             <span class="login-icon glyphicon glyphicon-lock">|</span> '+
                '        </td>  '+
                '  </tr>  '+
                '    <tr> '+
                '      <td> <p class="dialog-btn green-dialog-btn login-submit">登录</p> </td>  '+
                '  </tr>  '+
                '    <tr> '+
                '       <td> <p class="dialog-btn red-dialog-btn to-reg-btn" >立即注册</p> </td>  '+
                '     </tr> '+
                '  </tbody> '+

                '   </table> '+
                '  </div> '+

                ' <div class="right-div">  '+
                '    <div class="right-div-body">  '+
                '         <div>还没有bingo帐号？</div>   '+
                '        <span class="green to-reg-btn" style="cursor: pointer;">立即注册</span> '+
                '        <div class="login_others">使用以下帐号直接登录:</div>  '+
                '        <a class="icon_wb" title="使用新浪微博帐号登录" target="_blank" href="http://www.lagou.com/ologin/auth/sina.html"></a> '+
                '        <a class="icon_qq" title="使用腾讯QQ帐号登录" target="_blank" href="http://www.lagou.com/ologin/auth/qq.html"></a> '+
                '    </div>  '+
                '  </div> '+
                ' </div> '+'';

            var dialogObj = $(dialogHtml);

            var submitCallback = function(container) {
                var username = container.find(".username").val();
                var password = container.find(".password").val();

                if(username.trim() == ""){
                    container.find(".error-tip").html("请输入用户名！").show();
                    return;
                }
                if(password.trim() == ""){
                    container.find(".error-tip").html("请输入密码！").show();
                    return;
                }
                var param = {};
                param.username = username.trim();
                param.password = password.trim();

                $.ajax({
                    type: 'post',
                    url: '/ALLogin/doLogin',
                    data: param,
                    success: function (dataJson) {

                        if(dataJson.isOk == false){
                            container.find(".error-tip").html(dataJson.msg).show();
                            return;
                        }

                        dialogObj.dialog('close');
                        location.href = "/MusicAdmin/myHouse"
                    }
                });

            }

            dialogObj.dialog({
                modal: true,
                bgiframe: true,
                height: 350,
                width: 650,
                title : '登录',
                autoOpen: false,
                resizable: false,
                zIndex: 6003
            });
            dialogObj.dialog('open');
            var l_container = $('.login-dialog-body');
            l_container.find("input").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    submitCallback(l_container);
                }
            });

            l_container.find(".login-submit").unbind().click(function(){
                submitCallback(l_container);
            });

            l_container.find(".to-reg-btn").unbind().click(function(){
                dialogObj.dialog('close');
                LoginRegister.submit.toRegister();
            });

        },
        toRegister: function(){

            $('.reg-dialog-body').remove();

            var dialogHtml = '' +
                '  <div class="reg-dialog-body dialog-body">                                            '+
                '  <table border="0" class="dialog-table" cellspacing="0" width="100%">       '+
                '   <tbody>                                                                   '+
                '      <tr>  '+
                '         <td> '+
                '              <span class="red error-tip glyphicon glyphicon-remove" style="display: none;"></span> '+
                '          </td>   '+
                '     </tr> '+
                '       <tr>                                                                 '+
                '           <td>                                                            '+
                '               <input type="text" class="username" name="username"  size="30"  placeholder="请输入用户名" >  '+
                '                   <span class="login-icon glyphicon glyphicon-user">|</span> '+
                '               </td>      '+
                '           </tr>         '+
                '           <tr>          '+
                '               <td>       '+
                '                   <input type="password" class="password" name="password" size="30"  placeholder="请输入密码" > '+
                '                       <span class="login-icon glyphicon glyphicon-lock">|</span>                           '+
                '                   </td>                                                                                     '+
                '               </tr>                                                                                            '+
                '               <tr>                                                                                           '+
                '                   <td>                                                                                     '+
                '                       <input type="password" class="password1" size="30"  placeholder="请再次输入密码" >     '+
                '                           <span class="login-icon glyphicon glyphicon-lock">|</span>      '+
                '                       </td>                                                             '+
                '                   </tr>                                                               '+
                '                   <tr>                                                              '+
                '                       <td>                                                        '+
                '                           <input type="text" class="email" size="30" name="email"  placeholder="请输入邮箱" >   '+
                '                               <span class="login-icon glyphicon glyphicon-envelope">|</span> '+
                '                           </td>       '+
                '                       </tr>         '+
                '                       <tr>        '+
                '                           <td>  '+
                '                               <span class="small-dialog-btn red-dialog-btn to-login-btn" >返回登录</span>        '+
                '                               <span class="small-dialog-btn green-dialog-btn reg-submit">注册</span>  '+
                '                           </td>      '+
                '                       </tr>        '+
                '                       <tr>       '+
                '                                '+
                '                       </tr>  '+
                '                   </tbody> '+
                '               </table>  '+
                '           </div>'+'';

            var dialogObj = $(dialogHtml);


            var submitCallback = function(container) {
                var username = container.find(".username").val();
                var password = container.find(".password").val();
                var password1 = container.find(".password1").val();
                var email = container.find(".email").val();
                if(username.trim() == ""){
                    container.find(".error-tip").html("请输入用户名！").show();
                    return null;
                }
                if(password.trim() == ""){
                    container.find(".error-tip").html("请输入密码！").show();
                    return null;
                }
                if(password1.trim() != password.trim()){
                    container.find(".error-tip").html("输入两次密码不同！").show();
                    return null;
                }
                if(email.trim() == ""){
                    container.find(".error-tip").html("请输入邮箱！").show();
                    return null;
                }
                if(!yabe.Util.isValidMail(email)){
                    container.find(".error-tip").html("请输入合法邮箱！").show();
                    return null;
                }

                var param = {};
                param.username = username.trim();
                param.password = password.trim();
                param.email = email.trim();

                $.ajax({
                    type: 'post',
                    url: '/ALLogin/doRegister',
                    data: param,
                    success: function (dataJson) {

                        if(dataJson.isOk == false){
                            container.find(".error-tip").html(dataJson.msg).show();
                            return;
                        }
                        dialogObj.dialog('close');
                        location.href = "/MusicAdmin/myHouse"

                    }
                })
            }

            dialogObj.dialog({
                modal: true,
                bgiframe: true,
                width: 400,
                title : '注册',
                autoOpen: false,
                resizable: false,
                zIndex: 6003
            });
            dialogObj.dialog('open');

            var r_container = $('.reg-dialog-body');

            r_container.find("input").unbind().keydown(function(event) {
                if (event.keyCode == 13) {//按回车
                    submitCallback(r_container);
                }
            });

            r_container.find(".reg-submit").unbind().click(function(){
                submitCallback(r_container);
            });

            r_container.find(".to-login-btn").unbind().click(function(){
                dialogObj.dialog('close');
                LoginRegister.submit.toLogin();
            });
        }

    }, LoginRegister.submit);


})(jQuery, window));
