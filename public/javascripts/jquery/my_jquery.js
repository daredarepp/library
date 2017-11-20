$(document).ready(function(){
    /* Website ----------------------------------------------------------------------------------------- */    

    // Responsive navigation bar
    $('.navi a.icon').off().on('click', function(event){

        event.preventDefault(); 

        $('.navi').toggleClass('responsive');

    });

        
    var websiteModule = function(){

        // Close window
        var closeWindow = function(closeButton){
            
            var window = closeButton.parents('.window');
            window.remove();

        };

        // Toggle window
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

    var homepageModule = function(){

        // Scroll popular books right
        var scrollRight = function(){

            var popularBooks = $('#popular_books_placeholder');

            // Grab reference to the position of the scroll and increase it's value
            var scrollPosition = popularBooks.scrollLeft();
            scrollPosition += 250;

            // Apply the new value using animation
            popularBooks.animate({scrollLeft: scrollPosition}, 200);

        };

        // Scroll popular books left
        var scrollLeft = function(){

            var popularBooks = $('#popular_books_placeholder');

            // Grab reference to the position of the scroll and decrease it's value
            var scrollPosition = popularBooks.scrollLeft();
            scrollPosition -= 250;

            // Apply the new value using animation
           popularBooks.animate({scrollLeft: scrollPosition}, 200);

        };
        
        return {scrollRight: scrollRight, scrollLeft: scrollLeft};

    }();


    // Right scroll button
    $('#arrow_right').off().on('click', function(event){
        
        event.preventDefault();
        
        homepageModule.scrollRight();
        
    });
    

    // Left scroll button
    $('#arrow_left').off().on('click', function(event){

        event.preventDefault();

        homepageModule.scrollLeft();

    });


    // Toggle button
    $('a.toggle_button').off().on('click', function(){

        event.preventDefault();

        var toggleButton = $(this);
        websiteModule.toggleWindow(toggleButton);

    });

    /* Catalog page ------------------------------------------------------------------------------------------------- */
 
    
    // Catalog module
    var catalogModule = function(){

        // Open catalog
        var openCatalog = function(category){
            
            var selectionWindows = $('.selection_window');
            selectionWindows.hide();
            
            var selectionBar = $('.selection_bar');
            selectionBar.show();
            
            // Highlight the active category
            var activeCategory = $('.selection_bar a').filter(`.${category}`);
            activeCategory.addClass('active');
            
            // Load the catalog
            catalogModule.loadCatalogContent(activeCategory.attr('href'));

        };

        // Change catalog
        var changeCatalog = function(category){
            
            // If the link is already active
            if(category.indexOf('active') > -1){
                
                return;    

            }else{
                
                // Highlight the active category
                var oldActiveCategory = $('.selection_bar a').filter('.active');
                oldActiveCategory.removeClass('active');
                
                var newActiveCategory = $('.selection_bar a').filter(`.${category}`);
                newActiveCategory.addClass('active');
    
                // Remove the old catalog
                var oldCatalog = $('.catalog');
                oldCatalog.remove();
    
                // Load the new catalog
                catalogModule.loadCatalogContent(newActiveCategory.attr('href'));

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
                
                // Add the event listeners
                catalogModule.addEventListeners();

                // Update the URL
                catalogModule.updateURL(url);

            })

            // When failed
            /* .fail(function(xhr, status){

                var catalogError = $('<div></div>')
                .addClass('window col-xs-12 col-md-8 col-md-offset-2 catalog catalog_error');
                var closeButton = $('<a></a>').attr({'href':'#', 'title':'Close', 'id':'close_button'})
                .addClass('material-icons');
                catalogError.text(status).append(closeButton);
                var wrapper = $('catalog_wrapper');
                wrapper.append(catalogError);

            }) */

        };

        // Update URL
        var updateURL = function(newURL){

            var wrapper = $('.catalog_wrapper');
            history.pushState({wrapper: wrapper.html()}, '', newURL);

        };

        // Close catalog
        var closeCatalog = function(closeButton){
            
            var catalog = $('.catalog');
            catalog.remove();
            
            var selectionWindows = $('.selection_window');
            selectionWindows.show();

            var selectionBar = $('.selection_bar');
            selectionBar.hide();

            var activeCategory = selectionBar.children('a.active');
            activeCategory.removeClass('active');

            // Update the URL
            catalogModule.updateURL('/catalog');

        };

        // Go back
        var goBack = function(){
          
            history.back();

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

                    item.show();

                }else{

                    item.hide();

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

                var itemsSection = $('.window_body').find('.books, .authors, .genres');
                itemsSection.append(noMatch);

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
            
            // Remove the old catalog
            var oldCatalog = $('.catalog');
            oldCatalog.remove();

            // Highlight the active category when opening cross-category items
            var oldActiveCategory = $('.selection_bar a').filter('.active');
            oldActiveCategory.removeClass('active');

            if(url.indexOf('books') > -1 ){

                var newActiveCategory = $('.selection_bar a').filter('.books');
                newActiveCategory.addClass('active');

            }else if(url.indexOf('authors') > -1){

                var newActiveCategory = $('.selection_bar a').filter('.authors');
                newActiveCategory.addClass('active');

            }else if(url.indexOf('genres') > -1){

                var newActiveCategory = $('.selection_bar a').filter('.genres');
                newActiveCategory.addClass('active');

            };

            // Send ajax request
            $.ajax({
                url: url,
                cache: false,
                type: 'GET'
            })

            // When done
            .done(function(item) {
                
                // Display the item
                var wrapper = $('.catalog_wrapper');
                wrapper.append(item);

                // Add the event listeners
                catalogModule.addEventListeners();

                // Update the URL
                catalogModule.updateURL(url);

            })

            // When failed
           /*  .fail(function(xhr, status){

                var catalogError = $('<div></div>')
                .addClass('window col-xs-12 col-md-8 col-md-offset-2 catalog catalog_error');
                catalogError.text(status);

                var wrapper = $('catalog_wrapper');
                wrapper.append(catalogError);

            }) */

        };

        // Add event listeners
        var addEventListeners = function(){
            
            // Selection windows
            $('.selection_window a').off().on('click', function(event){

                event.preventDefault();
                var category = $(this).attr('class');         
                catalogModule.openCatalog(category);

            });
            
            // Selection bar
            $('.selection_bar a').off().on('click', function(event){

                event.preventDefault()
                var category = $(this).attr('class');
                catalogModule.changeCatalog(category);

            });

            // Catalog search button
            $('.search_button').off().on('click',function(event){
                
                event.preventDefault();
                var searchButton = $(this);
                catalogModule.openSearch(searchButton);

            });
            
            // Catalog close button
            $('#close_button').off().on('click', function(event){

                event.preventDefault();
                catalogModule.closeCatalog();

            });

            // Catalog back button
            $('.back_button').off().on('click', function(event){

                event.preventDefault();
                catalogModule.goBack();

            });

            // Search field
            $('#search_field').off().on('keyup paste',function(){
                
                var searchField = this;
    
                // Short pause to wait for paste to complete
                setTimeout(function(){
                    var searchValue = $(searchField).val();
                    catalogModule.searchCatalog(searchValue);
                }, 100);

            });

            // Clear search button
            $('#clear_search').off().on('click', function(){

                var button = $(this);
                catalogModule.clearSearch(button);

            });

            // Category items
            $('.category_items').off().on('click', function(event){

                event.preventDefault();
                var url = $(this).attr('href');
                catalogModule.openSingleItem(url);

            });
            
        };

        return {openCatalog: openCatalog, changeCatalog: changeCatalog, updateURL: updateURL, loadCatalogContent: loadCatalogContent, closeCatalog: closeCatalog, goBack: goBack, openSearch: openSearch, searchCatalog: searchCatalog, clearSearch: clearSearch, openSingleItem: openSingleItem, addEventListeners: addEventListeners};

    }();
   
    // On first catalog page load
    if(location.href.indexOf('/catalog') > -1){
        
        // Highlight active category
        var catalogCategory = $('.catalog').attr('data-category');
        var activeCategory = $('.selection_bar a').filter(`.${catalogCategory}`);
        activeCategory.addClass('active');
        
        // Save a state of the page
        var wrapper = $('.catalog_wrapper');
        history.replaceState({wrapper: wrapper.html()}, '', location.href);

        // Add the event listeners
        catalogModule.addEventListeners();

    };

    // Navigating through page states
    window.onpopstate = function(event){
        
        if(event.state){
            
            // Display the saved state
            var wrapper = $('.catalog_wrapper');
            wrapper.html(event.state.wrapper);
            
            // Add the event listeners
            catalogModule.addEventListeners();

        };

    };

});
