var blockDom = {
    blockArea : document.querySelector(".body").querySelector(".main").querySelector(".show"),
    blockCol : document.querySelector(".body").querySelector(".show").getElementsByClassName("block"),
    nextbtn : document.querySelector(".body").querySelector(".main").querySelector(".right"),
    prebtn : document.querySelector(".body").querySelector(".main").querySelector(".left"),
    pagesArea : document.querySelector(".body").querySelector(".main").querySelector(".number").querySelector("ul"),
    totalArea : document.querySelector(".body").querySelector(".main").querySelector(".changePage").querySelector(".total"),
    numberli : document.querySelector(".body").querySelector(".main").querySelector(".number").getElementsByTagName("li"),
    classli : document.querySelector(".body").querySelector(".classNav") == null ? null : document.querySelector(".body").querySelector(".classNav").getElementsByTagName("li"),
    detailsWin : document.querySelector(".mainbg").querySelector(".details"),
    detailsContent : document.querySelector(".mainbg").querySelector(".details").querySelector(".content"),
    detalisClose : document.querySelector(".mainbg").querySelector(".details").querySelector(".close").querySelector("img"),
    ScroNext : document.querySelector(".body").querySelector(".scroNext"),
    changeLoadStr : `<div class="changeLoad"></div>`
};


var blockFunction = {
    // 动态写入block
    //后台获取书籍资料并存进session中
    books : {
        data : null,
        index : getQueryString("page")?parseInt(getQueryString("page")) : 0,
        class : 0
    },


    //向后台请求数据
    getBlockData : function (){
        var self = this;
            $.ajax({
                'url' :"http://vtmer.cn/class",
                'dataType' : 'json',
                success : function (xhr) { 
                    console.log(xhr);
                    let datastr = JSON.stringify(xhr);
                    let data = btoa(encodeURI(datastr));
                    sessionStorage.removeItem("books");
                    sessionStorage.setItem("books", data);
                    //对称加密，存入ss
                    self.books = {
                        //拿数据、解密、转码、转化json
                        data : JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("books")))),
                        index : getQueryString("page")?parseInt(getQueryString("page")) : 0,
                        class : getQueryString("class")?parseInt(getQueryString("class")) : 0
                    };
                    if(isNaN(self.books.class) || self.books.class == ""){
                        self.books.class = 0;
                    }
                    self.books.class = Number(self.books.class) > self.books.data.bookclass.length ? 0 : self.books.class;
                    self.classSimu(blockDom.classli);
                },
                error : function (xhr){
                    console.log(xhr.status);
                }
            });
        
    },

    // 滚动条式下一页
    addSrcoNext : function(){
        var next = blockDom.ScroNext;
        var self = this,
            oblock = blockDom.blockCol[0].cloneNode(true);
            self.blockAreaReset();
        addEvent(next, "click", function () {
            this.innerText = "加载中";
            blockDom.blockArea.style.height = "auto";//让父容器能被撑开
            blockFunction.books.index++;

            //判断内容是否只有一页
            if(self.books.index == self.books.pages - 1){
                this.style.display = "none";
            }
            var info = self.books.class == "s" ?  self.books.data : self.books.data.bookclass[self.books.class].bookInfo;
            for(let i = self.books.index * 8, j = 0;i < (self.books.index*8) + 8;i ++ , j++){
                oblock = blockDom.blockCol[0].cloneNode(true);
                blockDom.blockArea.appendChild(oblock);//复制第一个block，插入后再进行内容修改
                self.addBlockSingle(self.books, i, info, oblock);
            }

            // 隐藏占满一行的null
            var nullDomCol = document.querySelector(".body").getElementsByClassName("null");
            
            if(nullDomCol){
                if(nullDomCol.length >= 4){
                    //6个 5 4 3 2
                    for(let j = nullDomCol.length - 1;j > nullDomCol.length - 5;j --){
                        nullDomCol[j].style.display = "none";
                    }
                }
            }
            self.addDetails();//给新增加的block绑定上详情窗事件
            this.innerText = "下一页";
            self.dynPages();//不用重载页面，所以不用pageChangeAct();
        });
    },


    //单次写入block
    addBlockSingle : function (books, bookIndex, bookInfo, oblock){
        var block, cover, scores;
        var n = bookIndex % 8;
        var tempcover = document.createElement("img");
        if(bookInfo[bookIndex]){
            blockDom.blockArea.id = books.class;
            block = oblock?oblock : blockDom.blockCol[n];
            block.setAttribute("id", bookIndex);
            cover = block.querySelector("a").querySelector("img");
            scores = block.querySelector(".scores").querySelector("ul");
            //被加了null就去除null
            block.classList.contains("null")&&block.classList.remove("null");
            // block.style.display = "block";
            
            tempcover.setAttribute("src", bookInfo[bookIndex].cover);
            if(!tempcover.complete){
                cover.setAttribute("src", "../globe_images/cover.png");
            }
            tempcover.onload = function (){
                cover.setAttribute("src", bookInfo[bookIndex].cover);
            }
            
            // cover.setAttribute("id", bookIndex);
            scores.style.width = (bookInfo[bookIndex].socre * 24) + "px";
            block.querySelector("h2").innerHTML = bookInfo[bookIndex].title;
            block.querySelector("h3").innerHTML = bookInfo[bookIndex].author;
        }else{
            if(oblock){
                oblock.setAttribute("class", "null block");
                oblock.removeAttribute("id");
            }else{
                block = blockDom.blockArea.children;
                block[n].setAttribute("class", "null block");
                block[n].removeAttribute("id");
            }
        }
    },


    // 取数据依次写入block
    addBlock : function (books){
        // books.area.innerHTML = "";//清除先前内容
        var self = this;
        // 如果有传进来的books就用
        books && (self.books = books);
        var info = self.books.class == "s" ?  self.books.data : self.books.data.bookclass[self.books.class].bookInfo;
        self.getPages(info);
        for(let i = self.books.index * 8, j = 0;i < (self.books.index*8) + 8;i ++ , j++){
            self.addBlockSingle(self.books, i, info);
        }
    },

    //下一页、上一页
    addNextPre : function (books){
        var self = this;
        var liCol = blockDom.numberli;
        addEvent(blockDom.nextbtn, "click", function (){
            
            if(self.books.index == self.books.pages-1){
                alert("到顶了");
                return;
            }
            self.books.index++;
            self.blockAreaReset(8);
            self.addBlock(self.books);
            self.pageChangeAct();
        });
        addEvent(blockDom.prebtn, "click", function (){
            if(self.books.index == 0){
                alert("到头了");
                return;
            }
            self.books.index--;
            self.blockAreaReset(8);
            self.addBlock(self.books);
            self.pageChangeAct();
        });
    },
    
    //获取总页数并写入
    getPages : function (info){
        blockDom.pagesArea.innerHTML = "";
        let self = this;
        let length = info.length;
        let allCounts = Math.ceil(length / 8);
        self.books.pages = allCounts;
        if(self.books.index > self.books.pages || isNaN(self.books.index)){
            self.books.index = 0;
        }
        let listr = "";
        blockDom.totalArea.innerHTML = "共 " + allCounts + " 页";
        if(allCounts <= 9){
            for(let i = 0;i < allCounts;i ++ ){
                if(i == 0){
                    listr = `<li class="btn${1} fl">1</li>`;
                }else{
                    listr = `<li class="btn${i + 1} fl">${i + 1}</li>`;
                }
                blockDom.pagesArea.innerHTML += listr;
            }
        }else{
            var numStr = "",
                numCol;
            for(let i = 0;i < 9;i ++){
                if(i == 0){
                    numStr = `<li class="btn${1} active fl">1</li>`;
                }else if(i == 8){
                    numStr = `<li class="btn${i + 1} fl">${allCounts}</li>`;
                }else{
                    numStr = `<li class="btn${i + 1} fl">${i + 1}</li>`;
                }
                blockDom.pagesArea.innerHTML += numStr;
            }
            numCol = blockDom.numberli;
            numCol[7].innerHTML = "...";
            numCol[7].classList.replace("btn8", "point");
        }
        
        self.dynPages();
    },

    //数字按钮切换页面
    addPageChange : function (books){
        var liCol = blockDom.numberli;
        var self = this;
        for(let i = 0; i < liCol.length; i ++){
            addEvent(liCol[i], "click", function(){
                // 排除点的情况
                if(!isNaN(this.innerText)){
                    //不要用i，因为i已经不是跟页数一一匹配
                    var target = this.innerText - 1;
                    self.numberTrans(liCol, i);
                    self.books.index = target;
                    self.pageChangeAct();
                }
            });
        }
    },

    // 更改页数后的动作（删除多余的block、动态显示页数、加载层显示、跳转）
    pageChangeAct : function (){
        var self = this;
        document.querySelector(".body").innerHTML += blockDom.changeLoadStr;
        setTimeout(()=>{
            //重置为八个block
            self.blockAreaReset(8);
            // self.addBlock(self.books);跳转了页面可以不用addblock
            self.dynPages();
            var newUrl =  updateQueryString(window.location.href, "page", self.books.index);
            window.location.href = newUrl;
        }, 200);
    },

    // 数字按钮同步
    numberTrans : function (liCol, n){
        if(liCol){
            for(let j = 0;j < liCol.length; j ++ ){
                liCol[j].classList.remove("active");
            }
            liCol[n].classList.add("active");
        }
    },

    

    // 数字区域动态展示，打点、取消打点、激活按钮更改
    dynPages : function (){
        if(this.books.pages > 9){
            var cur = this.books.index,
            numCol = blockDom.numberli,
            trueNum = cur + 1;//books.index从0开始数数
            if(cur < 4){
                //第1,2,3,4个按钮被激活时隐藏第一个省略号
                numCol[1].innerHTML = 2;
                numCol[1].classList.replace("point", "btn2");
                numCol[7].innerHTML = "...";
                numCol[7].classList.replace("btn7", "point");
                for(let i = 2;i < 7;i ++){//复位第3，4，5，6，7个按钮的数值
                    numCol[i].innerHTML = i + 1;
                }
                this.numberTrans(numCol, cur);
            }else if(cur >= 4 && cur < this.books.pages - 4){
                // 第二个、倒数第二个按钮要打点
                numCol[1].innerHTML = "...";
                numCol[7].innerHTML = "...";
                numCol[1].classList.replace("btn2", "point");
                numCol[7].classList.replace("btn8", "point");
                // 只让中间的按钮显示激活状态
                this.numberTrans(numCol, 4);
                numCol[4].innerHTML = trueNum;
                // 暴力改
                numCol[3].innerHTML = trueNum - 1;
                numCol[2].innerHTML = trueNum - 2;
                numCol[5].innerHTML = trueNum + 1;
                numCol[6].innerHTML = trueNum + 2;
            }else if(cur >= this.books.pages - 4){
                numCol[7].classList.replace("point", "btn8");
                numCol[7].innerHTML = this.books.pages - 1;
                numCol[1].innerHTML = "...";
                numCol[1].classList.replace("btn2", "point");
                for(let i = 6, j = 2;i >= 2;i --, j ++){//7, 6, 5, 4, 3
                    numCol[i].innerHTML = this.books.pages - j;
                }
                cur == this.books.pages - 4?this.numberTrans(numCol, 5):this.numberTrans(numCol , 8-(this.books.pages-trueNum));
            }
        }else{
            numCol ? numCol : numCol = document.querySelector(".body").querySelector(".main").querySelector(".number").getElementsByTagName("li");
            this.numberTrans(numCol, this.books.index);
        }
        
    },


    // 类别转换
    classChange : function(){
        if(blockDom.classli){
            var self = this;
            var len = blockDom.classli.length;
            for(let i = 0;i < len;i ++){
                if(!blockDom.classli[i].classList.contains("active")){
                    blockDom.classli[i].index = i;
                    addEvent(blockDom.classli[i], "click", foo);
                }
            }

            function foo() { 
                self.books.class = blockDom.classli[this.index].index;
                self.classSimu(blockDom.classli);
                //修改books对象中的种类索引
                self.books.index = 0;
                self.blockAreaReset(8);
                self.addBlock(self.books);
                self.addPageChange(self.books);
                var tempUrl = updateQueryString(window.location.href, "class", this.index);
                var newUrl = updateQueryString(tempUrl, "page", 0);
                window.history.replaceState(null, null, newUrl);
                for(let i = 0;i < len;i ++){
                    if(!blockDom.classli[i].classList.contains("active")){
                        blockDom.classli[i].index = i;
                        addEvent(blockDom.classli[i], "click", foo);
                    }
                }
                // window.location.href = newUrl;
            }
        }
    },

    //重置 删除点击“下一页”产生的多余的block
    blockAreaReset : function (resetTarget){
        var self = this;
        var blockLen = blockDom.blockCol.length;
        blockDom.ScroNext.style.display = "block";
        if(self.books.index == self.books.pages - 1){
            blockDom.ScroNext.style.display = "none";
        }
        if(blockLen > resetTarget){
            for(let i = blockLen - 1;i > resetTarget - 1;i--){
                //15 14 13 12 11 10 9 8
                blockDom.blockCol[i].remove();
            }
        }
    },

    // 类别按钮同步
    classSimu : function(liCol){
        if(liCol){
            var self = this;
            var len = liCol.length;
            for(j = 0;j < len;j ++){
                if(j != self.books.class )
                liCol[j].classList.remove("active");
            }
            liCol[self.books.class].classList.add("active");
        }
        
    },

    // 详情页
    addDetails : function (scrollPostion){
        var blockCol = document.querySelector(".body").getElementsByClassName("block");
        var self = this;
        var eventBox = null;
        var infoCol = null;
        var liCol = blockDom.detailsWin.querySelector(".basedata").getElementsByTagName("li");
        infoCol = {
            title : blockDom.detailsWin.querySelector(".basedata").querySelector("h3"),
            author : liCol[0].querySelector(".text"),
            publish : liCol[1].querySelector(".text"),
            time : liCol[2].querySelector(".text"),
            lib : liCol[3].querySelector(".textBox").getElementsByTagName("div"),
            kejin : liCol[4],
            buyonline : liCol[5],
            cover : blockDom.detailsWin.querySelector(".cover"),
            authorIntro : blockDom.detailsWin.querySelector(".writerIntro").querySelector("p"),
            bookIntro : blockDom.detailsWin.querySelector(".bookIntro").querySelector("p")
        };

        for(let i = 0;i < blockCol.length;i ++ ){
            eventBox = blockCol[i].querySelector("a");
            addEvent(eventBox, "click", function (e){
                var content = blockDom.detailsWin.children[0];
                //动画设置
                blockDom.detailsWin.style.transition = "opacity 0.5s";
                blockDom.detailsWin.style.display = "block";
                //需要在display:block后面设置延迟才会触发transition
                // scrollMove(document.body.offsetHeight * 0.3);
                

                setTimeout(function () { 
                    blockDom.detailsWin.style.opacity = "1";
                    content.style.transition = "opacity 0.5s, width 0.5s, max-height 0.5s ease 0.5s";
                    content.style.display = "block";
                    setTimeout(function(){
                        content.style.top = blockCol[i].offsetTop - 50 + "px";
                        if(parseInt(content.style.top) < 54){
                            content.style.top = 54 + "px"
                        }
                        content.style.width = "1060px";
                        content.style.maxHeight = "2000px";
                    }, 100);
                }, 100);

                // 数据写入
                
                
                var blockIndex = e.target.parentNode.parentNode.id;
                
                var Binfo =  self.books.class == "s" ?  self.books.data[blockIndex] : self.books.data.bookclass[self.books.class].bookInfo[blockIndex] ;
                infoCol.title.innerText = Binfo.title;
                infoCol.author.innerText = Binfo.author;
                infoCol.publish.innerText = getData(Binfo.publish);
                infoCol.time.innerText = getData(Binfo.publishDate);

                infoCol.cover.setAttribute("src", Binfo.cover);

                infoCol.lib[0].innerText = Binfo.library[0].total ? Binfo.library[0].total + "本" : "待更新";
                infoCol.lib[1].innerText = getData(Binfo.library[0].position);
                // infoCol.author = Binfo[blockIndex].author;
                // infoCol.author = Binfo[blockIndex].author;
                infoCol.authorIntro.innerText = Binfo.ahthorIntro;
                infoCol.bookIntro.innerText = Binfo.bookIntro;
                function getData(data) { 
                    return data ? data : "待更新";
                }

                infoCol.kejin.innerHTML = `<span class="icon"></span>
                | `;

                infoCol.buyonline.innerHTML = `<span class="icon"></span>
                | `;
                for(var prop in Binfo.bookUrl[0]){
                    var tempDom = `<a href="${Binfo.bookUrl[0][prop]}" class="${prop}"></a>`
                    infoCol.kejin.innerHTML += tempDom;
                }
                for(var prop in Binfo.buyUrl[0]){
                    var tempDom = `<a href="${Binfo.buyUrl[0][prop]}" class=" ${prop}"></a>`
                    infoCol.buyonline.innerHTML += tempDom;
                }

            });
        }
    },

    // 关闭详情
    addCloseDetails : function () {
        addEvent(blockDom.detalisClose, "click", function(){
            blockDom.detailsWin.style.opacity = 0;
            var content = blockDom.detailsWin.children[0];
            setTimeout(function (){
                blockDom.detailsWin.style.display = "none";
                content.style.width = "110px";
                content.style.maxHeight = "400px";
            }, 500);
        });

        addEvent(blockDom.detailsWin, "click", function(e){
            //点击背景图也能关闭
            if(e.target.classList.contains("details")){
                blockDom.detailsWin.style.opacity = 0;
                var content = blockDom.detailsWin.children[0];
                setTimeout(function (){                  
                    blockDom.detailsWin.style.display = "none";
                    content.style.width = "110px";
                    content.style.maxHeight = "400px";
                }, 500);
            }
        });
    }
}