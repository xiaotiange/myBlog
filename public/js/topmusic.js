
var yabe = yabe || {};

((function ($, window) {


    yabe.GenTopMusic = {};
    yabe.GenTopMusic = yabe.GenTopMusic || {};
    var GenTopMusic = yabe.GenTopMusic;

    GenTopMusic.init = GenTopMusic.init || {};
    GenTopMusic.init = $.extend({
        doInit: function(container) {
            var playlist=[];

            var firstObj = container.find(".first-div-ul");
            var secondObj = container.find(".second-div-ul");
            var thirdObj = container.find(".third-div-ul");
            var fourObj = container.find(".four-div-ul");


            $.ajax({
                type: 'post',
                url: '/TopMusic/searchTopMusic',
                success: function (dataJson) {

                    if(dataJson.isOk==false){
                        alert(dataJson.msg);
                        return;
                    }
                    var resArray = dataJson.res;

                    firstObj.html("");
                    secondObj.html("");
                    thirdObj.html("");
                    fourObj.html("");

                    $(resArray).each(function(index, itemArray) {

                        $(itemArray).each(function(i, item) {

                            if(item.imgPath ===undefined ||item.imgPath ==null || item.imgPath ==""){
                                item.imgPath = "/public/img/logo.jpg";
                            }else{
                                item.imgPath = "/MusicAdmin/getMusicImage?musicId="+item.id;
                            }
                            item.index = i+1;
                        });
                    });

                    var firstJsonArray = dataJson.res[0];
                    var secondJsonArray = dataJson.res[1];
                    var thirdJsonArray = dataJson.res[2];
                    var fourJsonArray = dataJson.res[3];

                    var firstliObjs = $("#topMusicLiTmpl").tmpl(firstJsonArray);
                    var secondliObjs = $("#topMusicLiTmpl").tmpl(secondJsonArray);
                    var thirdliObjs = $("#topMusicLiTmpl").tmpl(thirdJsonArray);
                    var fourliObjs = $("#topMusicLiTmpl").tmpl(fourJsonArray);

                    firstObj.html(firstliObjs);
                    secondObj.html(secondliObjs);
                    thirdObj.html(thirdliObjs);
                    fourObj.html(fourliObjs);

                    container.find(".listen-btn").unbind().click(function(){
                        var order = $(this).attr("order");

                        if(order == "first"){
                            playlist =  firstJsonArray.slice(0);
                        }else if(order == "second"){
                            playlist =  secondJsonArray.slice(0);
                        }else if(order == "third"){
                            playlist =  thirdJsonArray.slice(0);
                        }else{
                            playlist =  fourJsonArray.slice(0);
                        }

                        yabe.MusicControl.control.staticEvent(playlist);
                    });


                }
            });

        }
    }, GenTopMusic.init);


})(jQuery,window));

