
var yabe = yabe || {};
var repeat = localStorage.repeat || 0,
    shuffle = localStorage.shuffle || 'false',
    continous = true,
    autoplay = true,
    playlist=[];

((function ($, window) {


    yabe.MusicControl = {};
    yabe.MusicControl = yabe.MusicControl || {};
    var MusicControl = yabe.MusicControl;

    MusicControl.control = MusicControl.control || {};
    MusicControl.control = $.extend({
        staticEvent: function(playlist) {
            var time = new Date(),
                currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
                trigger = false,
                audio, timeout, isPlaying, playCounts;

            var play = function(){
                audio.play();
                $('.playback').removeClass('glyphicon-play');
                $('.playback').addClass('playing glyphicon-pause');
                $('.playback').attr("title","暂停");
                timeout = setInterval(updateProgress, 500);
                isPlaying = true;
            }

            var pause = function(){
                audio.pause();
                $('.playback').removeClass('playing glyphicon-pause');
                $('.playback').addClass('glyphicon-play');
                $('.playback').attr("title","播放");
                clearInterval(updateProgress);
                isPlaying = false;
            }

            // Update progress
            var setProgress = function(value){
                var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
                    ratio = value / audio.duration * 100;

                $('.timer').html(parseInt(value/60)+':'+currentSec);
                $('.progress .pace').css('width', ratio + '%');
                $('.progress .slider a').css('left', ratio + '%');
            }

            var updateProgress = function(){
                setProgress(audio.currentTime);
            }

            // Progress slider
            $('.progress .slider').slider({step: 0.1, slide: function(event, ui){
                $(this).addClass('enable');
                setProgress(audio.duration * ui.value / 100);
                clearInterval(timeout);
            }, stop: function(event, ui){
                audio.currentTime = audio.duration * ui.value / 100;
                $(this).removeClass('enable');
                timeout = setInterval(updateProgress, 500);
            }});

            // Volume slider
            var setVolume = function(value){
                audio.volume = localStorage.volume = value;
                $('.volume .pace').css('width', value * 100 + '%');
                $('.volume .slider a').css('left', value * 100 + '%');
            }

            var volume = localStorage.volume || 0.5;
            $('.volume .slider').slider({max: 1, min: 0, step: 0.01, value: volume, slide: function(event, ui){
                setVolume(ui.value);
                $(this).addClass('enable');
                $('.mute').removeClass('enable glyphicon-volume-off');
            }, stop: function(){
                $(this).removeClass('enable');
            }}).children('.pace').css('width', volume * 100 + '%');

            $('.mute').unbind().click(function(){
                if ($(this).hasClass('enable')){
                    setVolume($(this).data('volume'));
                    $(this).removeClass('enable glyphicon-volume-off');
                    $(this).addClass('glyphicon-volume-up');
                } else {
                    $(this).data('volume', audio.volume).addClass('enable glyphicon-volume-off');
                    $(this).data('volume', audio.volume).removeClass('glyphicon-volume-up');
                    setVolume(0);
                }
            });

            // Switch track
            var switchTrack = function(i){
                if (i < 0){
                    track = currentTrack = playlist.length - 1;
                } else if (i >= playlist.length){
                    track = currentTrack = 0;
                } else {
                    currentTrack = i;
                }

                closeOtherPlay(currentTrack);
                loadMusic(currentTrack);
                if (isPlaying == true) play();
            }


            // Shuffle
            var shufflePlay = function(){
                var time = new Date(),
                    lastTrack = currentTrack;
                currentTrack = time.getTime() % playlist.length;
                if (lastTrack == currentTrack) ++currentTrack;
                switchTrack(currentTrack);
            }

            // Fire when track ended
            var ended = function(){
                pause();
                audio.currentTime = 0;
                playCounts++;
                if (continous == true) isPlaying = true;
                if (repeat == 1){
                    switchTrack(currentTrack);
                } else {
                    if (shuffle === 'true'){
                        shufflePlay();
                    } else {
                        if (repeat == 2){
                            switchTrack(++currentTrack);
                        } else {
                            if (currentTrack < playlist.length) switchTrack(++currentTrack);
                        }
                    }
                }
            }

            var beforeLoad = function(){
                var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
                $('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) +'%');
            }

            // Fire when track loaded completely
            var afterLoad = function(){
                if (autoplay == true) play();
            }

            // Load track
            var loadMusic = function(i){
                var item = playlist[i];

                var	newaudio = $('.audio');
                newaudio.html("");
                var shtml = '<source src = "/MusicAdmin/getMusic?musicId='+item.id+'" type="audio/mpeg">'
                newaudio.html(shtml);

                if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                    $('.cover').html('<img src="/public/img/logo.png" alt="'+item.album+'">');
                }else{
                    $('.cover').html('<img src = "/MusicAdmin/getMusicImage?musicId='+item.id+'" alt="'+item.album+'">');
                }

                $('.tag').html('<strong>'+item.songTitle+'</strong><span class="artist">'+item.singer+'</span><span class="album">《'+item.album+'》</span>');

                $('#playlist li').eq(i).find('.music-play-div').addClass('isPlaying');
                audio = newaudio[0];
                audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
                audio.addEventListener('progress', beforeLoad, false);
                audio.addEventListener('durationchange', beforeLoad, false);
                audio.addEventListener('canplay', afterLoad, false);
                audio.addEventListener('ended', ended, false);
            }

            loadMusic(currentTrack);

            $(".img-div").unbind().hover(function(){
                var parent = $(this).parent();
                parent.find(".music-play-div").show();
                   },
                function(){
                    var parent = $(this).parent();
                    var thisdiv = parent.find(".music-play-div");
                    if(thisdiv.hasClass("isPlaying")){

                    }else{
                        parent.find(".music-play-div").hide();
                    }

                });



            $('.playback').unbind().click(function(){
                if ($(this).hasClass('playing')){
                    pause();
                } else {
                    play();
                }
            });
            $('.rewind').unbind().click(function(){
                if (shuffle === 'true'){
                    shufflePlay();
                } else {
                    switchTrack(--currentTrack);
                }
            });
            $('.fastforward').unbind().click(function(){
                if (shuffle === 'true'){
                    shufflePlay();
                } else {
                    switchTrack(++currentTrack);
                }
            });
            $('#playlist li').each(function(){
                $(this).unbind().dblclick(function(){
                    var _i = $(this).index()
                    switchTrack(_i);
                });
            });

            $('#playlist li').each(function(){
                var container = $(this);
                var _i = $(this).index()
                container.find(".play-music").unbind().click(function(){
                    if(container.find(".music-play-div").hasClass("isPlaying")){
                        if($(this).hasClass("glyphicon-play")){
                            $(this).removeClass("glyphicon-play").addClass("glyphicon-pause");
                            play();
                        }else{
                            $(this).removeClass("glyphicon-pause").addClass("glyphicon-play");
                            pause();
                        }
                    }else{
                        $(this).removeClass("glyphicon-play").addClass("glyphicon-pause");
                        container.find(".music-play-div").addClass("isPlaying");
                        switchTrack(_i);
                    }

                });
            });

            $(".plus-tag").unbind().click(function(){
                var thisObj = $(this);
                if(thisObj.hasClass("glyphicon-plus-sign")){
                    thisObj.removeClass("glyphicon-plus-sign").addClass("glyphicon-ok-sign").addClass("ok-sign-color");
                }else{
                    thisObj.removeClass("ok-sign-color").removeClass("glyphicon-ok-sign").addClass("glyphicon-plus-sign");
                }
            });
            $(".heart-tag").unbind().click(function(){
                var thisObj = $(this);
                if(thisObj.hasClass("red")){
                    thisObj.removeClass("red");
                }else{
                    thisObj.addClass("red");
                }
            });

            var closeOtherPlay = function(i){
                $('#playlist li').each(function(){
                    var _i = $(this).index();

                    if(_i == i){
                        var thisObj = $(this).find(".music-play-div");
                        thisObj.show();
                        if(thisObj.hasClass("isPlaying")){

                        }else{
                            thisObj.addClass("isPlaying");
                        }
                    }else{
                        var thisObj = $(this).find(".music-play-div");
                        if(thisObj.hasClass("isPlaying")){
                            thisObj.removeClass("isPlaying");
                            thisObj.find(".play-music").removeClass("glyphicon-pause").addClass("glyphicon-play");
                            thisObj.hide();

                        }
                    }

                });

            };

            if (shuffle === 'true') $('.shuffle').addClass('enable');
            if (repeat == 1){
                $('.repeat-once').addClass('once green');
            } else if (repeat == 2){
                $('.repeat-all').addClass('all green');
            }

            $('.repeat-all').unbind().click(function(){
                if ($(this).hasClass('all green')){
                    repeat = localStorage.repeat = 0;
                    $(this).removeClass('all green');
                } else {
                    repeat = localStorage.repeat = 2;
                    $(this).addClass('all green');
                }
                $('.repeat-once').removeClass('once green');

                hideShuffle();
            });

            $('.repeat-once').unbind().click(function(){
                if ($(this).hasClass('once green')){
                    repeat = localStorage.repeat = 0;
                    $(this).removeClass('once green');
                }else {
                    repeat = localStorage.repeat = 1;
                    $(this).addClass('once green');
                }
                $('.repeat-all').removeClass('all green');

                hideShuffle();
            });
            var hideShuffle = function(){
                if ($('.shuffle').hasClass('enable green')){
                    shuffle = localStorage.shuffle = 'false';
                    $('.shuffle').removeClass('enable green');
                }
            }
            var hideRepeat = function(){
                repeat = localStorage.repeat = 0;
                $('.repeat-all').removeClass('all green');
                $('.repeat-once').removeClass('once green');
            }

            $('.shuffle').unbind().click(function(){
                if ($(this).hasClass('enable green')){
                    shuffle = localStorage.shuffle = 'false';
                    $(this).removeClass('enable green');
                } else {
                    shuffle = localStorage.shuffle = 'true';
                    $(this).addClass('enable green');
                }

                hideRepeat();

            });
            $('.remove-icon').unbind().click(function(){
                var arrayId = $(this).parent().index();
                playlist.splice(arrayId,1);
                $(this).parent().remove();
                if(playlist.length<=0){
                    return;
                }
                if(arrayId==currentTrack){
                    switchTrack(currentTrack);
                }
            });

            $("[data-toggle='tooltip']").tooltip();

        }
    }, MusicControl.control);

})(jQuery,window));


