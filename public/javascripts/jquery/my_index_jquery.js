$(document).ready(function(){

    // Scroll images right

    $('#arrow_right').click(function(){
        event.preventDefault();
        let scroll = $('#preview_images').scrollLeft();
        scroll += 285;
        $('#preview_images').animate({scrollLeft: scroll},200);
    });
    
    // Scroll images left

    $('#arrow_left').click(function(){
        event.preventDefault();
        let scroll = $('#preview_images').scrollLeft();
        scroll -= 285;
        $('#preview_images').animate({scrollLeft: scroll},200);
    });

});