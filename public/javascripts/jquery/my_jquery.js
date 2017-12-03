$(document).ready(function() {
    /* Website ----------------------------------------------------------------------------------------- */    

        
    var websiteModule = function() {

        // Close window
        var closeWindow = function(closeButton) {
            
            var window = closeButton.parents('.window');
            window.remove();

        };

        // Toggle window
        var toggleWindow= function(toggleButton) {
            
            // Toggle the parent window
            var windowBody = toggleButton.parents('.window').children('.window_body');
            windowBody.toggle();


            // Toggle the active button
            if (toggleButton.text() === 'keyboard_arrow_left') {

                toggleButton.text('keyboard_arrow_down');
                toggleButton.toggleClass('active');

            } else {

                toggleButton.text('keyboard_arrow_left');
                toggleButton.toggleClass('active');
                
            }
        };

        // Highlight navigation buttons
        var highlightNavButtons = function() {
          
            var navButtons = $('.navi a').not('.icon');
            var homeButton = navButtons.filter('[href = "/"]');
            var catalogButton = navButtons.filter('[href = "/catalog"]');
            var adminButton = navButtons.filter('[href = "/admin"]');

            if (location.href === 'http://localhost:3000/') {

                homeButton.addClass('current');

            } else if (location.href.indexOf("/catalog") > -1) {

                catalogButton.addClass('current');

            } else if (location.href.indexOf("/admin") > -1) {

                adminButton.addClass('current');

            }

        };

        return {closeWindow: closeWindow, toggleWindow: toggleWindow, highlightNavButtons: highlightNavButtons};

    }();

    websiteModule.highlightNavButtons();

    // Responsive navigation bar
    $('.navi a').filter('.icon').off().on('click', function(event) {
        
        event.preventDefault(); 

        $('.navi').toggleClass('responsive');

    });


    /* Homepage ----------------------------------------------------------------------------------------------------- */

    var homepageModule = function() {

        // Scroll popular movies right
        var scrollRight = function(button) {
            
            var elementToScroll = button.parent();

            // Grab reference to the position of the scroll and increase it's value
            var scrollPosition = elementToScroll.scrollLeft();
            scrollPosition += 247;

            // Apply the new value using animation
            elementToScroll.animate({scrollLeft: scrollPosition}, 200);

        };

        // Scroll popular movies left
        var scrollLeft = function(button) {

            var elementToScroll = button.parent();

            // Grab reference to the position of the scroll and decrease it's value
            var scrollPosition = elementToScroll.scrollLeft();
            scrollPosition -= 247;

            // Apply the new value using animation
           elementToScroll.animate({scrollLeft: scrollPosition}, 200);

        };
        
        return {scrollRight: scrollRight, scrollLeft: scrollLeft};

    }();


    // Right scroll button
    $('.scroll_right').off().on('click', function(event) {
        
        event.preventDefault();
        
        var button = $(this);
        homepageModule.scrollRight(button);
        
    });
    

    // Left scroll button
    $('.scroll_left').off().on('click', function(event) {

        event.preventDefault();

        var button = $(this);
        homepageModule.scrollLeft(button);

    });


    // Toggle button
    $('a.toggle_button').off().on('click', function(event) {

        event.preventDefault();

        var toggleButton = $(this);
        websiteModule.toggleWindow(toggleButton);

    });

    /* Catalog page ------------------------------------------------------------------------------------------------- */
 
    
    // Catalog module
    var catalogModule = function() {

        var wrapper = $('.catalog_wrapper');

        // Open catalog
        var openCatalog = function(category) {
            
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
        var changeCatalog = function(category) {
            
            // If the link is already active
            if (category.indexOf('active') > -1) {
                
                return;    

            } else {
                
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

            }

        };

        // Load catalog content
        var loadCatalogContent = function(url) {
            
            // Send ajax request
            $.ajax({
                url: url,
                cache: false,
                type: 'GET'
            })

            // When done
            .done(function(catalog) {

                // Display the catalog
                wrapper.append(catalog);
                
                // Add the event listeners
                catalogModule.addEventListeners();

                // Update the URL
                catalogModule.updateURL(url);

            })

        };

        // Update URL
        var updateURL = function(newURL) {

            history.pushState({wrapper: wrapper.html()}, '', newURL);

        };

        // Close catalog
        var closeCatalog = function(closeButton) {
            
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
        var goBack = function() {
          
            history.back();

        };

        // Open search bar
        var openSearch = function(searchButton) {

            // Toggle the active button only when the search field is empty
            var window = searchButton.parents('.window');
            var searchField = window.find('#search_field');
            if (searchField.val().length === 0) {

                searchButton.toggleClass('active');

            }
            
            // Toggle the search bar
            var searchBar = window.find('.search_bar');
            searchBar.slideToggle(100);

            searchField.focus();

        };
        
        // Search items
        var searchItems = function(searchField, searchValue) {

            // Remove previous no match string
            var window = searchField.parents('.window');
            window.find('.no_match').remove();

            // Show only the category items that match the search
            var categoryItems = window.find('.category_items');
            categoryItems.each(function(i,item) {

                var itemName = $(item).text().toLowerCase();

                if (itemName.indexOf(searchValue) > -1) {

                    $(item).show();

                } else {

                    $(item).hide();

                }

            });

            // Show the button that clears the search
            var clearSearchButton = window.find('#clear_search');
            searchValue.length > 0 ? clearSearchButton.show() : clearSearchButton.hide();

            // No match
            var invisibleItems = categoryItems.filter('[style="display: none;"]');

            if (invisibleItems.length === categoryItems.length) { 

                var noMatch = $('<p></p>').addClass('no_match');
                noMatch.text('No items match your search.');

                var windowBody = window.find('.window_body');
                windowBody.append(noMatch);

            };        

        };

        // Clear search
        var clearSearch = function(button) {
            
            // Remove no match string
            var window = $(button).parents('.window');
            window.find('.no_match').remove();
            
            // Empty the search field and focus on it
            var searchField = window.find('#search_field');
            searchField.val('');
            searchField.focus();

            // Show all the category items
            var categoryItems = window.find('.category_items');
            categoryItems.show();

            // Hide the button
            button.hide();

        };

        // Open single item
        var openSingleItem = function(url) {
            
            var existingCatalog = $('.catalog');

            // Highlight the active category even when opening cross-category items
            var existingActiveCategory = $('.selection_bar a').filter('.active');
            existingActiveCategory.removeClass('active');

            if (url.indexOf('/movies') > -1 ) { 

                let newActiveCategory = $('.selection_bar a').filter('.movies');
                newActiveCategory.addClass('active');

            } else if (url.indexOf('/directors') > -1) {

                let newActiveCategory = $('.selection_bar a').filter('.directors');
                newActiveCategory.addClass('active');

            } else if (url.indexOf('/genres') > -1) {

                let newActiveCategory = $('.selection_bar a').filter('.genres');
                newActiveCategory.addClass('active');

            }

            // Send ajax request
            $.ajax({
                url: url,
                cache: false,
                type: 'GET'
            })

            // When done
            .done(function(item) {
                
                // Display the item
                existingCatalog.html(item);

                // Add the event listeners
                catalogModule.addEventListeners();

                // Update the URL
                catalogModule.updateURL(url);

            })

        };

        // Add event listeners
        var addEventListeners = function() {
            
            // Selection windows
            $('.selection_window').find('a').off().on('click', function(event) {

                event.preventDefault();
                var category = $(this).attr('class');         
                catalogModule.openCatalog(category);

            });
            
            // Selection bar
            $('.selection_bar').find('a').off().on('click', function(event) {

                event.preventDefault()
                var category = $(this).attr('class');
                catalogModule.changeCatalog(category);

            });

            // Catalog search button
            $('.search_button').off().on('click',function(event) {
                
                event.preventDefault();
                var searchButton = $(this);
                catalogModule.openSearch(searchButton);

            });
            
            // Catalog close button
            $('.window').find('#close_button').off().on('click', function(event) {

                event.preventDefault();
                catalogModule.closeCatalog();

            });

            // Catalog back button
            $('.back_button').off().on('click', function(event) {

                event.preventDefault();
                catalogModule.goBack();

            });

            // Search field
            $('.window').find('#search_field').off().on('keyup paste',function() {
                
                var searchField = $(this);
    
                // Short pause to wait for paste to complete
                setTimeout(function() {
                    var searchValue = searchField.val();
                    catalogModule.searchItems(searchField, searchValue);
                }, 100);

            });

            // Clear search button
            $('.window').find('#clear_search').off().on('click', function() {
                
                var button = $(this);
                catalogModule.clearSearch(button);

            });

            // Category items
            $('.catalog').find('.category_items').off().on('click', function(event) {

                event.preventDefault();
                var url = $(this).attr('href');
                catalogModule.openSingleItem(url);

            });
            
        };
        
        return { wrapper: wrapper, openCatalog: openCatalog, changeCatalog: changeCatalog, updateURL: updateURL, loadCatalogContent: loadCatalogContent, closeCatalog: closeCatalog, goBack: goBack, openSearch: openSearch, searchItems: searchItems, clearSearch: clearSearch, openSingleItem: openSingleItem, addEventListeners: addEventListeners };

    }();
   
    // On first catalog page load
    if(location.href.indexOf('/catalog') > -1) {

        let catalogCategory = $('.catalog').attr('data-category');
        let activeCategory = $('.selection_bar a').filter(`.${catalogCategory}`);

        // Highlight active category
        activeCategory.addClass('active');
        
        // Save a state of the page
        history.replaceState({wrapper: catalogModule.wrapper.html()}, '', location.href);

    }

    // Add the event listeners
    catalogModule.addEventListeners();

    // Navigating through page states
    window.onpopstate = function(event) {
        
        if(event.state) {
            
            // Display the saved state
            catalogModule.wrapper.html(event.state.wrapper);
            
            // Add the event listeners
            catalogModule.addEventListeners();

        }

    };


    /* Admin page ------------------------------------------------------------------------------------------------------- */
    
    var adminModule = function() {
    
        
    
    }();



});



