var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var router = express.Router();

/* GET home page. */
var url = 'http://www.mmjpg.com/';
router.get('/', function(req, res) {
    // console.log('111111111')
    var num = '';  //定义一个空变量接受个数
    request(url, function (error, response, body) {
        if(!error && response.statusCode==200){
            // console.log('body:', body);
            res.send('正在分析页面 看看控制台')
            var html = body;
             $ = cheerio.load(html); //当前的$是body相当于jquery选择器
            // 获取一共有多少页
            var page = $('.pic ul li a').eq(0).attr("href");
            // console.log(page)
            num = page.replace(/[^0-9]/ig,"");

        }
        // console.log(num);
        // 定义第二次url
        // 定义一个数组
        var arr = [];
        for(var i = 0;i<num;i++){
          var url2 = 'http://www.mmjpg.com/mm/'+i+'';
          // console.log(url2);
          arr.push(url2);
        }
        // console.log(arr);
        var length = arr.length;
        console.log(length)
        // 设置图片详情的url地址
        function postFun(i){
            if(i >= length){
				return;
			}
            var currParam = arr[i];
            request('http://www.mmjpg.com/mm/'+i+'', function (error, response, body) {
                if(!error && response.statusCode==200){
                        var html = body;
                        $ = cheerio.load(html); //当前的$是body相当于jquery选择器
                        // 获取图片的名字
                        var title = $('.article h2').text();
                         // console.log('第'+i+'个妹子地址标题：'+title+'已经加载好');
                        // 获取该妹子有多少图片
                        var number = $('#page a').eq(6).text();
                        // console.log(number)
                        // 获取图片地址
                        var imgurl = $('#content a img').eq(0).attr('src');
                        // 获取目录地址
                        var arr = imgurl.split("/");
                        delete arr[arr.length-1];
                        var dir = arr.join("/");
                        // console.log(imgurl)
                        function add(){
                            for(var j = 1;j<number;j++){
                                var img = ''+dir+''+j+'.jpg';
                                // console.log(img)
                                var img_filename = ''+j+'.jpg';
                                // console.log(img_filename)
                                // console.log(title)

                                console.log('页面'+i+''+title+''+j+'张图片正在下载----------------0%')
                                request(img).pipe(fs.createWriteStream('./img/'+title+ '---' + img_filename));

                                console.log(title+''+j+'下载完成---------------------------100%')

                            }
                        }

                        add();

                    setTimeout(function(){postFun(i + 1)},5000);
                }
            });
            // console.log('aaaaaaaaaaaaa')
        };
		
		postFun(981);

		
    });
});
module.exports = router;
