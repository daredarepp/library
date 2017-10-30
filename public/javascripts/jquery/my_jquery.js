$(document).ready(function(){
    
    // Navigation bar responsive button
    $('.navi a.icon').click(function(){

        event.preventDefault(); 
        $('.navi').toggleClass('responsive');
    });


    /* Homepage ----------------------------------------------------------------------------------------------------- */

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

    /* Catalog page ------------------------------------------------------------------------------------------------- */

    // when selecting a category
    $('.selection_window a, .selection_bar a').click(function(){
        
        event.preventDefault();
        
        // If the link is already active, do nothing
        if($(this).attr('class').indexOf('active') > -1){

            return;
        
        // Otherwise open a catalog for the selected link
        }else{
            openCatalog($(this).attr('class'));
        };
            
            
    });
        
    function openCatalog(active){
                    
        // Grab reference to the existing elements
        var wrapper = $('.catalog_wrapper');
        var selectionWindows = $('.selection_window');
        var selectionBar = ($('.selection_bar'));
        var selectionBarLinks = selectionBar.children('a');
        var activeLink = selectionBarLinks.filter(`.${active}`);
        var path = activeLink.attr('href');

        // Remove any previously created catalogs
        $('.catalog').remove();

        // Hide the selection windows and show the selection bar
        selectionWindows.hide();
        selectionBar.show()

        // Style the active link
        selectionBarLinks.removeClass('active');
        activeLink.addClass('active');

        // Create new catalog and elements for it
        var catalog = $('<div></div>')
        .addClass('window col-xs-12 col-md-8 col-md-offset-2 catalog');

        var catalogTitle = $('<h2></h2>')
        .addClass('window_title')
        .html(activeLink.html());

        var catalogCloseButton = $('<a></a>')
        .attr({'id':'close_button', 'href':'#', 'title':'Close'})
        .addClass('material-icons')
        .text('close');

        var catalogBody = $('<div></div>')
        .addClass('window_body');

        // Append the created elements to the catalog
        catalog
        .append(catalogTitle)
        .append(catalogCloseButton)
        .append(catalogBody);

        // Fill the catalog body with ajax data 
        $.get(path, function(data, status){

            if(status === 'error'){
                catalogBody.text('Sorry, something went wrong.');
                return;
            };
            
            var ol = $('<ol></ol>');
            data.map(function(one){
                var li = $('<li></li>');
                li.text(JSON.stringify(one));
                ol.append(li);
            })
            // var para = $('<p></p>').text(JSON.stringify(data));
            catalogBody.html(ol);
        });
        
        // Append the catalog to the main wrapper
        wrapper.append(catalog);

        // history.pushState({wrapper : wrapper.html()}, '', `/catalog/${active}`); 

        // When clicking the close button
        catalogCloseButton.click(function(){
            console.log('SOOOO WHATTT');
            event.preventDefault();
            
            console.log($('#close_button').text())
            // Remove the catalog 
            catalog.remove();
            activeLink.removeClass('active');

            // Hide the selection bar and show the selection windows
            selectionBar.hide();
            selectionWindows.show();
        
        });

    };

});
