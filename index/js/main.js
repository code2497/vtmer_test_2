

let mainDom = {
    userShowArea : document.querySelector(".user").querySelector("a"),
    close : document.querySelector(".close"),
    loginPage : document.querySelector(".loginPage"),
    submitbtn : document.querySelector(".loginPage")
                        .querySelector(".userInfo")
                        .querySelector(".loginbtn"),
    loginForm : document.querySelector(".loginPage")
                        .querySelector(".userInfo")
                        .querySelector("form"),
    userID : document.querySelector(".loginPage")
                     .querySelector(".userInfo")
                     .querySelector(".IDcontent"),
    userPWD : document.querySelector(".loginPage")
                     .querySelector(".userInfo")
                     .querySelector(".PWDcontent"),
    loading : document.querySelector(".loading"),
    warn : document.querySelector(".loginPage")
                   .querySelector(".warn"),
    cateLiCol : document.querySelector(".category").getElementsByTagName("li"),
    searchSub : document.querySelector(".searchBox").querySelector(".submitBtn"),
    inputArea : document.querySelector(".searchBox").querySelector(".inputText"),
}



let mainFunction = {
    init : function (){
        this.userShow(mainDom.userShowArea);
        this.open_close(mainDom.userShowArea, mainDom.close);
        
        this.addLogin(this.loginCol);
        this.toSearch();
    },
    //窗口开关
    openLoginPage : function (){
        mainDom.loginPage.style.display = "block";
        mainDom.loginPage.style.transition = "opacity 0.1s ease 0.1s";
        setTimeout(function (){
            mainDom.loginPage.style.opacity = "1";
        }, 10);//dom操作太慢了
    },

    closeLoginPage : function (){
        mainDom.loginPage.style.opacity = "0";
        setTimeout(function (){
            mainDom.loginPage.style.display = "none";
        }, 400);//dom操作太慢了
    },
    open_close : function (open, close) {
        addEvent(open, "click", this.openLoginPage);
        addEvent(close, "click", this.closeLoginPage);
    },
    //右上角展示用户名称
    userShow : function (showArea){
        let self = this;
        let S = sessionStorage.getItem("userdata");//获取特征码
        if(S){
            //寻找用户数据
            $.ajax({
                type : 'post',
                url : 'http://vtmer.cn/find',
                data : S,
                success : function(xhr){
                    let data = JSON.parse(xhr);
                    if(xhr){
                        showArea.removeEventListener("click", self.openLoginPage);//解除点击后出现登录弹窗事件
                        showArea.innerHTML = data.ID;
                        showArea.classList.add("fl");

                        // 登出设置
                        var logoutDom = document.createElement('a');
                        logoutDom.classList.add("logout");
                        logoutDom.setAttribute("href", "javascript:;");
                        logoutDom.innerText = "登出";
                        document.querySelector(".user").appendChild(logoutDom);
                        self.addLogout(logoutDom);
                        
                    }else{//没有数据的话显示人头
                        showArea.innerHTML = `<img src="index/images/login.png" alt="">`;
                    }
                },
                error : function(xhr){
                    alert("error");
                }
            });
        }else{
            showArea.innerHTML = `<img src="index/images/login.png" alt="">`;
            return;
        }
    },
    //集结一些登录要用的组件
    loginCol : {
        button : mainDom.submitbtn,
        ID : mainDom.userID,
        PWD : mainDom.userPWD,
        loading : mainDom.loading
    },

    //登录请求函数
    login : function () {
        var self = mainFunction;
        if(self.isWarn()){//如果出现错误直接结束
            return;
        }else{
            self.loginCol.loading.style.display = "block";//加载动画
            setTimeout(function (){
                $.ajax({
                    type:'post',
                    url : 'http://vtmer.cn/login',
                    data: JSON.stringify({"userName" : self.loginCol.ID.value,"userPassword" : self.loginCol.PWD.value}),
                    dataType : 'json',
                    success : function (xhr){
                        self.loginCol.loading.style.display = "none";
                        if(self.isWarn(xhr.statusKey)){//如果出现错误直接结束
                            return;
                        }else{
                            let S = xhr.S;//S类似token，用户特征码                               
                            sessionStorage.setItem("userdata", S);
                            window.location.reload(); //刷新，显示用户名
                        }
                    },
                    error : function (xhr){
                        alert("error");
                    }
                });
            }, 3000);
        }
    },

    // 登录窗口中的事件（点击按钮、回车）
    addLogin : function (){
        var self = this;//保存当前this的值，即mainfun
        addEvent(self.loginCol.button, "click", self.login);
        addEvent(mainDom.userID, "keyup", function(e){
            if(e.keyCode == 13){//绑定回车事件
                self.login();
            }
        });

        addEvent(mainDom.userPWD, "keyup", function(e){
            if(e.keyCode == 13){//绑定回车事件
                self.login();
            }
        });
        
    },

    // 登出
    addLogout : function(outDom){
        var self = this;
        addEvent(outDom, "click", function(){
            mainDom.userShowArea.innerHTML = `<img src="index/images/login.png" alt="">`;
            this.remove();
            window.location.reload();
            addEvent(mainDom.userShowArea,"click",self.openLoginPage);//重新绑定事件
            sessionStorage.removeItem("userdata"); //清除ss里面数据
        });
    },

    //根据后台的提示码提示错误信息
    isWarn :function (statusKey){
        if(mainDom.userID.value == "" || mainDom.userPWD.value == ""){
            mainDom.warn.style.visibility = "visible";
            mainDom.warn.innerHTML = "请输入完整信息";
            return true;
        }else if(statusKey == 1){
            mainDom.warn.style.visibility = "visible";
            mainDom.warn.innerHTML = "账号不存在";
            return true;
        }else if(statusKey == 2){
            mainDom.warn.style.visibility = "visible";
            mainDom.warn.innerHTML = "密码错误";
            return true;
        }
    },


    // 搜索相关
    toSearch : function (){
        var btn = mainDom.searchSub;
        addEvent(btn, "click", function(e){
            var text = this.parentNode.querySelector(".inputText").value,
                inputContent = this.parentNode.querySelector(".inputText");
            if(text){
                getSearchRes(text,mainDom.loading, "search/search.html");
            }
        });

        addEvent(mainDom.inputArea, "keyup", function(e){
            if(e.keyCode == 13){
                var text = mainDom.inputArea.value;
                if(text){
                    getSearchRes(text,mainDom.loading, "search/search.html");
                }
            }
        });

    }

}
mainFunction.init();




