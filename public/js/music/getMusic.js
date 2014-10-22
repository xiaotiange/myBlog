(function($){

	var playlist=[];

    var loadingMusic = function(){
        var songinfo = $(".search-info").val();

        var ulObj = $(".my-music-ul");
        var paramData = {};
        paramData.songinfo = songinfo;

        $(".paging-div").tmpage({
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

                    yabe.MusicControl.control.staticEvent(playlist);


                }
            }

        });


    }

    loadingMusic();

})(jQuery);