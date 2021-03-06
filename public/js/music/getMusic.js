﻿
var yabe = yabe || {};

((function ($, window) {


     yabe.LoadingMusic = {};
    yabe.LoadingMusic = yabe.LoadingMusic || {};
    var LoadingMusic = yabe.LoadingMusic;

    LoadingMusic.init = LoadingMusic.init || {};
    LoadingMusic.init = $.extend({
        doInit: function(container) {
            var playlist=[];
            var ulObj = container.find(".my-music-ul");

            var songinfo = container.find(".search-info").val();
            var paramData = {};
            paramData.songinfo = songinfo;

            /*
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

                    ulObj.html("");
                    if (musicJsonArray === undefined || musicJsonArray == null || musicJsonArray.length <= 0) {
                        var trHtml = '' +
                            '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;color:red;">' +
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

                    var liObjs = $("#myMusicLiTmpl").tmpl(musicJsonArray);

                    ulObj.html(liObjs);

                    var width = ulObj.width();
                    LoadingMusic.show.showRecStyle(ulObj,width);
                    ulObj.show();

                    LoadingMusic.show.doShowUser(userJsonArray);

                    yabe.MusicControl.control.staticEvent(container,playlist);

                }
            });
                 */

            container.find("#paging-div").tmpage({
                currPage: 1,
                pageSize: 10,
                pageCount: 1,
                ajax: {
                    on: true,
                    param: paramData,
                    dataType: 'json',
                    url: '/MusicAdmin/queryMusic',
                    callback: function(dataJson){
                        if(dataJson.isOk==false){
                            alert(dataJson.msg);
                            return;
                        }

                        var musicJsonArray = dataJson.res;
                        playlist =  musicJsonArray.slice(0);

                        ulObj.html("");
                        if (musicJsonArray === undefined || musicJsonArray == null || musicJsonArray.length <= 0) {
                            var trHtml = '' +
                                '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;color:red;">' +
                                "亲，没有找到您要找的歌曲，您也可以上传分享哦！" +
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

                        var liObjs = $("#myMusicLiTmpl").tmpl(musicJsonArray);

                        ulObj.html(liObjs);

                        var width = ulObj.width();
                        LoadingMusic.show.showRecStyle(ulObj,width);
                        ulObj.show();

                        LoadingMusic.show.doShowUser();

                        yabe.MusicControl.control.staticEvent(container,playlist);
                    }
                }

            });



        }
    }, LoadingMusic.init);

    LoadingMusic.show = LoadingMusic.show || {};
    LoadingMusic.show = $.extend({
        showRecStyle: function(container,width){
            width = width *0.2;

            container.find(".unit").each(function(index){
                $(this).height(width);

                var marwidth =  $(this).height();
                $(this).find(".music-play-div").css({"height":marwidth,"margin-top":(0-marwidth)});
                $(this).find(".play").css({"margin-top":(marwidth/2-40)});
            });
        },
        doShowUser: function(){
            var container = $(".my-music-info");
            var songinfo = container.find(".search-info").val();
            $.ajax({
                type: 'post',
                url: '/MusicAdmin/querySharedUser',
                data: {songinfo:songinfo},
                success: function (dataJson) {

                    var userJsonArray = dataJson.res;
                    var ulObj = container.find(".share-music-user");

                    if (userJsonArray === undefined || userJsonArray == null || userJsonArray.length <= 0) {
                        var trHtml = '' +
                            '<li style="text-align: center;vertical-align: middle;font-size: 16px;padding-top: 8px;color:red;">' +
                            "暂时还没有人分享哦亲～" +
                            '</li>' +
                            '';

                        ulObj.html(trHtml);

                        return;
                    }

                    $(userJsonArray).each(function(index, userInfo){
                        var headerImage = userInfo.headerImage;
                        var imgLink = "";
                        if(headerImage == null || headerImage == ""){
                            imgLink = "/public/img/logo.jpg";
                        }else{
                            imgLink = "/UserCenter/getUserImg?userId="+userInfo.id;
                        }
                        userJsonArray[index].imgLink = imgLink;
                    });

                    var liObjs = $("#ShareMusicUserLiTmpl").tmpl(userJsonArray);
                    ulObj.html(liObjs);

                }
            });
        }
    }, LoadingMusic.show);

})(jQuery,window));

