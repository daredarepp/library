$(document).ready(function(){
    /* Website ----------------------------------------------------------------------------------------- */
    
    /* $(window).resize(function(){
        console.log('width: ' + window.innerWidth);
        console.log('height: ' + window.innerHeight);
    }); */

    // Responsive navigation bar
    $('.navi a.icon').click(function(){

        event.preventDefault(); 

        $('.navi').toggleClass('responsive');
    });

        
    var websiteModule = function(){

        // Close
        var closeWindow = function(closeButton){
            
            var window = closeButton.parents('.window');
            window.remove();
        };

        // Toggle
        var toggleWindow= function(toggleButton){
            
            // Toggle the parent window
            var windowBody = toggleButton.parents('.window').children('.window_body');
            windowBody.toggle();


            // Toggle the active button
            if(toggleButton.text() === 'keyboard_arrow_up'){

                toggleButton.text('keyboard_arrow_down');
                toggleButton.toggleClass('active');
            }else{

                toggleButton.text('keyboard_arrow_up');
                toggleButton.toggleClass('active');
            };
        };

        return {closeWindow: closeWindow, toggleWindow: toggleWindow};

    }();


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

        var toggleButton = $(this);
        websiteModule.toggleWindow(toggleButton);
    });

    /* Catalog page ------------------------------------------------------------------------------------------------- */

    
    
    if(location.href.indexOf('/catalog') > -1){

        
        // Highlight active link
        var catalogCategory = $('.catalog').attr('data-category');
        var activeLink = $('.selection_bar a').filter(`.${catalogCategory}`);
        activeLink.addClass('active');
        
        // Save a state of the first load of the catalog page
        var wrapper = $('.catalog_wrapper');
        history.replaceState({wrapper: wrapper.html()}, '', location.href);

        // Selection windows
        $('.selection_window a').click(function(event){
    
            event.preventDefault();        
            var category = $(this).attr('class');         
            catalogModule.openCatalog(category);
        });
    
        // Selection bar
        $('.selection_bar a').click(function(event){
            
            event.preventDefault();        
            var category = $(this).attr('class');
            catalogModule.changeCatalog(category);
        });

        // Catalog search button
        $('.search_button').click(function(event){
            
            event.preventDefault();
            var searchButton = $(this);
            catalogModule.openSearch(searchButton);
        });
        
        // Catalog close button
        $('#close_button').click(function(event){
            
            event.preventDefault();
            var button = $(this);
            catalogModule.closeCatalog(button);
        });

        // Search catalog
        $('#search_field').on('keyup paste',function(){

            var searchField = this;

            // Short pause to wait for paste to complete
            setTimeout(function(){
                var searchValue = $(searchField).val();
                catalogModule.searchCatalog(searchValue);
            }, 100);
        });

        // Clear search button
        $('#clear_search').click(function(){

            var button = $(this);
            catalogModule.clearSearch(button);
        });

        // Category items
        $('.category_items').click(function(event){
            
            event.preventDefault();
            var url = $(this).attr('href');
            catalogModule.openSingleItem(url);
        });
    };

    // Navigating through page states
    window.onpopstate = function(event){

        // Display the saved state
        if(event.state){

            var wrapper = $('.catalog_wrapper');
            wrapper.html(event.state.wrapper);
            
            // Selection windows
            $('.selection_window a').click(function(event){

                event.preventDefault();
                var category = $(this).attr('class');         
                catalogModule.openCatalog(category);
            });
            
            // Selection bar
            $('.selection_bar a').click(function(event){

                event.preventDefault()
                var category = $(this).attr('class');
                catalogModule.changeCatalog(category);
            });

            // Catalog search button
            $('.search_button').click(function(event){
                
                event.preventDefault();
                var searchButton = $(this);
                catalogModule.openSearch(searchButton);
            });
            
            // Catalog close button
            $('#close_button').click(function(event){

                event.preventDefault();
                var button = $(this);
                catalogModule.closeCatalog(button);
            });

            // Search catalog
            $('#search_field').on('keyup paste',function(){
                
                var searchField = this;
    
                // Short pause to wait for paste to complete
                setTimeout(function(){
                    var searchValue = $(searchField).val();
                    catalogModule.searchCatalog(searchValue);
                }, 100);
            });

            // Clear search button
            $('#clear_search').click(function(){

                var button = $(this);
                catalogModule.clearSearch(button);
            });

            // Category items
            $('.category_items').click(function(event){

                event.preventDefault();
                var url = $(this).attr('href');
                catalogModule.openSingleItem(url);
            });

        };
    };
    
    // Catalog module
    var catalogModule = function(){

        // Open catalog
        var openCatalog = function(category){
            
            var selectionWindows = $('.selection_window');
            selectionWindows.hide();
            
            var selectionBar = $('.selection_bar');
            selectionBar.show();
            
            // Highlight the active bar link
            var activeLink = $('.selection_bar a').filter(`.${category}`);
            activeLink.addClass('active');
            
            // Load the catalog
            catalogModule.loadCatalogContent(activeLink.attr('href'));
        };

        // Change catalog
        var changeCatalog = function(category){

            // If the link is already active
            if(category.indexOf('active') > -1){
                
                return;    

            }else{
                
                // Highlight the active bar link
                var oldActiveLink = $('.selection_bar a').filter('.active');
                oldActiveLink.removeClass('active');
                
                var newActiveLink = $('.selection_bar a').filter(`.${category}`);
                newActiveLink.addClass('active');
    
                // Remove the old catalog
                var oldCatalog = $('.catalog');
                oldCatalog.remove();
    
                // Load the new catalog
                catalogModule.loadCatalogContent(newActiveLink.attr('href'));
            };
        };

        // Load catalog content
        var loadCatalogContent = function(url){
            
            // Send ajax request
            $.ajax({
                url: url,
                cache: false,
                type: 'GET'
            })

            // When done
            .done(function(catalog) {

                // Display the catalog
                var wrapper = $('.catalog_wrapper');
                wrapper.append(catalog);
                
                // Make the catalog search button functional
                var searchButton = $('.search_button');
                searchButton.click(function(event){
                    
                    event.preventDefault();
                    var searchButton = $(this);
                    catalogModule.openSearch(searchButton);
                });

                // Make the catalog close button functional
                var closeButton = $('#close_button');
                closeButton.click(function(event){

                    event.preventDefault();
                    var button = $(this);
                    catalogModule.closeCatalog(button);
                });

                // Make the search field functional
                $('#search_field').on('keyup paste',function(){
                    
                    var searchField = this;
        
                    // Short pause to wait for paste to complete
                    setTimeout(function(){
                        var searchValue = $(searchField).val();
                        catalogModule.searchCatalog(searchValue);
                    }, 100);
                });

                // Make the clear search button functional
                $('#clear_search').click(function(){

                    var button = $(this);
                    catalogModule.clearSearch(button);
                });

                // Make the category items functional
                var categoryItem = $('.category_items');
                categoryItem.click(function(event){

                    event.preventDefault();
                    var url = $(this).attr('href');
                    catalogModule.openSingleItem(url);
                });


                // Update the URL
                catalogModule.updateURL(url);
            })

            // When failed
            .fail(function(xhr, status){

                var catalogError = $('<div></div>')
                .addClass('window col-xs-12 col-md-8 col-md-offset-2 catalog catalog_error');
                var closeButton = $('<a></a>').attr({'href':'#', 'title':'Close', 'id':'close_button'})
                .addClass('material-icons');
                catalogError.text(status).append(closeButton);
                var wrapper = $('catalog_wrapper');
                wrapper.append(catalogError);
            })
        };

        // Update URL
        var updateURL = function(newURL){

            var wrapper = $('.catalog_wrapper');
            history.pushState({wrapper: wrapper.html()}, '', newURL)
        };

        // Close catalog
        var closeCatalog = function(closeButton){
            
            var catalog = closeButton.parents('.catalog');
            catalog.remove();
            
            var selectionWindows = $('.selection_window');
            selectionWindows.show();

            var selectionBar = $('.selection_bar');
            selectionBar.hide();

            var activeLink = selectionBar.children('a.active');
            activeLink.removeClass('active');

            // Update the URL
            catalogModule.updateURL('/catalog');
        };

        // Open search bar
        var openSearch = function(searchButton){

            // Toggle the active button only when the search field is empty
            var searchField = $('#search_field');
            if(searchField.val().length === 0){

                searchButton.toggleClass('active');
            };
            
            // Toggle the search bar
            var searchBar = $('.search_bar');
            searchBar.slideToggle(100);

            searchField.focus();
        };
        
        // Search catalog
        var searchCatalog = function(searchValue){

            // Remove previous no match string
            $('.no_match').remove();

            // Show only the category items that match the search
            var categoryItems = $('.category_items');
            categoryItems.map(function(){

                var item = $(this);
                var itemName = item.text().toLowerCase();

                if(itemName.indexOf(searchValue) > -1){

                    item.show()
                }else{

                    item.hide()
                };
            });

            // Show a button that clears the search
            var clearSearchButton = $('#clear_search');
            searchValue.length > 0 ? clearSearchButton.show() : clearSearchButton.hide();

            // No match
            var invisibleItems = $('.category_items').filter('[style="display: none;"]');

            if(invisibleItems.length === categoryItems.length){ 

                var noMatch = $('<p></p>').addClass('no_match');
                noMatch.text('No items match your search.');

                var windowBody = $('.window_body');
                windowBody.prepend(noMatch);
            };        
        };

        // Clear search
        var clearSearch = function(button){

            // Remove no match string
            $('.no_match').remove();
            
            // Empty the search field and focus on it
            var searchField = $('#search_field');
            searchField.val('');
            searchField.focus();

            // Show all the category items
            var categoryItems = $('.category_items');
            categoryItems.show();

            // Hide the button
            button.hide();
        };

        // Open single item
        var openSingleItem = function(url){

             // Send ajax request
             $.ajax({
                url: url,
                cache: false,
                type: 'GET'
            })

            // When done
            .done(function(item) {
                
                // Remove the search button and search bar
                var searchButton = $('.search_button');
                searchButton.remove();
                var searchBar = $('.search_bar');
                searchBar.remove();

                // Display the item
                var windowBody = $('.window_body');
                windowBody.empty();
                windowBody.append(item);

                // Update the URL
                catalogModule.updateURL(url);
            })

            // When failed
            .fail(function(xhr, status){

                var catalogError = $('<div></div>')
                .addClass('window col-xs-12 col-md-8 col-md-offset-2 catalog catalog_error');
                catalogError.text(status)
                var wrapper = $('catalog_wrapper');
                wrapper.append(catalogError);
            })
        };

        return {openCatalog: openCatalog, changeCatalog: changeCatalog, updateURL: updateURL, loadCatalogContent: loadCatalogContent, closeCatalog: closeCatalog, openSearch: openSearch, searchCatalog: searchCatalog, clearSearch: clearSearch, openSingleItem: openSingleItem};

    }();
    

});
