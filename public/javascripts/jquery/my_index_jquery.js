/* Homepage */

$(document).ready(function(){
    
    // Scroll images right
    $('#arrow_right').click(function(){

        event.preventDefault();

        // Grab reference to the position of the scroll and increase it's value
        var scroll = $('#popular_books_placeholder').scrollLeft();
        scroll += 290;

        // Apply the new value using animation
        $('#popular_books_placeholder').animate({scrollLeft: scroll},200);
    });
    

    // Scroll images left
    $('#arrow_left').click(function(){

        event.preventDefault();

        // Grab reference to the position of the scroll and increase it's value
        var scroll = $('#popular_books_placeholder').scrollLeft();
        scroll -= 290;

        // Apply the new value using animation
        $('#popular_books_placeholder').animate({scrollLeft: scroll},200);
    });


    // Toggle window body
    $('a.toggle_button').click(function(){

        event.preventDefault();

        // Grab reference to the window and the button
        var window = $(this).parents('.window');
        var toggleButton = $(this);

        // Toggle the window body
        window
        .children('div.window_body')
        .toggle();

        // Change the button arrow direction
        if(toggleButton.text() === 'keyboard_arrow_up'){
            toggleButton.text('keyboard_arrow_down');
        }else{
            toggleButton.text('keyboard_arrow_up');
        };
        
    });

});