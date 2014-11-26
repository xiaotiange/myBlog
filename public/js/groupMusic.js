(function($){
    // Settings
    var playlist=[];

    var param = {};
    var loadingTags = function(){
        var ulObj = $(".assort-tag-ul");

        $.ajax({
            type: 'post',
            url: '/MusicListen/queryMusicTags',
            data: param,
            success: function (dataJson) {

                var tagJsonArray = dataJson.res;

                var liObjs = $("#groupMusicTagsLiTmpl").tmpl(tagJsonArray);

                ulObj.html(liObjs);

            }
        });

    }

    var loadingMusic = function(){
        var ulObj = $(".my-music-ul");

        $.ajax({
            type: 'post',
            url: '/MusicAdmin/queryChooseMusic',
            data: param,
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
                        '<li style="text-align: center;background:rgba(255,255,255,0.25);vertical-align: middle;font-size: 16px;padding-top: 8px;">' +
                        "亲还没有自己的音乐哦！去上传吧，去标记吧，去收藏吧！" +
                        '</li>' +
                        '';

                    ulObj.html(trHtml);

                    return;
                }

                $(musicJsonArray).each(function(index, item) {
                    if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                        item.imgPath = "/public/img/logo.jpg";
                    }else{
                        item.imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                    }

                });

                var liObjs = $("#groupMusicLiTmpl").tmpl(musicJsonArray);

                ulObj.html(liObjs);

                $('.tag-select').unbind().click(function(){
                    var tags = $(this).attr("tags");
                    param.tags = tags;
                    $(".assort-tag-ul").find('.tag-select').removeClass("isSelect");
                    $(this).addClass("isSelect");

                    loadingMusic();
                });

                var container = $(".grout-music-container");
                yabe.MusicControl.control.staticEvent(container,playlist);

            }
        });

    }

    loadingTags();
    param.tags = "";
    loadingMusic();



})(jQuery);