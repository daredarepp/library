/* Catalog page */

$(document).ready(function(){

    // When clicking a selection link
    $('a.selection').click(function(){
            
        open($(this).parent().attr('id'));
    });
    
    // Open selected window
    function open(current) {
        
        event.preventDefault();

        // Hide the selection link from the window
        var link = $(`div#${current} a.selection`);
        link.toggle();

        // Hide the other windows
        var otherWindows = $('.window').not(`#${current}`);
        otherWindows.toggle();

        // Customize the current window
        var window = $(`div#${current}`);

        var previousClass = window.attr('class');
        var newClass = `col-md-8 col-md-offset-2 window`

        var windowHeading = $('<h2></h2>')
        .addClass('window_heading')
        .html(link.html());

        var windowCloseButton = $('<a></a>')
        .attr({'href':'#', 'id':'close_button'})
        .addClass('material-icons')
        .text('close');

        var windowBody = $('<div></div>')
        .addClass('window_body')
        .css('text-align','left');

        window
        .removeClass(previousClass)
        .addClass(newClass)
        .append(windowHeading)
        .append(windowCloseButton)
        .append(windowBody);

        // Fill the window body with data 
        $.get(link.attr('href'), function(data, status){
            
            if(status === 'error'){
                windowBody.text('Sorry, something went wrong.');
                return;
            };
            
            var finalData = JSON.stringify(data);
            windowBody.text(finalData);
        });
        
        // When clicking the close button
        windowCloseButton.click(function(){
            
            event.preventDefault();
            
            // Undo everything
            windowHeading.remove();
            windowCloseButton.remove();
            windowBody.remove();
            window.removeClass(newClass);
            window.addClass(previousClass);
            link.toggle();
            otherWindows.toggle();
        });

    };


});