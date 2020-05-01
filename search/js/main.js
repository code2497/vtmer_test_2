var mainDom = {
    searchItem : document.querySelector(".bannerbg").querySelector(".item").querySelector("span"),
    main : document.querySelector(".mainbg"),
    topSearchbtn : document.querySelector(".upper").querySelector(".searchBox").querySelector(".submit"),
    searchContent : document.querySelector(".upper").querySelector(".searchBox").querySelector(".searchContent"),
    loading : document.querySelector(".loading"),
    cate : document.querySelector(".header").querySelector(".cate"),
    notfind : document.querySelector(".notfind"),
    title : document.querySelector("title")
};


var mainFunction = {
    init : function (){
        var self = this;
        self.searchItem.show();
        self.searchInit();
        setTimeout(function (){
            self.innerSearch();
            self.addMenu();
        }, 50);
    },

    //显示搜索内容
    searchItem : {
        show : function (){
            mainDom.searchItem.innerText = decodeURIComponent(this.text);//中文好像要解码
            mainDom.title.innerText = `推书搜索_${mainDom.searchItem.innerText }`;
        },
        text : getQueryString("search") || "全部内容"
    },

    //拿搜索到的数据
    results : {
        data : JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("books")))).data,
        index : getQueryString("page")?parseInt(getQueryString("page")) : 0,
        class : "s"
    },

    // 初始化动作，如果搜到就显示结果，没搜到就显示所有数据
    searchInit : function(){
        var self = this;
        if(self.results.data.length == 0){
            //显示的不是self.results.data，而是重新获取后台的数据
            mainDom.notfind.style.display = "block";
            $.ajax({
                data : 0,
                url : "http://vtmer.cn/search",
                success : function (xhr){
                    self.results.data = JSON.parse(xhr).bookclass[0].bookInfo;
                    blockFunction.addBlock(self.results);
                    blockFunction.addNextPre();
                    blockFunction.addPageChange();
                    blockFunction.addSrcoNext();
                    blockFunction.addDetails();
                    blockFunction.addCloseDetails();
                    console.log(xhr);

                },
            });
        }else{
            blockFunction.addBlock(self.results);
            blockFunction.addNextPre();
            blockFunction.addPageChange();
            blockFunction.addSrcoNext();
            blockFunction.addDetails();
            blockFunction.addCloseDetails();
        }
        setTimeout(function (){
            self.innerSearch();
            self.addMenu();
        }, 50);
    },

    //给本页面的搜索框绑定事件
    innerSearch : function (){
        var self = this,
            input = document.querySelector(".upper").querySelector(".searchBox").querySelector(".searchContent"),
            text,
            loading = document.querySelector(".loading"),
            btn = document.querySelector(".upper").querySelector(".searchBox").querySelector(".submit");

            // 基本跟index转到搜索页处的差不多
            addEvent(btn, "click", function(e){
                text = input.value;
                getSearchRes(text,loading, "../search/search.html");
            });
            addEvent(input, "keyup", function(e){
                if(e.keyCode == 13){
                    text = input.value;
                    getSearchRes(text,loading, "../search/search.html");
                }
            });
    },


    // 二级菜单设置
    addMenu : function (){
        var menu = document.querySelector(".header").querySelector(".cate").querySelector("ul"),
            cate = document.querySelector(".header").querySelector(".cate");
        addEvent(cate, "mouseenter", function(){
            menu.style.display = "block";
            // block之后要过一小会再控制动画
            setTimeout(function (){
                menu.style.maxHeight = "200px";
            }, 100);
            
            addEvent(cate, "mouseleave", function(){
                setTimeout(function(){
                    menu.style.maxHeight = "0px";
                }, 100);
                //可以不用display:none，设置了反而会鬼畜控制不好时间
            });
        });
        
    }

};

mainFunction.init();