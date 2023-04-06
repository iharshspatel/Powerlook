$(document).ready(function () {
    if ($(window).width() > 767) {
        $(window).on("load resize", function (e) {
            // scrollListing();
        });

        function scrollListing() {
            var divlist = $(".grid-block-product").height();
            var win = $(window).height();

            if (divlist > win) {
                var filterWidth = $('.aside-filter').width();
                var $sticky = $('.sticky-filter');
                var $stickyrStopper = $('.footer-signup');
                var headinHeight = $('.header-main-block').innerHeight();
                if (!!$sticky.offset()) { // make sure ".sticky" element exists

                    var generalSidebarHeight = $sticky.innerHeight();
                    var stickyTop = $sticky.offset().top;
                    var stickOffset = headinHeight;
                    var stickyStopperPosition = $stickyrStopper.offset().top;
                    var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset - 200;
                    var diff = stopPoint + stickOffset;
                    //$('.filter-block').css('width',filterWidth);
                    $(window).scroll(function () { // scroll event
                        var windowTop = $(window).scrollTop(); // returns number

                        if (stopPoint < windowTop) {
                            $sticky.css({ position: 'absolute', top: diff });
                            $sticky.removeClass('fixedfilter')
                            $('.filter-block').css('width', filterWidth);
                        } else if (stickyTop < windowTop + stickOffset + headinHeight - 90) {
                            $sticky.css({ position: 'fixed', top: stickOffset });
                            $sticky.addClass('fixedfilter')
                            $('.filter-block').css('width', filterWidth + 20);
                        } else {
                            $sticky.css({ position: 'absolute', top: 'initial' });
                            $sticky.removeClass('fixedfilter')
                            $('.filter-block').css('width', filterWidth);
                        }
                    });
                }
            }
        }
    }

    $('.nav-hamburger').on('click', function () {
        $(this).closest('.header-main').toggleClass('open').find('nav').slideToggle();
    });

    $('.head-list-block').on('click', function () {
        $(this).parents('.filter-list-block').find('.block-ui').slideToggle(100);
        $(this).parents('.filter-list-block').toggleClass('activeFilter')
    });





    // $('.dismiss-offer').on('click', function(){
    //     $('.top-discount').slideUp(150);

    // });


    // $('.mobile-mUser').on('click', function(){
    //     $('.search-mob').show();
    // });


    // $('.search-close').on('click', function(){
    //     $('.search-mob').hide();
    // });

    // $('.sort-mob-btn').on('click', function(){
    //     $('.modal-bottom').addClass('sortactive');
    //     $('body').addClass('freezbody');
    // });



    // $('.filter-mob-btn').on('click', function(){
    //     $('.aside-filter').addClass('filteractive');
    //     $('body').addClass('freezbody');
    // });
    // $('.cancel-filter').on('click', function(){
    //     $('.aside-filter').removeClass('filteractive');
    //     $('body').removeClass('freezbody');
    // });

    // $('.filter-modal ul a').on('click', function(){
    //     $('.modal-bottom').removeClass('sortactive');
    //     $('body').removeClass('freezbody');
    // });

    // jQuery('body').on('click',function(e) {
    //     if (!jQuery(e.target).is('.filter-modal *,.filter-modal,.sort-mob-btn,.sort-mob-btn *,.filter-mob-btn,.filter-mob-btn *')) {
    //         $('.modal-bottom').removeClass('sortactive');
    //         $('body').removeClass('freezbody');
    //     }
    // });

    // if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    //     jQuery('body').bind('touchstart',function(e) {
    //         if (!jQuery(e.target).is('.filter-modal *,.filter-modal,.sort-mob-btn,.sort-mob-btn *,.filter-mob-btn,.filter-mob-btn *')) {
    //             $('.modal-bottom').removeClass('sortactive');
    //             $('body').removeClass('freezbody');
    //         }
    //     });
    // }

    // $(".selectpicker").selectpicker();

});






// var offset = $('.header-main-block').offset().top;
// $(window).scroll(function() {
//     var headHeight = $('.header-main-block').innerHeight();
//     if ($(this).scrollTop() > offset){  
//         $('.header-main').addClass("sticky");
//         $('.sticky-header').addClass("show-sticky");
//         $('.sticky-header').css('height',headHeight);
//     }
//     else{
//         $('.header-main').removeClass("sticky");
//         $('.sticky-header').removeClass("show-sticky");
//         $('.sticky-header').css('height','0');
//     }
// });


// AOS.init({
//     duration: 600,
//     offset: 50,
//     once: true,
//     disable: false,
// });

// // Disable animation for mobile devices
// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//   AOS.init({
//     disable: true,
//   });
// }



// $('.toggle-info').on('click', function(){
//     $(this).parents('.list-detail').find('.tab-collapse').slideToggle(200);
//     $(this).toggleClass('collapsed');
// });


// $(document).ready(function(){
//   $('.simlar-products').bxSlider({
//     minSlides: 4,
//     maxSlides: 4,
//     moveSlides: 4,
//   });
// });

// if ($(window).width() > 1025) {
//     $(function() {
//       $('.simlar-products').bxSlider({
//         minSlides: 1,
//         maxSlides: 5,
//         slideWidth: 250,
//         slideMargin: 30,
//         moveSlides: 1,
//         nextText: '',
//         prevText: '',
//       });
//     });
// }
// if ($(window).width() < 767) {
//     $('.product-main-slider').bxSlider({
//         minSlides: 1,
//         maxSlides: 1,
//         moveSlides: 1,
//         slideMargin: 0,
//         nextText: '',
//         prevText: '',
//     });
// }


// $(".reviews-block").click(function() {
//     $('html, body').animate({
//         scrollTop: $(".rating-and-comments").offset().top - 80
//     }, 600);
// });


$(window).on("load", function (e) {
    actionbtnFixed();
});

function actionbtnFixed() {
    var offsetTop = $('.action-btn-container').offset();
    var offsetbtn = offsetTop ? offsetTop.top : null;
    var windwHeight = $(window).innerHeight();
    var actionbuttonHeight = $('.product-detail-action').innerHeight();
    setTimeout(function () {
        $('.product-detail-action').addClass('visible');
    }, 500);
    $('.pdp-action-buttons').css('height', actionbuttonHeight);

    if ($(this).scrollTop() > offsetbtn - windwHeight + actionbuttonHeight) {
        $('.product-detail-action').removeClass('fixed');
    }
    else {
        $('.product-detail-action').addClass('fixed');
    }
    $(window).scroll(function () {
        if ($(this).scrollTop() > offsetbtn - windwHeight) {
            $('.product-detail-action').removeClass('fixed');
        }
        else {
            $('.product-detail-action').addClass('fixed');
        }
    });
}



$('.sprites-hamburger').on('click', function () {
    $('.app-nav').addClass('nav--visible');
    $('body').addClass('nav--scroll');
});

jQuery('body').on('click', function (e) {
    if (!jQuery(e.target).is('.sidebar-container *,.sidebar-container,.sprites-hamburger,.sprites-hamburger *')) {
        $('.app-nav').removeClass('nav--visible');
        $('body').removeClass('nav--scroll');
    }
});

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    jQuery('body').bind('touchstart', function (e) {
        if (!jQuery(e.target).is('.sidebar-container *,.sidebar-container,.sprites-hamburger,.sprites-hamburger *')) {
            $('.app-nav').removeClass('nav--visible');
            $('body').removeClass('nav--scroll');
        }
    });
}

$(document).ready(function () {
    $("#lightgallery").lightGallery({
        thumbnail: true,

    });
});

$(".addAddressLink").click(function () {
    $('.addnewaddress-container').addClass('newAddressshow');
    $('html, body').animate({
        scrollTop: $(".addnewaddress-container").offset().top - 90
    }, 300);

});
$(".dismiss-address").click(function () {
    $('.addnewaddress-container').removeClass('newAddressshow');

});

$(".address-block").click(function () {
    $('.address-selected').not(this).removeClass('address-selected').next().addClass('address-selected')
    $(this).parents('.added-address-container').addClass('address-selected');
    if (false == $(this).next().hasClass('address-selected')) {
        $('.added-address-container').removeClass('address-selected');
    }
    $(this).parents('.added-address-container').toggleClass('address-selected');
});