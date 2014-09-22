/**
 * Created with IntelliJ IDEA.
 * User: bigexibo
 * Date: 14-9-17
 * Time: 下午7:08
 * To change this template use File | Settings | File Templates.
 */


var yabe = yabe || {};
((function($, window){

    yabe.GetMusic = {};

    yabe.GetMusic = yabe.GetMusic || {};

    var GetMusic = yabe.GetMusic;

    GetMusic.init = GetMusic.init || {};
    GetMusic.init = $.extend({
        doInit: function(container){

            GetMusic.container = container;

            GetMusic.show.showMusic(container);

        },
        getContainer: function() {
            return GetMusic.container;
        }
    }, GetMusic.init);


    GetMusic.show = GetMusic.show || {};
    GetMusic.show = $.extend({
        showMusic: function(container){

            var ulObj = container.find(".my-music-ul");

            $.ajax({
                type: 'post',
                url: '/MusicAdmin/queryMusic',
                data: {},
                success: function (dataJson) {

                    if(dataJson.isOk==false){
                       alert(dataJson.msg);
                       location.href = "/ALLogin/index";
                       return;
                    }
                    var musicJsonArray = dataJson.res;

                    ulObj.html("");
                    if (musicJsonArray === undefined || musicJsonArray == null || musicJsonArray.length <= 0) {
                        var trHtml = '' +
                            '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;">' +
                            "亲还没有自己的音乐哦！去上传吧，去标记吧，去收藏吧！" +
                            '</li>' +
                            '';

                        ulObj.html(trHtml);

                        return;
                    }

                    var liObjs = $("#myMusicLiTmpl").tmpl(musicJsonArray);

                    ulObj.html(liObjs);

                }
            })

        }

    }, GetMusic.show);



})(jQuery, window));
