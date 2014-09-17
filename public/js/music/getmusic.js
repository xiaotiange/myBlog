/**
 * Created with IntelliJ IDEA.
 * User: bigexibo
 * Date: 14-9-17
 * Time: 下午7:08
 * To change this template use File | Settings | File Templates.
 */


var yabe = yabe || {};
((function($, window){

    yabe.GetMusic = {};

    yabe.GetMusic = yabe.GetMusic || {};

    var GetMusic = yabe.GetMusic;

    GetMusic.init = GetMusic.init || {};
    GetMusic.init = $.extend({
        doInit: function(container){

            GetMusic.container = container;

            GetMusic.show.showMusic(container);

        },
        getContainer: function() {
            return GetMusic.container;
        },
        initAudio:function(elem) {
        var title = elem.attr('t_name');
       // var cover = elem.attr('t_cover');
        var artist = elem.attr('t_artist');

        $('.title').text(' - ' + title);
        $('.artist').text(artist);
       // $('#t_cover').html('<img src="Images/' + cover+'">');
       }
    }, GetMusic.init);


    GetMusic.show = GetMusic.show || {};
    GetMusic.show = $.extend({
        showMusic: function(container){

            var ulObj = container.find(".my-music-ul");

            $.ajax({
                type: 'post',
                url: '/MusicAdmin/queryMusic',
                data: {},
                success: function (dataJson) {

                    if(dataJson.isOk==false){
                       alert(dataJson.msg);
                       location.href = "/ALLogin/index";
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

                    var liObjs = $("#myMusicLiTmpl").tmpl(musicJsonArray);

                    ulObj.html(liObjs);

                    GetMusic.event.setStaticEvent(container);

                }
            })

        }

    }, GetMusic.show);

    GetMusic.pause = GetMusic.pause || {};
    GetMusic.pause = $.extend({
        change: function(container){
            $('#pause').addClass('hidden');
            $('#play').removeClass('hidden');
        }
    }, GetMusic.pause);

    GetMusic.play = GetMusic.play || {};
    GetMusic.play = $.extend({
        change: function(container){
            $('#play').addClass('hidden');
            $('#pause').removeClass('hidden');
        }
    }, GetMusic.play);

    GetMusic.plsbutton = GetMusic.plsbutton || {};
    GetMusic.plsbutton = $.extend({
        change: function(container){
            $('#t_pls_show').addClass('selectpls');
            $('#t_pls_show').removeClass('noselectpls');
        },
        recovery: function(container){
            $('#t_pls_show').addClass('noselectpls');
            $('#t_pls_show').removeClass('selectpls');
        }

    }, GetMusic.plsbutton);

    GetMusic.event = GetMusic.event || {};
    GetMusic.event = $.extend({
        setStaticEvent: function(container){
            var dur, durM, val, mus, elem, prog;
            var Pl = 0;
            container.find(".this-music").unbind().click(function(){
                $('#t_title_info').animate({top: "-1.5em",opacity: "hide"}, 0);
                GetMusic.init.initAudio($(this).parent("li"));
                $('#error').text('');
                GetMusic.play.change();

                if(mus){mus[0].pause();
                    mus[0].currentTime = 0;
                    $('li').removeClass('active');
                }
                mus = $(this).next("audio");
                $(this).parent("li").addClass('active');
                mus[0].play();
            });

            container.find('#t_progress').slider({
                value: 0,
                orientation: "horizontal",
                range: "min",
                animate: true,
                step: 1
            });

            container.find('audio').unbind().on("timeupdate", function() {
                mus[0].volume = val/100;
                d = this.duration;
                c = this.currentTime;
                curM = Math.floor(c/60);
                curS = Math.round(c - curM*60);
                $('#current').text(curM + ':' + curS);
                $('#t_progress').slider({
                    max: d,
                    min: 0,
                    value: c
                });
            });

            container.find('audio').unbind().on("playing", function () {
                dur = this.duration;
                durM = Math.floor(dur/60) + ':' + Math.round((dur - Math.floor(dur/60))/10);
                $('#duration').text(durM);
                $(this).parent("li").addClass('active');
                $('#t_title_info').animate({top: "0em",opacity: "show"}, 500);
            });

            container.find('audio').unbind().on("ended", function(){
                mus = $(this).parent('li').next('li').first();
                mus = mus.children('audio');
                $(this).parent("li").addClass('active');
                var next = $('li.active').next();
                $('li').removeClass('active');
                if(mus[0]){
                    GetMusic.init.initAudio(next);
                    mus[0].play();
                }
                else{
                    $('#error').text('最后一首歌！');
                    $('#t_cover').html('<img src="Images/logo.png">');
                }
            });

            //play button
            container.find('#play').unbind().click(function(){
                if(mus){
                    mus[0].play();
                    GetMusic.play.change();
                    $('#error').text('');
                }
                else {
                    $('#error').text('请先选择要播放的歌曲！');
                }

            });

            // pause button
            container.find('#pause').unbind().click(function() {

                if(mus){
                    mus[0].pause();
                    GetMusic.pause.change();
                }
                else {
                    $('#error').text('请先选择要播放的歌曲！');
                }

            });

            //next button
            container.find('#next').unbind().click(function(){
                mus[0].pause();
                mus[0].currentTime = 0;
                mus = mus.parent('li').next('li').first();
                mus = mus.children('audio');
                var next = $('li.active').next();
                $('#t_title_info').animate({top: "-1.25em",opacity: "hide"}, 0);
                $('li').removeClass('active');
                if(mus[0]){
                    GetMusic.init.initAudio(next);
                    mus[0].play();
                }
                else{
                    $('#error').text('已经到底啦，请选择歌曲！');
                    $('#t_cover').html('<img src="Images/logo.png">');
                    mus = null;
                }
            });

            //prev button
            container.find('#prev').unbind().click(function(){
                mus[0].pause();
                mus[0].currentTime = 0;
                mus = mus.parent('li').prev('li').last();
                mus = mus.children('audio');
                var prev = $('li.active').prev();
                $('li').removeClass('active');
                $('#t_title_info').animate({top: "-1.25em",opacity: "hide"}, 0);
                if(mus[0]){
                    GetMusic.init.initAudio(prev);
                    mus[0].play();
                }
                else{
                    $('#error').text('已经到顶啦，请选择歌曲！');
                    $('#t_cover').html('<img src="Images/logo.png">');

                    mus = null;
                }
            });

            //volume
            container.find('#rangeVal').slider({
                value: 60,
                orientation: "horizontal",
                range: "min",
                animate: true,
                step: 1
            });

            // volume text
            val = $('#rangeVal').slider("value");
            $('#val').text(val);

            var tooltip = $('#val');
            tooltip.hide();

            container.find('#rangeVal').slider({
                start: function( event, ui ) {
                    tooltip.fadeIn('fast');
                },
                stop: function(event,ui) {
                    tooltip.fadeOut('fast');
                },
                slide: function( event, ui ) {
                    val = ui.value;
                    tooltip.css('left', val-30).text(ui.value);
                    $('#val').text(val);

                    if(mus){
                        mus[0].volume = val/100;
                    }
                    else {
                        $('#error').text('请先选择要播放的歌曲！');
                    }
                }
            });

            // progress
            container.find('#t_progress').slider({
                start: function( event, ui ) {
                    mus[0].pause();
                },
                stop: function( event, ui ) {
                    prog = ui.value;
                    mus[0].currentTime = prog;
                    mus[0].play();
                    GetMusic.play.change();
                }
            });

            //playlist button
            container.find('#t_pls_show').unbind().click(function(){
                if (Pl == 0) {
                    GetMusic.plsbutton.change();
                    Pl = 1;
                }
                else {
                    GetMusic.plsbutton.recovery();
                    Pl = 0;
                }
                $('#playlist').slideToggle();
            });


        }

    }, GetMusic.event);

})(jQuery, window));
