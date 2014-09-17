/**
 * 日期：2014年8月
 * 作者： 柯常青
 * 依赖：该插件依赖于 jquery-1.8.2.js
 * */
;(function(){
    $.fn.extend({
        //去掉首位空字符
        trim:function(){
            var crrO=$(this);
            crrO= $.trim(crrO);

            return crrO;
        },
        //改变颜色
        color:function(value){
            if(value==undefined){
                return this.css("color");
            }else{
                return this.css("color",value);

            }
        },
        //格式化日期   传递一个date 类型，  结果为  2014-07-11
        formatYMD:function(){


            var curObj=$(this).get(0);
            curObj=new Date(curObj);
//            console.log(curObj.get(0))
//            var curObj=new Date(e.iscurObj);
            var month = curObj.getMonth() + 1 < 10 ? "0" + (curObj.getMonth() + 1) : curObj.getMonth() + 1;
            var day = curObj.getDate() < 10 ? "0" + curObj.getDate() : curObj.getDate();

            var curYMD= curObj.getFullYear()+"-"+month+"-"+day;

            //console.log(curYMD)

            return curYMD;
        },
        //格式化日期时间   传递一个date 类型，  结果为  2014-07-11 21:18:32
        formatYMDHMS:function(){
            var curObj=$(this).get(0);
            curObj=new Date(curObj);
//            console.log(curObj.get(0))
//            var curObj=new Date(e.iscurObj);
            var month = curObj.getMonth() + 1 < 10 ? "0" + (curObj.getMonth() + 1) : curObj.getMonth() + 1;
            var day = curObj.getDate() < 10 ? "0" + curObj.getDate() : curObj.getDate();
            var hour=curObj.getHours()< 10 ? "0" + curObj.getHours() : curObj.getHours();
            var minute=curObj.getMinutes()< 10 ? "0" + curObj.getMinutes() : curObj.getMinutes();
            var second=curObj.getSeconds()< 10 ? "0" + curObj.getSeconds() : curObj.getSeconds();

            var curYMD= curObj.getFullYear()+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;

            //console.log(curYMD)

            return curYMD;
        },
        //定时跳转函数
        toLinks:function(ms,url){
            var me=$(this);
            //初始化倒计时功能
            me.html(ms);


            var interval= setInterval(function(){

                me.html(ms--);
                if(ms==-1){
                    clearTimeout(interval);
                    window.location=url;
                }
            },1000)
        },
        //date 转 long
        tolong:function(dStr){
            var d = new Date(dStr);
           var dateLong= d.getTime();//这就是

            return dateLong;
        },
        //全选& 取消全选
        allChecked:function(checkBox){
            var btn=$(this);
            btn.toggle(function(){
                checkBox.attr("checked", true);
                btn.html("取消全选");
            },function(){
                checkBox.attr("checked", false);
                btn.html("全选");
            });

            //返回this以便于支持链式操作
            return btn;
        },
        //反选
        reverseChecked:function(checkBox){
            var btn=$(this);
            btn.click(function(){
                checkBox.each(function(i,e){
                        e.checked= !e.checked;
                });
            });

            //返回this以便于支持链式操作
            return btn;
        }

    });


})(jQuery);


