var $win = $(window),
    $body = $('body'),
    $header = $('#header'),
    $speedAnim = 2500,
    $jsSection = $('.js-section'),
    reloadImg, reloadBg, productSliders, $flagFancy;

var loadJS = function(url, implementationCode, location) {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};
successSubmit = function(elem) {
    $flagFancy = true;
    if ($('.fancybox-container').length > 0) {
        parent.jQuery.fancybox.getInstance().close();
    }

    $flagFancy = true;
    $.fancybox.open({
        padding: 0,
        src: '#succsesOrder',

        transitionIn: 'fade',
        transitionOut: 'fade',
        padding: 0,
        margin: 0,
        speedIn: 0,
        speedOut: 0,
        smallBtn: true,
        toolbar: false,
        btnTpl: {
            smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small"><i class="icon-close"></i></button>'
        },
        onInit: function() {

        },
        beforeShow: function() {
            if (!$flagFancy) {
                lockScroll();
            }
        },
        afterClose: function() {

            if (!$flagFancy) {
                unlockScroll();

            }
            $flagFancy = false
        }
    });
    setTimeout(function() {
        $.fancybox.close();
    }, 3000)
}
$(function() {
    var options = {
        light: "light-theme",
        dark: "dark-theme",

        checkSystemScheme: true,
        saveOnToggle: true
    };
    DarkMode = new DarkMode(options);
});
$win.on('load', function() {
    $body.removeClass('loaded');
    $(".js-img").each(function() {
        var $el = $(this);
        $el.attr('src', $el.data("src"));
    });
    reloadImg = function() {
        $(".js-img:not('.loaded')").each(function() {
            var $el = $(this);
            $el.attr('src', $el.data("src")).addClass('loaded');
        });
    }
    reloadImg()
    reloadBg = function() {

        $(".js-bg:not(.loaded)").each(function() {
            var $el = $(this);
            $el.css('background-image', 'url(' + $el.data("preload") + ')').addClass('loaded');
        });
    }
    reloadBg();


    if ($(".js-lazy").length) {
        var lazyLoadInstance = new LazyLoad({
            elements_selector: ".js-lazy"
        });

        if (lazyLoadInstance) {
            lazyLoadInstance.update();
        }
    }

});

$(function() {




    var $flagFix = false;
    var $flagFixO = false,
        y_offsetWhenScrollDisabled, offset;
    var last_known_scroll_position = 0;
    var $fanEl = $('#fan');
    $win.scroll(function() {
        y_offsetWhenScrollDisabled = $win.scrollTop();
        if (y_offsetWhenScrollDisabled > 0) {
            $header.addClass('fixed');
            $flagFix = true;
        } else {
            if (!$body.is('.open-header')) {
                $header.removeClass('fixed');
                $flagFix = false;

            }
        }

        $(".js-lazy-2:not(.loaded)").each(function() {
            var $el = $(this);
            if (y_offsetWhenScrollDisabled + window.innerHeight > $el.offset().top) {

                $el.attr('src', $el.data("src")).addClass('loaded');

            }
        });
        if ($('#progressLine').length > 0) {
            var $offset = (y_offsetWhenScrollDisabled + window.innerHeight)/$(document).height() 
            if ( y_offsetWhenScrollDisabled < window.innerHeight) {
                $offset = y_offsetWhenScrollDisabled /$(document).height()
            }
            $('#progressLine').css({
                'width': $offset * 100 + '%'
            })
        }
        $(".js-lazy:not('.loaded')").each(function() {
            var $el = $(this);
            $el.attr('src', $el.data("src")).addClass('loaded');
        });
    })

    scrollStop(function() {
        setTimeout(function() {
            $body.removeClass('anim-rotate');
        }, 300)

    });

    function scrollStop(callback, refresh = 66) {
        if (!callback || typeof callback !== 'function') return;
        let isScrolling;
        window.addEventListener('scroll', function(event) {

            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(callback, refresh);

        }, false);
    }

    function lockScroll() {
        if ($flagFix) {
            $flagFixO = true;
        }
        offset = y_offsetWhenScrollDisabled;
        $body.addClass('scrollDisabled');

        $('html').css('margin-top', -y_offsetWhenScrollDisabled);
        if ($flagFixO) {
            setTimeout(function() {
                $header.addClass('fixed')
            }, 50);

        }

    }

    function unlockScroll() {
        $body.removeClass('scrollDisabled');
        $('html').css('margin-top', 0);
        $('html, body').animate({
            scrollTop: offset
        }, 0);
    }




    $('.js-button-nav').click(function() {
        var $el = $(this);
        $('body').toggleClass('open-header');
        $('#mainNav').toggleClass('active');
        $('.js-overlay').toggleClass('overlay');
        if ($('body').is('.open-header')) {
            $el.addClass('active');
            lockScroll();
        } else {
            $el.removeClass('active');
            setTimeout(function() {
                unlockScroll();
            }, 400);
        }
        return false;
    });
    $('.js-overlay').on('click', function() {
        if ($('#mainNav').is('.open-header')) {
            $('.js-button-nav').trigger('click')
        }
    });

    if ($body.is('.home')) {
        $("#mainNav").each(function() {
            $(this).singlePageNav({
                offset: $header.outerHeight()
            });
        })
    }
    $('.js-page-nav').on('click', 'a', function(e) {
        if (window.innerWidth < 767 && $body.is('.home')) {
            e.preventDefault();
            e.stopPropagation();
            var $el = $(this),
                $href = $($el.attr('href')),
                $offset = $header.outerHeight();
            $('.js-button-nav').trigger('click');
            $el.removeClass('active');

            $("img.js-lazy:not(.loaded)").each(function() {
                var $el = $(this);

                $el.attr('src', $el.data("src")).addClass('loaded');

            })
            $('.js-page-nav').addClass('scrolled')
            if (!$('.js-page-nav').is('.scrolled')) {

                $('html, body').animate({
                    scrollTop: 1
                }, 0)
            }
            setTimeout(function() {

                $('html, body').animate({
                    scrollTop: $href.offset().top - $offset
                }, {
                    duration: 800,
                    step: (now, fx) => {
                        var realPos = $href.offset().top - $offset
                        if (fx.end !== realPos) {
                            fx.end = realPos;
                        }
                    },
                });

            }, 800)

            return false;


        } else {
            $('.page-nav_clone').find('li').eq($(this).index()).find('a').addClass('current')
            $('.page-nav_clone').find('li').eq($(this).index()).siblings('li').find('a.current').removeClass('current')
        }

    });
    $(document).on('touchstart click', function(e) {
        if ($('#mainNav').is('.active')) {
            if ($(e.target).closest('#mainNav').length > 0 || $(e.target).closest('.js-button-nav').length > 0) {
                return;
            }
            $('.js-button-nav').trigger('click')
        }
    });


    $win.resize(function() {
        if ($('#pageNav').is('.active') && window.innerWidth > 767) {
            $('#pageNav, .js-button-nav').removeClass('active');
            unlockScroll()
        }
    })




    /* placeholder */
    $(".input-cov .form-control").each(function() {
        if ($(this).val() == "") {
            $(this).closest('.input-cov').removeClass("filled");
        } else {
            $(this).closest('.input-cov').addClass("filled");
        }
    });
    $(".input-cov .form-control").focus(function() {
        $(this).closest('.input-cov').addClass("filled");
    });
    $(".input-cov .form-control").blur(function() {
        if ($(this).val() == "") {
            $(this).closest('.input-cov').removeClass("filled");
        }
    });
    /* placeholder*/




    if ($('.js-fancybox').length) {

        $(".js-fancybox").fancybox({
            padding: 0,
            margin: 20,
            animationEffect: 'zoom',
            transitionEffect: "zoom-in-out",
            speed: 350,
            transitionDuration: 300,
            smallBtn: true,
            clickOutside: "close",
            animationEffect: "zoom",
            animationDuration: 366,
            btnTpl: {
                smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small"><i class="icon-close"></i></button>'
            },
            beforeShow: function() {

                lockScroll();
            },
            afterShow: function() {
                if ($(".fancybox-content .js-lazy:not(.loaded)").length) {
                    $(".fancybox-content .js-lazy:not('.loaded')").each(function() {
                        var $el = $(this);
                        $el.attr('src', $el.data("src")).addClass('loaded');
                    });
                }
            },

            beforeClose: function() {

                unlockScroll();
            }
        })
    }




    //  code phone
    var $time2 = 700;
    if ($body.is('.ios')) {
        $time2 = 3000;
    }
    //mask tel


    setTimeout(function() {
        $('.team-item__thumb img').addClass('loaded-el')
    }, $time2)
    // validate form


    $('.js-anchor').on('click', function() {
        var $offset = $($(this).attr('href')).offset().top;
        $('html, body').animate({
            scrollTop: $offset - $header.outerHeight()
        }, 500);
        return false;
    })


        if($('.main-wrap').length) {
         $('.main-wrap').css({
            'min-height': window.innerHeight
        })
$win.on('resize', function() {
       $('.main-wrap').css({
            'min-height': window.innerHeight
        }) 
})
    }
});



var $flagAnim = false 

$win.on('load', function() {


    Splitting();

    if ($('.article').length > 0) {
        Splitting({
            target: ".article h1, .article h2, .article h3",
            /* by: String of the plugin name */
            by: "chars",
            key: null
        });
    }
    setTimeout(function() {

        $('.word-el .char').each(function() {
            setProperty(this, '--char-index2', $(this).index());
        })
    }, 10)
    // scroll animation
    //if(body.classList.contains('ios') && window.innerWidth < 1025) {
    const scrollElements = document.querySelectorAll(".js-scroll, .article h2, .article h1, .article h3");

    const elementInView = (el, dividend = 1) => {
        var bounding = el.getBoundingClientRect();
        var myElementHeight = el.offsetHeight;
        var myElementWidth = el.offsetWidth;



        return (bounding.top >= -myElementHeight &&
            bounding.left >= -myElementWidth &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + myElementWidth &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + myElementHeight)


    };


    const displayScrollElement = (element) => {
        element.classList.add("scrolled");

        if (element.classList.contains("js-scroll-text") && window.innerWidth > 1024) {
            setTimeout(function() {
                if (!$flagAnim && !$('#scrollText').is('.animationg') ) {
                    $('#scrollText').addClass('animationg')
                Start_Animate()
                }
            }, 2900)

        } else {

        }
    };

    const hideScrollElement = (element) => {
        element.classList.remove("scrolled");
        if (element.classList.contains("js-scroll-text") && window.innerWidth > 1024) {

            $("#scrollText").stop().animate({
                scrollTop: 0
            }, 0)
                    $('#scrollText').removeClass('animationg')
        }
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {

                hideScrollElement(el);
            }

        })
    }

    if ($('.section-article').length > 0) {
        handleScrollAnimation();
    }

    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });

});


var applyParallax = function(section) {

    $(section).on('mousemove', function(e) {

        let offX = e.pageX - ($(this).outerWidth() * 0.5);
        let offY = e.pageY - $(this).offset().top - window.scrollY - ($(this).outerHeight() * 0.5);

        let $elem = $(this).find('.js-moving')
        for (let layer of $elem) {
            const speed = 2
            const x = (offX * speed) / 100;
            const y = (offY * speed) / 100;
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`
        }

    });


};


// if ($('.js-parallax-wrap').length) {
//     applyParallax($('.js-parallax-wrap'));
// }



var elH = document.querySelectorAll(".road-map-item");

// START
window.addEventListener("load", init);

function init() {
    setEqualHeights(elH);

}
// SET EQUAL HEIGHTS
function setEqualHeights(el) {
    let counter = 0;
    for (let i = 1; i < el.length; i = i + 2) {

        const singleHeight = el[i].offsetHeight;

        if (counter < singleHeight) {
            counter = singleHeight;
        }
    }

    for (let i = 0; i < el.length; i = i + 2) {
        el[i].style.marginTop = `${counter}px`;
    }

    for (let i = 1; i < el.length; i = i + 2) {
        el[i].style.height = `${counter}px`;
    }
    $('#roadLine').css('top', counter)

}

                $("#scrollText").on('mouseenter', function() {
                    $flagAnim = true;
                    var divTop = document.getElementById("scrollText").scrollTop

                    $("#scrollText").finish()
                     $("#scrollText").animate({
                         scrollTop: divTop
                     }, 0)


                }).on('mouseleave', function() {
                    $flagAnim = false
                    $("#scrollText").removeClass('animationg')
                })

function Start_Animate() {
    div = document.getElementById("scrollText")
    $("#scrollText").stop(false).animate({
        scrollTop: div.scrollHeight
    }, 180500, 'linear')
}
$win.on('load', function() {
    if ($body.is('.web')) {
         const noise = () => {
        let canvas, ctx;

        let wWidth, wHeight;

        let noiseData = [];
        let frame = 0;

        let loopTimeout;


        // Create Noise
        const createNoise = () => {
            const idata = ctx.createImageData(wWidth, wHeight);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;

            for (let i = 0; i < len; i++) {
                if (Math.random() < 0.5) {
                    buffer32[i] = 0xffC9C7C7;
                }
            }

            noiseData.push(idata);
        };


        // Play Noise
        const paintNoise = () => {
            if (frame === 9) {
                frame = 0;
            } else {
                frame++;
            }

            ctx.putImageData(noiseData[frame], 0, 0);
        };


        // Loop
        const loop = () => {
            paintNoise(frame);

            loopTimeout = window.setTimeout(() => {
                window.requestAnimationFrame(loop);
            }, (2000 / 25));
        };


        // Setup
        const setup = () => {
            wWidth = window.innerWidth;
            wHeight = window.innerHeight;

            canvas.width = wWidth;
            canvas.height = wHeight;

            for (let i = 0; i < 10; i++) {
                createNoise();
            }

            loop();
        };


        // Reset
        let resizeThrottle;
        const reset = () => {
            window.addEventListener('resize', () => {
                window.clearTimeout(resizeThrottle);

                resizeThrottle = window.setTimeout(() => {
                    window.clearTimeout(loopTimeout);
                    setup();
                }, 2000);
            }, false);
        };


        // Init
        const init = (() => {
            canvas = document.getElementById('noise');
            ctx = canvas.getContext('2d');

            setup();
        })();
    };

    noise();

    function stars() {
        // stars
        var canvas;
        var context;
        var screenH;
        var screenW;
        var stars = [];
        var fps = 60;
        var numStars = 700;


        // Calculate the screen size
        screenH = $(window).height();
        screenW = $(window).width();

        // Get the canvas
        canvas = $('#space');

        // Fill out the canvas
        canvas.attr('height', screenH);
        canvas.attr('width', screenW);
        context = canvas[0].getContext('2d');

        // Create all the stars
        for (var i = 0; i < numStars; i++) {
            var x = Math.round(Math.random() * screenW);
            var y = Math.round(Math.random() * screenH);
            var length = 1 + Math.random() * 1.8;
            var opacity = Math.random();

            // Create a new star and draw
            var star = new Star(x, y, length, opacity);

            // Add the the stars array
            stars.push(star);
        }

        animateInterval = setInterval(animate, 100 / fps);


        /**
         * Animate the canvas
         */
        function animate() {
            context.clearRect(0, 0, screenW, screenH);
            $.each(stars, function() {
                this.draw(context);
            })
        }

        /* stop Animation */
        function stopAnimation() {
            clearInterval(animateInterval);
        }

        //stopAnimation();

        function Star(x, y, length, opacity) {
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.length = parseInt(length);
            this.opacity = opacity;
            this.factor = 1;
            this.increment = Math.random() * .03;
        }

        Star.prototype.draw = function() {
            context.rotate((Math.PI * 1 / 10));

            // Save the context
            context.save();

            // move into the middle of the canvas, just to make room
            context.translate(this.x, this.y);

            // Change the opacity
            if (this.opacity > 1) {
                this.factor = -1;
            } else if (this.opacity <= 0) {
                this.factor = 1;

                this.x = Math.round(Math.random() * screenW);
                this.y = Math.round(Math.random() * screenH);
            }

            this.opacity += this.increment * this.factor;

            context.beginPath()
            for (var i = 5; i--;) {
                context.lineTo(0, this.length);
                context.translate(0, this.length);
                context.rotate((Math.PI * 2 / 10));
                context.lineTo(0, -this.length);
                context.translate(0, -this.length);
                context.rotate(-(Math.PI * 6 / 10));
            }
            context.lineTo(0, this.length);
            context.closePath();
            context.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
            context.shadowBlur = 5;
            context.shadowColor = '#fff';
            context.fill();

            context.restore();



        }
    }
    if ($('#space').length > 0) {
        stars();
    }

    // // stars
    function stars2() {

        var canvas = document.getElementById('canvas');
        var c = canvas.getContext('2d');

        var innerWidth = window.innerWidth - 20,
            innerHeight = window.innerHeight - 20,
            radius = 1,
            starsIndex = 0,
            stars = [],
            TWO_PI = Math.PI * 2,
            centerX = innerWidth / 2,
            centerY = innerHeight / 2,
            focalLength = 100,
            starRadius = null,
            starX = null,
            starY = null,
            numStars = 1000,
            mouse = {},
            starX_dir = 0,
            starY_dir = 0;

        canvas.width = innerWidth;
        canvas.height = innerHeight;


        // Move the stars with mouse pointer

        window.addEventListener('mousemove', function(e) {
            mouse.x = e.x;
            mouse.y = e.y;

            if (mouse.x < centerX) {
                starX_dir += .5;
            } else {
                starX_dir -= .5;
            }

            if (mouse.y < centerY) {
                starY_dir += .5;
            } else {
                starY_dir -= .5;
            }

        });

        // Zoom in/out into the Space on mouse scroll
        canvas.addEventListener('mousewheel', function(e) {
            if (e.deltaY < 0) {
                focalLength *= .2;
            } else {
                focalLength /= .2;
            }

            if (focalLength >= innerWidth) {
                focalLength = innerWidth - 20;
            } else if (focalLength < 100) {
                focalLength = 100;
            }

        }, false);


        // Function for create new start
        function star(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.radius = radius;
            this.color = "#fff";
            starsIndex++;
            stars[starsIndex] = this;
            this.id = starsIndex;

            // Animate Stars
            this.update = function() {
                starX = (this.x - centerX) * (focalLength / this.z);
                starX += centerX;

                starY = (this.y - centerY) * (focalLength / this.z);
                starY += centerY;

                starRadius = radius * (focalLength * .3 / this.z);

                starX += starX_dir;
                starY += starY_dir;

                this.z += -0.8;

                if (this.z <= 0) {
                    this.z = parseInt(innerWidth);
                }

                this.draw();

            }

            // Function for draw star
            this.draw = function() {
                c.beginPath();
                c.arc(starX, starY, starRadius, TWO_PI, false);
                c.fillStyle = this.color;
                c.fill();
                c.closePath();
            }

        }

        // X,Y,Z values
        var s;
        for (s = 0; s < numStars; s++) {
            x = Math.random() * innerWidth;
            y = Math.random() * innerHeight;
            z = Math.random() * innerWidth;
            new star(x, y, z);
        }

        // Function for animate canvas objects
        function animate() {
            requestAnimationFrame(animate);
            c.fillStyle = "rgba(0,0,0,0)";
            c.clearRect(0, 0, innerWidth, innerHeight);
            c.fillRect(0, 0, innerWidth, innerHeight);

            for (var i in stars) {
                stars[i].update();
            }
        }

        animate();

    }
    if ($('#canvas').length > 0) {
        stars2();
    }




    function stars3() {
        const canvas = document.getElementById("space2");
        const c = canvas.getContext("2d");

        let w;
        let h;

        const setCanvasExtents = () => {
            w = document.body.clientWidth;
            h = document.body.clientHeight;
            canvas.width = Math.min(1600, w);
            canvas.height = Math.min(900, h);
        };

        setCanvasExtents();


        const makeStars = count => {
            const out = [];
            for (let i = 0; i < count; i++) {
                const s = {
                    x: Math.random() * 1600 - 800,
                    y: Math.random() * 900 - 450,
                    z: Math.random() * 1000
                };
                out.push(s);
            }
            return out;
        };

        let stars = makeStars(2000);

        window.onresize = () => {
            setCanvasExtents();
        };

        const clear = () => {
            c.fillStyle = "rgba(0,0,0,0)";
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.fillRect(0, 0, canvas.width, canvas.height);
        };

        const putPixel = (x, y, brightness) => {
            const intensity = brightness * 255;
            const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
            c.fillStyle = rgb;
            c.fillRect(x, y, 1, 1);
        };

        const moveStars = distance => {
            const count = stars.length;
            for (var i = 0; i < count; i++) {
                const s = stars[i];
                s.z -= distance;
                if (s.z <= 1) {
                    s.z += 999;
                }
            }
        };


        const paintStars = () => {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            const count = stars.length;
            for (var i = 0; i < count; i++) {
                const star = stars[i];

                const x = cx + star.x / (star.z * 0.001);
                const y = cy + star.y / (star.z * 0.001);

                if (x < 0 || x >= w || y < 0 || y >= h) {
                    continue;
                }

                const d = star.z / 1000.0;
                const b = 1 - d * d;

                putPixel(x, y, b);
            }
        };

        let prevTime;
        const init = time => {
            prevTime = time;
            requestAnimationFrame(tick);
        };

        const tick = time => {
            let elapsed = time - prevTime;
            prevTime = time;

            moveStars(elapsed * 0.02);



            clear();
            paintStars();

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(init);
    }
    if ($('#space2').length > 0) {
        stars3();
    }   
    }

});