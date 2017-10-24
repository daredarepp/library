/* Homepage */

$(document).ready(function(){

    // Scroll images right

    $('#arrow_right').click(function(){
        event.preventDefault();
        let scroll = $('#preview_books').scrollLeft();
        scroll += 290;
        $('#preview_books').animate({scrollLeft: scroll},200);
    });
    
    // Scroll images left

    $('#arrow_left').click(function(){
        event.preventDefault();
        let scroll = $('#preview_books').scrollLeft();
        scroll -= 290;
        $('#preview_books').animate({scrollLeft: scroll},200);
    });

    // Show/Hide window body
    $('a.show_hide_button').click(function(){

        event.preventDefault();

        var window = $(this).parents('.window');
        var button = $(this);

        // Toggle the window body
        window
        .children('div.window_body')
        .toggle();

        // Change the arrow direction
        if(button.text() === 'keyboard_arrow_up'){
            button.text('keyboard_arrow_down');
        }else{
            button.text('keyboard_arrow_up');
        };
        
    })

});