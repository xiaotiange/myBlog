
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

                        var userName = userJson.fullname;
                        var headerimg = userJson.headerImage;
                        container.find('.has-login .user-name').html(userName);

                        if(headerimg === undefined || headerimg=="" || headerimg==null){
                            $(".user-head-photo").attr("src","/public/img/logo.jpg");
                        }else{
                          $(".user-head-photo").attr("/UserCenter/getUserImg?userId="+userJson.id);
                        }
                        UserLoginInfo.show.doshow();
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
        doshow: function() {
            var container = $(".header");
            var usertable=container.find(".user-nav");
            var user = container.find(".exit-btn");

            usertable.hover(function(){
                user.show();
            },function(){
                user.hide();

            });

        }
    }, UserLoginInfo.show);

})(jQuery,window));


