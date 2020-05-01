//事件绑定函数
function addEvent(elem, type, handle){
    if(elem.addEventListener){
        elem.addEventListener(type, handle, false);
    }else if(elem.attachEvent){
        elem.attachEvent('on'+type, function(){
            handle.call(elem);
        });
    }else{
        elem['on' + type] = handle;
    }
}


//获取元素某个属性值
function getStyle(elem, prop){
    if(window.getComputedStyle){
        return window.getComputedStyle(elem, null)[prop];//传进来的是字符串 一定要用中括号
    }else{
        return elem.currentStyle[prop];
    }
}

//获取窗口宽高
function getViewportOffset(){
    if(window.innerWidth){
        return{
            w : window.innerWidth,
            h : window.innerHeight
        }
    }else{
        if(document.compatMode === "BackCompat"){
            return{
                w : document.body.clientWidth,
                h : document.body.clientHeight
            }
        }else{
            return{
                w : document.documentElement.clientWidth,
                h : document.documentElement.clientHeight
            }
        }
    }
}

//获取滚动条位置
function getScrollOffset(){
    if(window.pageXOffset){
        return {
            x : window.pageXOffset,
            y : window.pageYOffset
        }
    }else{
        return {
            x : document.body.scrollLeft + document.documentElement.scrollLeft,
            y : document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

function scrollMove(target){
    var Y = getScrollOffset().y;
    var cur = getScrollOffset().y;
    var timmer = null;
    if(Y < target){
        timmer = setInterval(function () { 
            Y += 20;
            scrollTo(0 , Y)
            
            cur = getScrollOffset().y;
            if(cur  >= target){
                clearInterval(timmer);
                return;
            }
        }, 5)
    }else if(Y > target){
        timmer = setInterval(function () { 
            Y -= 20;
            scrollTo(0 , Y);
            cur = getScrollOffset().y;
            
            if(cur <= target){
                clearInterval(timmer);
                
                return;
            }
        }, 5)
    }
}


function removeEventFn(element, type, handle){
    if(window.removeEventListener){
        element.removeEventListener(type, handle, false);
    }else if(window.detachEvent){
        element.detachEvent("on"+type, handle);
    }else{
        element["on"+type] = null;
    }
}


//运动函数框架
function move(dom, obj, callback){
    var iSur = null, ispeed = null, t = true;
    clearInterval(dom.timer);
    var self = text;
    dom.timer = setInterval(function(){
        for(var keep in obj){
            if(keep == "opacity"){
                iSur = parseFloat( self.getStyle(dom, keep) ) * 100;
            }else{
                iSur = parseInt( self.getStyle(dom, keep) );
            }
            
            ispeed = (obj[keep] - iSur) / 7 ;
            // ispeed = 30;
        
            ispeed = ispeed > 0 ? Math.ceil(ispeed) : Math.floor(ispeed); 
            if(iSur != obj[keep]){
                t = false;
            }else{
                t = true;
            }
            if(keep == "opacity"){
                dom.style[keep] = ( iSur + ispeed ) / 100;
            }else{
                dom.style[keep] = iSur + ispeed + "px";
            }
            
        }
        if(t){
            clearInterval(dom.timer);
            callback && callback();
        }
    }, 15);
}

// 聚焦消失、失焦显示
function holderChange(status, this_){ 
    // var placeholder = document.querySelector(".placeholder");
    // var text = document.querySelector(".inputContent").value;
    // console.log(text);
    
    if(status == "onfocus"){
        this_.nextElementSibling.style.display = 'none';
    }else if(status == "onbulr" && this_.value == ''){
        this_.nextElementSibling.style.display = 'block';
    }
}

//将字符串转换成dom
function parseToDOM(str){
    var div = document.createElement("div");
    if(typeof str == "string")
        div.innerHTML = str;
    return div.childNodes;
 }


//取消默认事件
function cancelDefault(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
}
    

//获取url中的参数值
 function getQueryString(name) {
    //  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    // "(^|&)"匹配以&开头或者任意空白开头
    // ([^&]*) 匹配除了&以外的任意数量字符串
    // (&|$) 匹配以&结尾或任意空白结尾
    var r = window.location.search.substr(1).match(reg);
    //获取url中"?"符后的字符串并正则匹配
    //search返回"?name=...",substr（1）为了去掉问号

    var context = "";
    if (r != null)
       context = r[2];
    reg = null; 
    r = null; 
    return context == null || context == "" || context == "undefined" ? "" : context; 
}

//给url追加参数、或者修改参数
function updateQueryString(uri, key, value) {
	if(!value && value !== 0) {//不填值的时候直接返回
		return uri;
	}
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";//分隔符
	if (uri.match(re)) {

		return uri.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
		return uri + separator + key + "=" + value;
	}
}


// search请求
function getSearchRes(text, loading, href){
    if(text){
        loading.style.display = "block";
        setTimeout(function (){
            $.ajax({
                // 向后台请求搜索，搜索逻辑已经写好在这个路由里面
                url : 'http://vtmer.cn/mysearch',
                data : text,
                type : 'post',
                beforeSend : function (){
                    // 加载
                    loading.style.display = "block";
                },
                success : function (xhr){ 
                    console.log(xhr);
                    //转码后对称加密，存数据到ss
                    let datastr = btoa(encodeURI(xhr));
                    sessionStorage.removeItem("books");
                    sessionStorage.setItem("books", datastr);

                    loading.style.display = "none";
                    window.location.href = `${href}?search=${text}`;
                },
                error : function (){
                    alert("error");
                }
            });
        }, 3000);
    }
}