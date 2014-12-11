
var yabe = yabe || {};

((function ($, window) {


    yabe.ShowPhoto = {};
    yabe.ShowPhoto = yabe.ShowPhoto || {};
    var ShowPhoto = yabe.ShowPhoto;

    ShowPhoto.init = ShowPhoto.init || {};
    ShowPhoto.init = $.extend({
        doInit: function(container) {
            container.find('#coverImg').unbind().change(function(){
                ShowPhoto.show.doShowImage(container);
            });

            container.find('.save-update-album-btn').unbind().click(function(){
                container.find("form").submit();
            });
        }
    }, ShowPhoto.init);

    ShowPhoto.show = ShowPhoto.show || {};
    ShowPhoto.show = $.extend({
        doShowImage: function(container){

            $('#preview').remove();
            var newImg = '<img id="preview" style="width: 350px" name="imageFile"/>';
            $('.img').html(newImg);

            var oFile = container.find('#coverImg')[0].files[0];

            var rFilter = /^(image\/jpeg|image\/png)$/i;
            if (! rFilter.test(oFile.type)) {
                $('.error').html('请选择正确的图片格式(jpg/png)').show(300);
                return;
            }

            // check for file size
            if (oFile.size > 500 * 500) {
                $('.error').html('文件太大！').show();
                return;
            }

            // preview element
            var oImage = document.getElementById('preview');

            // prepare HTML5 FileReader
            var oReader = new FileReader();
            oReader.readAsDataURL(oFile);
            oReader.onload = function(e) {

                // e.target.result contains the DataURL which we can use as a source of the image
                oImage.src = e.target.result;
                oImage.onload = function () { // onload event handler

                    // display some basic image info
                    var sResultFileSize = bytesToSize(oFile.size);
                    $('#filesize').val(sResultFileSize);
                    $('#filetype').val(oFile.type);
                    $('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);

                    // Create variables (in this scope) to hold the Jcrop API and image size
                    var jcrop_api, boundx, boundy;

                    // destroy Jcrop if it is existed
                    if (typeof jcrop_api != 'undefined')
                        jcrop_api.destroy();

                    // initialize Jcrop
                    $('#preview').Jcrop({
                        minSize: [32, 32], // min crop size
                        aspectRatio : 1, // keep aspect ratio 1:1
                        bgFade: true, // use fade effect
                        bgOpacity: .3, // fade opacity
                        onChange: updateInfo,
                        onSelect: updateInfo,
                        onRelease: clearInfo
                    }, function(){


                        var bounds = this.getBounds();
                        boundx = bounds[0];
                        boundy = bounds[1];

                        // Store the Jcrop API in the jcrop_api variable
                        jcrop_api = this;
                    });
                };
            };

        }
    }, ShowPhoto.show);

})(jQuery,window));

