
var Ali = Ali || {};

$(document).ready(function() {
    Ali.UserLoginInfo.init.doInit();
});

((function ($, window) {


    Ali.UserLoginInfo = {};
    Ali.UserLoginInfo = Ali.UserLoginInfo || {};
    var UserLoginInfo = Ali.UserLoginInfo;

    UserLoginInfo.init = UserLoginInfo.init || {};
    UserLoginInfo.init = $.extend({
        doInit: function() {

            var container = $('.user-nav');

            $.ajax({
                url : "/AllUser/getUser",
                global:false,
                type : 'post',
                success : function(dataJson) {

                    var isLogined = dataJson.isOk;
                    var userJson = dataJson.res;

                    if (isLogined == true) {
                        container.find('.not-login').remove();
                        container.find('.has-login').show();

                        var userName = userJson.email;

                        container.find('.has-login .user-name').html(userName);
                        //UserLoginInfo.show.showLogin(container);
                    } else {
                        container.find('.not-login').show();
                        container.find('.has-login').remove();
                    }

                }
            });
        }
    }, UserLoginInfo.init);

    UserLoginInfo.show = UserLoginInfo.show || {};
    UserLoginInfo.show = $.extend({
        showLogin: function(container) {

            var loginObj = container.find(".has-login");
            var uinfo=loginObj.find(".user-hidden-info");
            loginObj.hover(function(){
                uinfo.show();
            },function(){
                uinfo.hide();
            });
        }


    }, UserLoginInfo.show);

})(jQuery,window));


