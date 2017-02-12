/**
 * Created by Administrator on 2015/12/13.
 */
//canvas背景绘制
$(function(){
    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = .3;
    ctx.strokeStyle = (new Color(150)).style;

    var mousePosition = {
        x: 30 * canvas.width / 100,
        y: 30 * canvas.height / 100
    };

    var dots = {
        nb: 250,
        distance: 100,
        d_radius: 150,
        array: []
    };

    function colorValue(min) {
        return Math.floor(Math.random() * 255 + min);
    }

    function createColorStyle(r,g,b) {
        return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
    }

    function mixComponents(comp1, weight1, comp2, weight2) {
        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }

    function averageColorStyles(dot1, dot2) {
        var color1 = dot1.color,
            color2 = dot2.color;

        var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
            g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
            b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
        return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    }

    function Color(min) {
        min = min || 0;
        this.r = colorValue(min);
        this.g = colorValue(min);
        this.b = colorValue(min);
        this.style = createColorStyle(this.r, this.g, this.b);
    }

    function Dot(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();

        this.radius = Math.random() * 2;

        this.color = new Color();
        console.log(this);
    }

    Dot.prototype = {
        draw: function(){
            ctx.beginPath();
            ctx.fillStyle = this.color.style;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        }
    };

    function createDots(){
        for(i = 0; i < dots.nb; i++){
            dots.array.push(new Dot());
        }
    }

    function moveDots() {
        for(i = 0; i < dots.nb; i++){

            var dot = dots.array[i];

            if(dot.y < 0 || dot.y > canvas.height){
                dot.vx = dot.vx;
                dot.vy = - dot.vy;
            }
            else if(dot.x < 0 || dot.x > canvas.width){
                dot.vx = - dot.vx;
                dot.vy = dot.vy;
            }
            dot.x += dot.vx;
            dot.y += dot.vy;
        }
    }

    function connectDots() {
        for(i = 0; i < dots.nb; i++){
            for(j = 0; j < dots.nb; j++){
                i_dot = dots.array[i];
                j_dot = dots.array[j];

                if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
                    if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
                        ctx.beginPath();
                        ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
                        ctx.moveTo(i_dot.x, i_dot.y);
                        ctx.lineTo(j_dot.x, j_dot.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }
    }

    function drawDots() {
        for(i = 0; i < dots.nb; i++){
            var dot = dots.array[i];
            dot.draw();
        }
    }

    function animateDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveDots();
        connectDots();
        drawDots();

        requestAnimationFrame(animateDots);
    }

    $('canvas').on('mousemove', function(e){
        mousePosition.x = e.pageX;
        mousePosition.y = e.pageY;
    });

    $('canvas').on('mouseleave', function(e){
        mousePosition.x = canvas.width / 2;
        mousePosition.y = canvas.height / 2;
    });

    createDots();
    requestAnimationFrame(animateDots);
});

//透明遮罩层
$(function () {
    $("#media li").hover(function (e) {

        var _this  = $(this), //闭包
            _desc  = _this.find(".desc"),
            width  = _this.width(), //取得元素宽
            height = _this.height(), //取得元素高
            left   = e.offsetX || e.originalEvent.layerX, //得到左边界
            top    = e.offsetY || e.originalEvent.layerY, //得到上边界
            right  = width - left, //计算出右边界
            bottom = height - top, //计算出下边界
            rect   = {}, //坐标对象，用于执行对应方法。
            _min   = Math.min(left, top, right, bottom), //得到最小值
            _out   = e.type == "mouseleave", //是否是离开事件
            spos   = {}; //起始位置


        rect[left] = function (epos) { //鼠从标左侧进入和离开事件
            spos = {"left": -width, "top": 0};
            if (_out) {
                _desc.animate(spos, "normal"); //从左侧离开
            } else {
                _desc.css(spos).animate(epos, "normal"); //从左侧进入
            }
        };

        rect[top] = function (epos) { //鼠从标上边界进入和离开事件
            spos = {"top": -height, "left": 0};
            if (_out) {
                _desc.animate(spos, "normal"); //从上面离开
            } else {
                _desc.css(spos).animate(epos, "normal"); //从上面进入
            }
        };

        rect[right] = function (epos) { //鼠从标右侧进入和离开事件
            spos = {"left": '100%',"top": 0};
            if (_out) {
                _desc.animate(spos, "normal"); //从右侧成离开
            } else {
                _desc.css(spos).animate(epos, "normal"); //从右侧进入
            }
        };

        rect[bottom] = function (epos) { //鼠从标下边界进入和离开事件
            spos = {"top": height, "left": 0};
            if (_out) {
                _desc.animate(spos, "normal"); //从底部离开
            } else {
                _desc.css(spos).animate(epos, "normal"); //从底部进入
            }
        };

        rect[_min]({"left":0, "top":0}); // 执行对应边界 进入/离开 的方法
    });


});
