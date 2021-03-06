
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

            container.find("#paging-div").tmpage({
                currPage: 1,
                pageSize: 10,
                pageCount: 1,
                ajax: {
                    on: true,
                    param: {},
                    dataType: 'json',
                    url: '/MusicListen/queryListenMusic',
                    callback: function(dataJson){
                        if(dataJson.isOk==false){
                            alert(dataJson.msg);
                            return;
                        }

                        var musicJsonArray = dataJson.res;
                        playlist =  musicJsonArray.slice(0);

                        firstObj.html("");
                        if (musicJsonArray === undefined || musicJsonArray == null || musicJsonArray.length <= 0) {
                            var trHtml = '' +
                                '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;color:red;">' +
                                "现在暂时还没有音乐，亲可以试试第一个上传哦！" +
                                '</li>' +
                                '';

                            firstObj.html(trHtml);

                            return;
                        }

                        $(musicJsonArray).each(function(index, item) {
                            if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                                item.imgPath = "/public/img/logo.jpg";
                            }else{
                                item.imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                            }
                        });

                        var firstliObjs = $("#firstMusicLiTmpl").tmpl(musicJsonArray);

                        firstObj.html(firstliObjs);

                        var secondObj = container.find(".second-div-ul");
                        var secondliObjs = $("#secondMusicLiTmpl").tmpl(musicJsonArray);
                        secondObj.html(secondliObjs);


                        yabe.MusicControl.control.staticEvent(container,playlist);
                    }
                }

            });


        }
    }, ToListen.init);


})(jQuery,window));

