
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
                    var popularMusicJsonArray = dataJson.res[1];
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

                    }else{
                        var firstliObjs = $("#firstMusicLiTmpl").tmpl(musicJsonArray);
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

                    yabe.MusicControl.control.staticEvent(container, playlist);

                }
            });

        }
    }, AddedMusic.init);


})(jQuery,window));

