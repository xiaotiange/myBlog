
var yabe = yabe || {};

((function ($, window) {

yabe.GroupMusic = {};
yabe.GroupMusic = yabe.GroupMusic || {};
var GroupMusic = yabe.GroupMusic;

GroupMusic.init = GroupMusic.init || {};
GroupMusic.init = $.extend({
    doInit: function(container) {

        GroupMusic.show.showTags(container);

        var tags = "";
        GroupMusic.show.showMusics(container,tags);

    }
}, GroupMusic.init);


    GroupMusic.show = GroupMusic.show || {};
    GroupMusic.show = $.extend({
        showTags: function(container){
            var ulObj = container.find(".assort-tag-ul");

            $.ajax({
                type: 'post',
                url: '/MusicListen/queryMusicTags',
                data: {},
                success: function (dataJson) {

                    var tagJsonArray = dataJson.res;

                    var liObjs = $("#groupMusicTagsLiTmpl").tmpl(tagJsonArray);

                    ulObj.html(liObjs);

                    ulObj.find('.tag-select').unbind().click(function(){
                        var tags = $(this).attr("tags");
                        $(".assort-tag-ul").find('.tag-select').removeClass("isSelect");
                        $(this).addClass("isSelect");
                        GroupMusic.show.showMusics(container,tags);
                    });

                }
            });

        },
        showMusics: function(container, tags){
            var ulObj = container.find(".my-music-ul");
            var playlist = [];

            container.find("#paging-div").tmpage({
                currPage: 1,
                pageSize: 10,
                pageCount: 1,
                ajax: {
                    on: true,
                    param: {tags: tags},
                    dataType: 'json',
                    url: '/MusicAdmin/queryChooseMusic',
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

                        yabe.MusicControl.control.staticEvent(container,playlist);
                    }
                }

            });

        }
    }, GroupMusic.show);


})(jQuery,window));
