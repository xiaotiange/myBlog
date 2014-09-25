(function($){
    // Settings
    var playlist=[];

    var loadingMusic = function(){
        var ulObj = $(".my-music-ul");

        $.ajax({
            type: 'post',
            url: '/MusicAdmin/queryMusic',
            data: {},
            success: function (dataJson) {

                if(dataJson.isOk==false){
                    alert(dataJson.msg);
                    return;
                }
                var musicJsonArray = dataJson.res;
                playlist =  musicJsonArray.slice(0);

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

                yabe.MusicControl.control.staticEvent(playlist);

            }
        });

    }

    loadingMusic();

})(jQuery);