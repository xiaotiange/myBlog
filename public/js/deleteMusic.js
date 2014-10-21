var yabe = yabe || {};

yabe.Util =  yabe.Util || {};
yabe.Util.isValidMail = isValidMail;

((function($, window){

    yabe.DeleteMusic = {};

    yabe.DeleteMusic = yabe.DeleteMusic || {};

    var DeleteMusic = yabe.DeleteMusic;

    DeleteMusic.init = DeleteMusic.init || {};
    DeleteMusic.init = $.extend({
        doInit: function(container){

            var ulObj = container.find(".my-music-ul");

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

                    $(musicJsonArray).each(function(index, item) {
                        if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                            item.imgPath = "/public/img/logo.png";
                        }else{
                            item.imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                        }

                    });

                    var liObjs = $("#myMusicLiTmpl").tmpl(musicJsonArray);

                    ulObj.html(liObjs);

                    DeleteMusic.Event.setStaticEvent(container);

                }
            });

        }
    }, DeleteMusic.init);


    DeleteMusic.Event = DeleteMusic.Event || {};
    DeleteMusic.Event = $.extend({
        setStaticEvent:function(container){

            $(".img-div").unbind().hover(function(){
                    var parent = $(this).parent();
                    parent.find(".music-play-div").show();
                },
                function(){
                    var parent = $(this).parent();
                    parent.find(".music-play-div").hide();

                });


            container.find(".remove-btn").unbind().click(function(){
                var musicId = $(this).attr("musicId");
                DeleteMusic.Submit.doDeleteSubmit(musicId);

            });

        }
    }, DeleteMusic.Event);

    DeleteMusic.Submit = DeleteMusic.Submit || {};
    DeleteMusic.Submit = $.extend({
        doDeleteSubmit:function(id){
            var musicId = id;
            if(!confirm("确定删除该歌曲？")){
                return;
            }

            $.ajax({
                type: 'post',
                url: '/MusicAdmin/doDeleteMusic',
                data: {musicId:musicId},
                success: function (dataJson) {
                    if(dataJson.isOk==false){
                        alert(dataJson.msg);
                        return;
                    }
                    alert(dataJson.msg);
                    window.location.reload();
                }
            });

        }
    }, DeleteMusic.Submit);


})(jQuery, window));