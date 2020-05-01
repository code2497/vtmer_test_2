

var mainDom = {
    rolling: document.querySelector(".showing").querySelector(".rolling"),
    rollingbtn: document.querySelector(".rounds").getElementsByTagName("a"),

    searchSub : document.querySelector(".searchBox").querySelector(".submit"),
    inputArea : document.querySelector(".searchBox").querySelector(".searchContent"),
    loading : document.querySelector(".loading"),

    
};



var mainFunction = {
    

    init: function () {
        var self = this;
        // Object.assign(self, blockFunction);
        this.rollingfunc(this.rolllist);
        this.btnchange(this.rolllist);
        this.hover(this.rolllist);     
        this.toSearch();                                               
        // 动态写入page


        blockFunction.getBlockData();
        setTimeout(function(){
            blockFunction.addBlock();
            blockFunction.addNextPre();
            blockFunction.addPageChange();
            blockFunction.classChange();
            blockFunction.addDetails();
            blockFunction.addCloseDetails();
            blockFunction.addSrcoNext();
        },100);

        
    },


    // 轮
    // 播
    // 图
    // 永
    // 远
    // 滴
    // 神
    rolllist: {
        "rollDom": mainDom.rolling,
        "rollbtn": mainDom.rollingbtn,
        "index": 0,
        "switchKey" : false
    },

    // 轮播图
    rollingfunc: function (rolllist){
        var self = this;
        clearTimeout(rolllist.timer);
            rolllist.timer = setTimeout(function () {
                if(rolllist.index == 3){
                    rolllist.index = 0;
                    rolllist.rollDom.style.transition = "";
                    rolllist.rollDom.style.left = 0;
                }
                setTimeout(function (){
                    
                    self.move_(rolllist.rollDom, rolllist.index + 1,function (){
                        self.rollingfunc(rolllist);
                    });
                    rolllist.index ++;//0, 1, 2, 3
                    self.btnfunc(rolllist);
                    // self.rollingfunc(rolllist);
                }, 20);
            }, 2500);
    },

    move_ : function (Dom, n, fn){
        var self = this;
        Dom.style.transition = "left 0.3s";
        Dom.style.left = (-n * 100) + "%";
        fn && fn();
    },


    // 数据录入(session里面有数据就直接用，没数据就请求后台)
    dataFind : function (){
        if(!sessionStorage.getItem("books")){
            blockFunction.getBlockData();
        }else{
            blockFunction.books = {
                //拿数据、解密、转码、转化json
                data : JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("books")))),
                index : getQueryString("page")?parseInt(getQueryString("page")) : 0,
                class : getQueryString("class")?parseInt(getQueryString("class")) : 0
            };
            if(isNaN(blockFunction.books.class) || blockFunction.books.class == ""){
                blockFunction.books.class = 0;
            }
            blockFunction.books.class = Number(blockFunction.books.class) > blockFunction.books.data.bookclass.length ? 0 : blockFunction.books.class;
            blockFunction.classSimu(blockDom.classli);
        }
    },

    //按钮同步
    btnfunc: function (list){
        for(let i = 0;i < list.rollbtn.length;i ++ ){
            list.rollbtn[i].classList.remove("active");
        }
        if(list.index == 3){
            list.rollbtn[0].classList.add("active");
        }else{
            list.rollbtn[list.index].classList.add("active");
        }
    },

    restart : function (list){
        var self = this;
        clearTimeout(list.timer);
        list.timer = setTimeout(function () {
            if(list.index == 3){
                list.index = 0;
                list.rollDom.style.transition = "";
                list.rollDom.style.left = 0;
            }
            setTimeout(function (){
                self.move_(list.rollDom, list.index + 1,function (){
                    self.rollingfunc(list);
                });
                list.index ++;//0, 1, 2, 3
                // self.rollingfunc(rolllist);
                self.btnfunc(list);
            }, 20);
        }, 2500);
    },

    // 按钮更改事件
    btnchange : function (list){
        var self = this;
        
        for(let i = 0;i < list.rollbtn.length;i ++ ){
            addEvent(list.rollbtn[i], "click", function (){
                list.switchKey = true;
                clearTimeout(list.timer);//清理上次定时器
                if(list.index == list.rollbtn.length&&i == 0){//3和0一样
                    list.index = list.rollbtn.length;
                }else{
                    list.index = i;
                }
                self.move_(list.rollDom, list.index);
                list.switchKey = false;
                self.btnfunc(list);
                self.restart(list);
            });
        }
    },

    hover : function (list){
        var self = this;
        addEvent(list.rollDom, "mouseenter", function (){
            clearTimeout(list.timer);
        });

        addEvent(list.rollDom, "mouseleave", function(){
            self.restart(list);
        });
    },

    toSearch : function (){
        var btn = mainDom.searchSub;
        addEvent(btn, "click", function(e){
            var text = mainDom.inputArea.value;
            if(text){
                getSearchRes(text,mainDom.loading, "../search/search.html");
            }
        });

        addEvent(mainDom.inputArea, "keyup", function(e){
            if(e.keyCode == 13){
                var text = mainDom.inputArea.value;
                getSearchRes(text,mainDom.loading, "../search/search.html");
            }
        });   
    },


    
};

mainFunction.init();