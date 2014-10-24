
var yabe = yabe || {};

((function ($, window) {


    yabe.ToListen = {};
    yabe.ToListen = yabe.ToListen || {};
    var ToListen = yabe.ToListen;

    ToListen.init = ToListen.init || {};
    ToListen.init = $.extend({
        doInit: function(container) {
            var playlist=[];

            var firstObj = container.find(".first-div-ul");
            var secondObj = container.find(".second-div-ul");

            var paramData = {};
            paramData.songinfo = "";

            $.ajax({
                type: 'post',
                url: '/MusicAdmin/queryMusic',
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
                            "现在暂时还没有音乐，亲可以试试第一个上传哦！" +
                            '</li>' +
                            '';

                        firstObj.html(trHtml);

                        return;
                    }

                    var firstliObjs = $("#firstMusicLiTmpl").tmpl(musicJsonArray);


                    $(musicJsonArray).each(function(index, item) {
                        if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                            item.imgPath = "/public/img/logo.jpg";
                        }else{
                            item.imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                        }

                    });

                    var secondliObjs = $("#secondMusicLiTmpl").tmpl(musicJsonArray);

                    firstObj.html(firstliObjs);
                    secondObj.html(secondliObjs);

                    yabe.MusicControl.control.staticEvent(playlist);

                }
            });

        }
    }, ToListen.init);

    ToListen.show = ToListen.show || {};
    ToListen.show = $.extend({
        doShowUser: function(userJsonArray){


        }
    }, ToListen.show);

})(jQuery,window));

