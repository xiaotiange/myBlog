
var yabe = yabe || {};

((function ($, window) {


    yabe.HeartMusic = {};
    yabe.HeartMusic = yabe.HeartMusic || {};
    var HeartMusic = yabe.HeartMusic;

    HeartMusic.init = HeartMusic.init || {};
    HeartMusic.init = $.extend({
        doInit: function(container) {
            var playlist=[];

            var firstObj = container.find(".first-div-ul");
            var secondObj = container.find(".second-div-ul");

            var paramData = {};
            paramData.songinfo = "";

            $.ajax({
                type: 'post',
                url: '/LogAdmin/doSearchMyHeartMusic',
                data: paramData,
                success: function (dataJson) {

                    if(dataJson.isOk==false){
                        alert(dataJson.msg);
                        return;
                    }

                    var myMusicJsonArray = dataJson.res[0];
                    var popularMusicJsonArray = dataJson.res[1];

                    playlist =  myMusicJsonArray.slice(0);

                    firstObj.html("");
                    secondObj.html("");

                    if (myMusicJsonArray === undefined || myMusicJsonArray == null || myMusicJsonArray.length <= 0) {
                        var trHtml = '' +
                            '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;color:red;">' +
                            "亲还没有收藏过音乐，先去收藏吧！" +
                            '</li>' +
                            '';

                        firstObj.html(trHtml);

                    }else{
                        var firstliObjs = $("#firstMusicLiTmpl").tmpl(myMusicJsonArray);
                        firstObj.html(firstliObjs);
                    }



                    $(popularMusicJsonArray).each(function(index, item) {


                        if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                            popularMusicJsonArray[index].imgPath= "/public/img/logo.jpg";
                        }else{
                            popularMusicJsonArray[index].imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                        }


                    });

                    var secondliObjs = $("#secondMusicLiTmpl").tmpl(popularMusicJsonArray);


                    secondObj.html(secondliObjs);

                    yabe.MusicControl.control.staticEvent(playlist);

                }
            });

        }
    }, HeartMusic.init);


})(jQuery,window));

