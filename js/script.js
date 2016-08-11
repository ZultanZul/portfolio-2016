
$('body').imagesLoaded()
    .always( function( instance ) {
        console.log('all images loaded');
    })
    .done( function( instance ) {
        console.log('all images successfully loaded');
        $('body').addClass('loaded');

    })
    .fail( function() {
        console.log('all images loaded, at least one is broken');
    })
    .progress( function( instance, image ) {
        var result = image.isLoaded ? 'loaded' : 'broken';
        console.log( 'image is ' + result + ' for ' + image.img.src );
    });

$(".head-scroller").textrotator({
    animation: "fade",
    separator: ",",
    speed: 2000
});

$('nav#nav a').smoothScroll({
    speed: 900,
    easing: 'swing'
});
