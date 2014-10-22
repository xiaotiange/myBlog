
((function ($, window) {
    $(function () {
        $.fn.extend({
            tmpage:function (param) {
                init(param, $(this));
                return $(this);
            }
        });

        function init(param, obj) {

            //是否使用jsonp
            function isUseJsonp() {
                var isJsonp = param.isJsonp;
                if (isJsonp == true) {
                    return true;
                } else {
                    return false;
                }
            }


            //每页多少条

            function getPageSizeOption() {
                /*var html = '每页&nbsp;<select style="width: 60px;" class="paging-size-select">' +
                 '   <option value="10" selected="selected">10</option> ' +
                 '   <option value="20">20</option> ' +
                 '   <option value="50">50</option> ' +
                 '   <option value="100">100</option> ' +
                 '</select>&nbsp;条&nbsp;';
                 return html;*/

                var pageSizeArray = param.selfPageSizeArray;
                if (pageSizeArray === undefined || pageSizeArray == null || pageSizeArray.length <= 0) {

                    var html = '每页显示&nbsp;' +
                        '<span class="small-pagesize-span"><span class="paging-size5 paging-size-span paging-nav paging-size-link" style="font-weight: bold;cursor: pointer;">5</span>|&nbsp;</span>' +
                        '<span class="paging-size10 paging-size-span paging-nav paging-size-link" style="font-weight: bold;cursor: pointer;">10</span>|&nbsp;' +
                        '<span class="paging-size20 paging-size-span paging-nav paging-size-link" style="font-weight: bold;cursor: pointer;">20</span>|&nbsp;' +
                        //'<span class="paging-size50 paging-size-span" style="font-weight: bold;color: blue;cursor: pointer;">50</span>&nbsp;|&nbsp;' +
                        '<span class="paging-size50 paging-size-span paging-nav paging-size-link" style="font-weight: bold;cursor: pointer;">50</span>' +
                        '条&nbsp;';
                    return html;
                } else {
                    var html = '每页显示&nbsp;';
                    $(pageSizeArray).each(function(index, selfPageSize) {
                        html += '<span class="paging-size' + selfPageSize + ' paging-size-span paging-nav paging-size-link" style="font-weight: bold;cursor: pointer;">' + selfPageSize + '</span>';
                        if (index < pageSizeArray.length - 1) {
                            html += '&nbsp;|&nbsp;';
                        }
                    });
                    html += '&nbsp;条&nbsp;';
                    return html;
                }

            }

            function isSelfDefinePageSize() {
                var pageSizeArray = param.selfPageSizeArray;
                if (pageSizeArray === undefined || pageSizeArray == null || pageSizeArray.length <= 0)
                    return false;
                return true;
            }

            //设置选择每页多少条的事件
            function setPageSizeOptionEvent(obj) {
                /*obj.find(".paging-size-select").change(function () {
                 var newPageSize = $(this).val();
                 pageSize = newPageSize;
                 //保存到cookie
                 $.cookie(tmPagingSizeCookie, newPageSize, {expires: 365, path:'/'});
                 createView(1);
                 });*/
                obj.find(".paging-size-span").click(function () {
                    var newPageSize = $(this).html();
                    pageSize = newPageSize;
                    //保存到cookie
                    $.cookie(tmPagingSizeCookie, newPageSize, {expires: 365, path:'/'});
                    createView(1);
                });

            }

            //设置当前的pageSize
            function setCurrentPageSizeOption(obj, curretPageSize) {
                //obj.find(".paging-size-select").val(pageSize);

                var className = "paging-size" + curretPageSize;
                //obj.find("." + className).css("color", "#a10000");
                if (getIsUseSmallPageSize() == false) {
                    obj.find(".small-pagesize-span").remove();
                }

                obj.find("." + className).removeClass("paging-size-link");
                obj.find("." + className).addClass("paging-size-select");
            }

            var tmPagingSizeCookie = "tmPagingSizeCookie";
            if (param && param instanceof Object) {
                var options;
                var currPage;
                var pageCount;
                var pageSize;
                var tempPage;
                var resultCount;
                var linkNum = 10;
                var defaults = new Object({
                    currPage:1,
                    pageCount:10,
                    pageSize:5,
                    useSmallPageSize: false,
                    isJsonp: false,
                    ajax:{
                        on:false,
                        pageCountId:'pageCount',
                        param:{
                            pn:1,
                            ps:8
                        },
                        ajaxStart:function () {
                            return false;
                        }},
                    info:{
                        next:'下一页',
                        prev:'上一页',
                        next_on:true,
                        prev_on:true,
                        msg_on:true,
                        link:'javascript:void(0);',
                        msg:'<span>&nbsp;&nbsp;共&nbsp;{sumPage}&nbsp;页&nbsp;' +
                            getPageSizeOption() +
                            '到&nbsp;{currText}&nbsp;页&nbsp;<input  class="gopage-submit hand" title="跳转页面" type="button" value="确定"/></span>'
                    }
                });




                function getCurrPage() {
                    if (typeof options.currPage != 'undefined') {
                        return options.currPage;
                    } else {
                        return defaults.currPage;
                    }
                }

                function getPageCount() {
                    if (typeof options.pageCount != 'undefined') {
                        return options.pageCount;
                    } else {
                        return defaults.pageCount;
                    }
                }
                function getResultCount() {
                    if (options.resultCount ) {
                        return options.resultCount;
                    } else {
                        return defaults.pageCount;
                    }
                }

                function getPageSize() {
                    if (typeof options.pageSize != 'undefined') {
                        return options.pageSize;
                    } else {
                        return defaults.pageSize;
                    }
                }

                function getIsUseSmallPageSize() {
                    if (typeof options.useSmallPageSize != 'undefined') {
                        return options.useSmallPageSize;
                    } else {
                        return defaults.useSmallPageSize;
                    }
                }

                function getPrev() {
                    if (options.info && options.info.prev_on == false) {
                        return "";
                    }
                    if (options.info && options.info.prev) {
                        return options.info.prev;
                    } else {
                        return defaults.info.prev;
                    }
                }

                function getNext() {
                    if (options.info && options.info.next_on == false) {
                        return "";
                    }
                    if (options.info && options.info.next) {
                        return options.info.next;
                    } else {
                        return defaults.info.next;
                    }
                }

                function getLink() {
                    if (options.info && options.info.link) {
                        return options.info.link;
                    } else {
                        return defaults.info.link;
                    }
                }

                function getAjax() {
                    if (options.ajax && options.ajax.on) {
                        return options.ajax;
                    } else {
                        return defaults.ajax;
                    }
                }

                function getParam() {
                    if (options.ajax.param) {
                        options.ajax.param.pn = currPage;
                        options.ajax.param.ps = pageSize;
                        return options.ajax.param;
                    } else {
                        defaults.ajax.param.pn = currPage;
                        defaults.ajax.param.ps = pageSize;
                        return defaults.ajax.param;
                    }
                }

                function getPageCountId() {
                    if (options.ajax && options.ajax.pageCountId) {
                        return options.ajax.pageCountId;
                    } else {
                        return defaults.ajax.pageCountId;
                    }
                }

                function getAjaxStart() {
                    if (options.ajax && options.ajax.ajaxStart) {
                        options.ajax.ajaxStart();
                    } else {
                        defaults.ajax.ajaxStart;
                    }
                }

                function getMsg() {
                    var input = "<input type='text' class='jumpTo' value='" + currPage + "' >";
                    var str;
                    if (options.info && options.info.msg_on == false) {
                        return false;
                    }
                    str = (options.info && options.info.msg) ? options.info.msg : defaults.info.msg;
                    str = str.replace("{currText}", input);
                    str = str.replace("{currPage}", currPage);
                    str = str.replace("{sumPage}", pageCount);

                    return str;
                }
            }

            function getText() {
                var msg = getMsg();
                if (msg) {
                    msg = $(msg);
                } else {
                    return "";
                }
                return msg.html();
            }

            function isCode(val) {
                if (val < 1) {
                    TM.Alert.load('输入值不能小于1');

                    //alert("输入值不能小于1");
                    return false;
                }
                var patrn = /^[0-9]{1,8}$/;
                if (!patrn.exec(val)) {
                    TM.Alert.load('请输入正确的数字');

                    //alert("请输入正确的数字");
                    return false;
                }
                if (val > pageCount) {
                    TM.Alert.load('输入值不能大于总页数');

                    //alert("输入值不能大于总页数");
                    return false;
                }
                return true;
            }

            function updateView(resultCount) {
                currPage = parseInt(currPage);
                pageCount = parseInt(pageCount);
                var link = getLink();
                var lastPage;
                var firstPage = lastPage = 1;
                if (currPage - tempPage > 0) {
                    firstPage = currPage - tempPage;
                } else {
                    firstPage = 1;
                }
                if (firstPage + linkNum > pageCount) {
                    lastPage = pageCount + 1;
                    firstPage = lastPage - linkNum;
                } else {
                    lastPage = firstPage + linkNum;
                }
                var content = '<div class="tm-paging-container">';

                if (currPage == 1) {
                    content += "<span class=\"page-prev page-prev-disabled\" title=\"" + getPrev() + "\"></span>&nbsp;";
                } else {
                    content += "<a class='page-prev page-prev-abled' href='" + link + "' title='" + (currPage - 1) + "'>"+ getPrev() +"</a>&nbsp;";
                }
                if (firstPage <= 0) {
                    firstPage = 1;
                }
                for (firstPage; firstPage < lastPage; firstPage++) {
                    if (firstPage == currPage) {
                        content += "<span class=\"paging-nav paging-select current\" title=\"" + firstPage + "\">" + firstPage + "</span>&nbsp;";
                    } else {
                        content += "<a class='paging-nav paging-link' href='" + link + "' title='" + firstPage + "'>" + firstPage + "</a>&nbsp;";
                    }
                }

                if (currPage == pageCount) {
                    content += "<span class=\"page-next page-next-disabled\" title=\"" + getNext() + "\"></span>&nbsp;";
                } else {
                    content += "<a class='page-next page-next-abled' href='" + link + "' title='" + (currPage + 1) + "'>"+getNext()+" </a>&nbsp;";
                }

                content += getText();
                content += '</div>';

                if( (resultCount && resultCount < 10)){
                    obj.html('');
                }else {
                    obj.html(content);
                }

                setCurrentPageSizeOption(obj, pageSize);

                obj.find(":text").keypress(function (event) {
                    var keycode = event.which;
                    if (keycode == 13) {
                        var page = $(this).val();
                        if (isCode(page)) {
//                            obj.find("a").unbind("click");
//                            obj.find("a").each(function() {
//                                $(this).click(function() {
//                                    return false;
//                                })
//                            });
                            createView(page);
                        }
                    }
                });

                obj.find(":button").click(function () {
                    var page = obj.find(":text").val();
                    if (isCode(page)) {
                        createView(page);
                    }
                });
                setPageSizeOptionEvent(obj);
                obj.find("a").click(function (i) {
                    var page = this.title;
                    createView(page);
                });

            }

            function createView(page) {
                currPage = page;
                var ajax = getAjax();
                if (ajax.on) {
                    getAjaxStart();
                    var varUrl = ajax.url;
                    var param = getParam();
//                    console.info(param);

                    var ajaxEndCallback = function(data) {
                        if(!data) {
                            return;
                        }

                        var isSuccess = data.isOk;
                        if (isSuccess === undefined) {
                            isSuccess = data.success;
                        }

                        if (isSuccess == false) {
                            return;
                        }

                        if (data.isOk) {
                            loadPageCount({
                                dataType:ajax.dataType,
                                callback:ajax.callback,
                                data:data
                            });
                            updateView(data.count);
                            return true;
//                                } else {
////                                alert(data.message);
//                                    return false;
//                                }
                        }
                        else {
                            $('#loadingImg').parents('tr').remove();

                            if(data.message){
                                TM.Alert.load(data.message);
                            }
                            //alert(data.message);
                        }

                    }

                    if (isUseJsonp() == true) {

                        TM.Loading.init.show();
                        /*if (varUrl.indexOf("?") >= 0) {
                         varUrl += "&pn=" + param.pn + "&ps=" + param.ps;
                         } else {
                         varUrl += "?pn=" + param.pn + "&ps=" + param.ps;
                         }*/
                        $.ajax({
                            type: "get",
                            url: varUrl,
                            data:param,
                            dataType: "jsonp",
                            success: function(data){

                                ajaxEndCallback(data);

                                TM.Loading.init.hidden();
                            },
                            error: function(){
                                updateView();
                                TM.Loading.init.hidden();
                            }
                        });
                    } else {
                        $.ajax({
                            url:varUrl ,
                            type:'post',
                            data:param,
                            contentType:"application/x-www-form-urlencoded;utf-8",
                            //async:false,
                            dataType:'json',
                            error:function (jqXHR, textStatus) {
                                updateView();
                                //alert(textStatus);
                            },
                            success:function (data) {
                                ajaxEndCallback(data);
                            }
                        })
                    }


                } else {
                    updateView();
                }
            }


            function checkParam() {
                if (currPage < 1) {
                    TM.Alert.load('配置参数错误\n错误代码:-1');

                    //alert("配置参数错误\n错误代码:-1");
                    return false;
                }
                /*if (currPage > pageCount) {
                 TM.Alert.load('配置参数错误\n错误代码:-2');

                 //alert("配置参数错误\n错误代码:-2");
                 return false;
                 }*/
                if (pageSize < 2) {
                    TM.Alert.load('配置参数错误\n错误代码:-3');

                    //alert("配置参数错误\n错误代码:-3");
                    return false;
                }
                return true;
            }

            function loadPageCount(options) {
                if (options.dataType) {
                    var formData;
                    var data = options.data;
                    var resultPageCount = false;
                    var isB = true;
                    var pageCountId = getPageCountId();
                    var callback;

                    switch (options.dataType) {
                        case"json":
//                        data =$.parseJSON(data);
//                         resultPageCount = eval("data." + pageCountId);
                            formData = options.data;
                            resultPageCount = formData.pnCount;
                            break;
                        case"xml":
                            resultPageCount = $(data).find(pageCountId).text();
                            break;
                        default:
                            isB = false;
                            options.callback && options.callback(data);
                            resultPageCount = $("#" + pageCountId).val();
                            break;
                    }
                    if (resultPageCount) {
                        pageCount = resultPageCount;
                    }

                    if (isB) {
                        options.callback && options.callback(data);
                    }
                }
            }
            options = param;
            currPage = getCurrPage();
            pageCount = getPageCount();

            if (getIsUseSmallPageSize() == true) {
                tmPagingSizeCookie = "SmallPageSize_" + tmPagingSizeCookie;
            }
            var cookiePageSize = $.cookie(tmPagingSizeCookie);
            if (cookiePageSize === undefined || cookiePageSize == null || cookiePageSize <= 0) {
                pageSize = getPageSize();
            } else {
                pageSize = cookiePageSize;
            }
            if (pageSize <= 8 && getIsUseSmallPageSize() == true)
                pageSize = 5;
            else if (pageSize <= 15)
                pageSize = 10;
            else if (pageSize <= 30)
                pageSize = 20;
            else
                pageSize = 50;

            //天猫联盟中，降权分页
            if (isSelfDefinePageSize() == true) {
                tmPagingSizeCookie = "SelfDefinePageSize_" + tmPagingSizeCookie;
                cookiePageSize = $.cookie(tmPagingSizeCookie);
                if (cookiePageSize === undefined || cookiePageSize == null || cookiePageSize <= 0) {
                    pageSize = getPageSize();
                } else {
                    pageSize = cookiePageSize;
                }
            }


            tempPage = parseInt(linkNum / 2);
            if (checkParam() && createView(currPage)) {
                updateView();
            }
        }
    });

})(jQuery, window));
