
var yabe = yabe || {};

((function ($, window) {


    yabe.AddedMusic = {};
    yabe.AddedMusic = yabe.AddedMusic || {};
    var AddedMusic = yabe.AddedMusic;

    AddedMusic.init = AddedMusic.init || {};
    AddedMusic.init = $.extend({
        doInit: function(container) {
            var playlist=[];

            var firstObj = container.find(".first-div-ul");
            var secondObj = container.find(".second-div-ul");

            var paramData = {};
            paramData.songinfo = "";

            $.ajax({
                type: 'post',
                url: '/LogAdmin/queryMyAddedMusic',
                data: paramData,
                success: function (dataJson) {

                    if(dataJson.isOk==false){
                        alert(dataJson.msg);
                        return;
                    }

                    var musicJsonArray = dataJson.res[0];
                    var userJsonArray = dataJson.res[1];
                    playlist =  musicJsonArray.slice(0);

                    firstObj.html("");
                    secondObj.html("");

                    if (musicJsonArray === undefined || musicJsonArray == null || musicJsonArray.length <= 0) {
                        var trHtml = '' +
                            '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;color:red;">' +
                            "亲还没有添加过音乐，先去收藏吧！" +
                            '</li>' +
                            '';

                        firstObj.html(trHtml);
                        secondObj.html(trHtml);

                        return;
                    }

                    var firstliObjs = $("#firstMusicLiTmpl").tmpl(musicJsonArray);


                    $(musicJsonArray).each(function(index, item) {
                        if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                            item.imgPath = "/public/img/logo.jpg";
                        }else{
                            item.imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                        }

                        $(userJsonArray).each(function(index, userInfo){
                            if(item.userId == userInfo[0]){
                                item.userName = userInfo[3];
                                return false;
                            }
                        });


                    });

                    var secondliObjs = $("#secondMusicLiTmpl").tmpl(musicJsonArray);

                    firstObj.html(firstliObjs);
                    secondObj.html(secondliObjs);

                    yabe.MusicControl.control.staticEvent(playlist);

                }
            });

        }
    }, AddedMusic.init);


})(jQuery,window));

