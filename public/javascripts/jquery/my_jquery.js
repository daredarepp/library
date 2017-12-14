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
            
            var windowBody = toggleButton.parents('.window').children('.window_body');
            var scrollButtons = windowBody.find('.scroll_left, .scroll_right, .scroll_bar');
                
            // Slide up
            if (toggleButton.text() === "keyboard_arrow_down") {
                
                windowBody.slideUp(200);

                // smoothly hide the scroll buttons
                scrollButtons.fadeOut(100);

                // highlight the toggle button and change arrow direction
                toggleButton.addClass('active');
                toggleButton.text('keyboard_arrow_left');
                
            // Slide down
            } else {

                windowBody.slideDown(200);

                // smoothly show the scroll buttons
                scrollButtons.fadeIn(100);

                // remove highlight from the toggle button and change arrow direction
                toggleButton.removeClass('active');
                toggleButton.text('keyboard_arrow_down');

            }

        };

        // Highlight navigation buttons
        var highlightNavButtons = function() {
          
            var navButtons = $('.navi a').not('.icon');
            var homeButton = navButtons.filter('[href = "/"]');
            var catalogButton = navButtons.filter('[href = "/catalog"]');
            var adminButton = navButtons.filter('[href = "/admin"]');

            if (location.href === 'http://localhost:4000/') {

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

        // Scroll popular movies left and right
        var scrollLeftAndRight = function(button) {
            
            var elementToScroll = button.parent();
            var scrollPosition = elementToScroll.scrollLeft();

            // Scroll left
            if (button.attr('class').indexOf('scroll_left') > -1) {
                
                elementToScroll.animate({
                    scrollLeft: scrollPosition - 235
                }, {
                    duration: 200,
                    done: function() {
                        homepageModule.checkHorizontalScroll(elementToScroll);
                    }
                });

            // Scroll right
            } else if (button.attr('class').indexOf('scroll_right') > -1) {

                elementToScroll.animate({
                    scrollLeft: scrollPosition + 235
                }, {
                    duration: 200,
                    done: function() {
                        homepageModule.checkHorizontalScroll(elementToScroll);
                    }
                });

            }

        };

        // Check horizontal scroll
        var checkHorizontalScroll = function (elementToScroll) {

            var scrollLeftButton = elementToScroll.find('.scroll_left');
            var scrollRightButton = elementToScroll.find('.scroll_right');
            var lastItem = elementToScroll.find('.category_items').last();

            // If there are no items in at least one of the windows
            if (elementToScroll.find('.category_items').length < 1) {

                // Show a link to populate the database 
                let reset = $('.reset');
                reset.show();

                return

            }

            var lastItemPosition = lastItem.position().left + lastItem.innerWidth();

            // Highlight right scroll button
            if (elementToScroll.scrollLeft() <= 0) { 

                scrollLeftButton.removeClass('active');
                scrollRightButton.addClass('active');

            // Highlight both scroll buttons
            } else if ((elementToScroll.scrollLeft() > 0) && (lastItemPosition > scrollRightButton.position().left)) {

                scrollLeftButton.addClass('active');
                scrollRightButton.addClass('active');

            // Highlight left scroll button
            } else {

                scrollRightButton.removeClass('active');
                scrollLeftButton.addClass('active');

            }

        };

        // Add homepage event listeners
        var addEventListeners = function() {

            // Scroll left and right buttons
            $('.home_wrapper').find('.scroll_left, .scroll_right').off().on('click', function(event) {
                
                event.preventDefault();
                
                var button = $(this);
                homepageModule.scrollLeftAndRight(button);
                
            });

            // Toggle button
            $('a.toggle_button').off().on('click', function(event) {

                event.preventDefault();

                var toggleButton = $(this);
                websiteModule.toggleWindow(toggleButton);

            });

            $('.home_wrapper').find('#latest_movies, #active_directors').off().on('scroll', function() {

                var elementToScroll = $(this);
                homepageModule.checkHorizontalScroll(elementToScroll);

            })

        };
        
        return {scrollLeftAndRight: scrollLeftAndRight, checkHorizontalScroll: checkHorizontalScroll, addEventListeners: addEventListeners};

    }();

    // Check for horizontal scroll availability (on resize too)
    if (location.href === 'http://localhost:4000/') {
        
        (function() {
            
            var homepageWindows = $('.home_wrapper').find('.window');
            homepageWindows.each(function(i, homepageWindow) {
    
                let elementToScroll = $(homepageWindow).find('#latest_movies, #active_directors');
                homepageModule.checkHorizontalScroll(elementToScroll);
    
            })

            $(window).off().on('resize', function() {
                
                homepageWindows.each(function(i, homepageWindow) {
                    
                    let elementToScroll = $(homepageWindow).find('#latest_movies, #active_directors');
                    homepageModule.checkHorizontalScroll(elementToScroll);
        
                })  

            })

        })()
            
    }
    
    // Add the event listeners
    homepageModule.addEventListeners();

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
                method: 'GET'
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

        // Open search bar
        var openSearch = function(searchButton) {

            var parentWindow = searchButton.parents('.window');
            var windowBody = parentWindow.children('.window_body');
            var searchBar = windowBody.find('.search_bar');
            var searchField = searchBar.children('#search_field');
            
            // Toggle the active button only when the search field is empty
            if (searchField.val().length === 0) {

                searchButton.toggleClass('active');

            }
            
            // Toggle the search bar and focus it
            $(searchBar).slideToggle(100);
            searchField.focus();

            // In admin windows, slide down the elements under the search bar
            if ((parentWindow.attr('class').indexOf('admin') > -1)) {

                
                if (windowBody.css('paddingTop') === "15px") {
                    
                    windowBody.scrollTop(0);
                    windowBody.animate({
                        paddingTop: "+=50px"
                    }, {
                        duration: 100,
                        done: function() {
                            adminModule.checkVerticalScroll(windowBody)
                        }
                    });
                    
                } else {
                    
                    windowBody.animate({
                        paddingTop: "-=50px"
                    }, {
                        duration: 100,
                        done: function() {
                            adminModule.checkVerticalScroll(windowBody)
                        }
                    });
                }

            }

        };
        
        // Search items
        var searchItems = function(searchField, searchValue) {

            var parentWindow = searchField.parents('.window');
            var windowBody = parentWindow.children('.window_body');

            // Remove previous no match string
            parentWindow.find('.no_match').remove();

            // Show only the category items that match the search
            var categoryItems = parentWindow.find('.category_items');
            categoryItems.each(function(i,item) {

                var itemName = $(item).text().toLowerCase();

                if (itemName.indexOf(searchValue) > -1) {

                    $(item).show();

                } else {

                    $(item).hide();

                }

            });

            // Show the button that clears the search
            var clearSearchButton = parentWindow.find('#clear_search');
            searchValue.length > 0 ? clearSearchButton.show() : clearSearchButton.hide();

            // No match
            var invisibleItems = categoryItems.filter('[style="display: none;"]');

            if (invisibleItems.length === categoryItems.length) { 

                let noMatch = $('<p></p>').addClass('no_match');
                noMatch.text('No items match your search.');

                windowBody.append(noMatch);

            };        

            // In admin windows, check for vertical scroll availability 
            if ((parentWindow.attr('class').indexOf('admin') > -1)) {

                adminModule.checkVerticalScroll(windowBody);

            }

        };

        // Clear search
        var clearSearch = function(button) {
            
            var parentWindow = $(button).parents('.window');
            var windowBody = parentWindow.children('.window_body')

            // Remove no match string
            parentWindow.find('.no_match').remove();
            
            // Empty the search field and focus on it
            var searchField = parentWindow.find('#search_field');
            searchField.val('');
            searchField.focus();

            // Show all the category items
            var categoryItems = parentWindow.find('.category_items');
            categoryItems.show();

            // Hide the button
            button.hide();

            // In admin windows, check for vertical scroll availability 
            if ((parentWindow.attr('class').indexOf('admin') > -1)) {

                adminModule.checkVerticalScroll(windowBody);

            }

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
                method: 'GET'
            })

            // When done
            .done(function(item) {
                
                // Display the item
                existingCatalog.html(item);

                // Add the event listeners
                catalogModule.addEventListeners();

                // Update the URL
                catalogModule.updateURL(url);

                // Smoothly scroll to the top
                $('html').animate({
                    scrollTop: 0
                }, 200);

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
                history.back();

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
            $('.catalog').find('.window_body').off().on('click', function(event) {

                var clicked = $(event.target);
                var itemParents = clicked.parents('a').filter('.category_items');

                // If the clicked element is an item link
                if ((clicked.prop('tagName') === 'A') && (clicked.attr('class').indexOf('category_items') > -1)) { 

                    event.preventDefault();
                    let url = clicked.attr('href');
                    catalogModule.openSingleItem(url);

                // If the clicked element is a descendant of item link
                } else if (itemParents.length > 0) {

                    event.preventDefault();
                    let url = $(itemParents).attr('href');
                    catalogModule.openSingleItem(url);

                }

            });
            
        };
        
        return { wrapper: wrapper, openCatalog: openCatalog, changeCatalog: changeCatalog, updateURL: updateURL, loadCatalogContent: loadCatalogContent, closeCatalog: closeCatalog, openSearch: openSearch, searchItems: searchItems, clearSearch: clearSearch, openSingleItem: openSingleItem, addEventListeners: addEventListeners };

    }();
   
    // On catalog page load
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
        
        // Scroll up and down
        var scrollUpAndDown = function(button) {
            
            var windowBody = button.parents('.window_body');
            var scrollPosition = windowBody.scrollTop();
            
            // Scroll up
            if (button.attr('class').indexOf('scroll_up') > -1) {

                windowBody.animate(
                    {
                    scrollTop: scrollPosition - 260
                    },
                    {
                    duration: 200,
                    done: function() {
                    adminModule.checkVerticalScroll(windowBody)
                    }
                });

            // Scroll down
            } else if (button.attr('class').indexOf('scroll_down') > -1) {

                windowBody.animate(
                    {
                    scrollTop: scrollPosition + 260
                    },
                    {
                    duration: 200,
                    done: function() {
                        adminModule.checkVerticalScroll(windowBody)
                    }
                });

            }

        };

        // Check vertical scroll
        var checkVerticalScroll = function(windowBody) {

            // If there are no items in at least one of the windows
            if (windowBody.find('.category_items').length < 1) {

                // Show a link to populate the database 
                let populate = $('.populate');
                populate.show();

                return

            }
            
            var scrollUpButton = windowBody.find('.scroll_up');
            var scrollDownButton = windowBody.find('.scroll_down');
            
            var windowHeader = windowBody.parents('.window').children('.window_title').innerHeight();
            var paddingTop = windowBody.css('padding-top');
            var distance = parseInt(paddingTop.slice(0, paddingTop.length - 2)) + windowHeader;
            
            var list = windowBody.children('.list');
            var listBottomPosition = list.innerHeight() + list.position().top - distance;

            // Highlight the scroll up button
            if (windowBody.scrollTop() <= 0) {
                
                scrollUpButton.removeClass('active');
                scrollUpButton.removeAttr('title');
                
            } else {
                
                scrollUpButton.addClass('active');
                scrollUpButton.attr('title', 'Scroll up');

            }

            // Highlight the scroll down button
            if (listBottomPosition > windowBody.height()){
            
                scrollDownButton.addClass('active');
                scrollDownButton.attr('title', 'Scroll down');

            } else {

                scrollDownButton.removeClass('active');
                scrollDownButton.removeAttr('title');

            }

        };

        // Delete item
        var deleteItem = function(button) {

            // Hide the first delete button
            button.addClass('active');
            
            // Activate the item
            var item = button.parent();
            item.addClass('active');

            // Make Delete final button
            var deleteFinal = $('<a></a>').attr('href','#').addClass('delete_final').text('DELETE');
            var deleteFinalIcon = $('<i></i>').addClass('material-icons').text('delete');
            deleteFinal.append(deleteFinalIcon);

            // Make Cancel button
            var cancel = $('<a></a>').attr('href','#').addClass('cancel').text('CANCEL');
            var cancelIcon = $('<i></i>').addClass('material-icons').text('close');
            cancel.append(cancelIcon);

            // Display both buttons
            item.append(deleteFinal,cancel);
            
            // Delete final 
            deleteFinal.off().on('click', function(event) {
               
                event.preventDefault();
                adminModule.deleteFinal(item);

            })

            // Cancel
            cancel.off().on('click', function(event) {

                event.preventDefault();
                adminModule.cancelDelete(item);

            })

        }

        // Delete Final
        var deleteFinal = function(item) {

            var url = item.children('.delete').attr('href');
            
            $.ajax({url: url,
                    method: 'POST'
            })
            .done(function(response, textStatus) {
                
                if (textStatus === 'success') {
                    
                    // Smoothly remove the item
                    item.children('.delete_final, .cancel').remove();
                    item.addClass('remove');
                    item.slideUp(200, function() {item.remove()});

                }

            })

        }

        // Cancel delete
        var cancelDelete = function(item) {

            item.removeClass('active');
            item.children('.delete_final, .cancel').remove();
            item.children('.delete').removeClass('active');

        }

        // Add event listeners
        var addEventListeners = function() {

            // Scroll up and down buttons
            $('.admin').find('.scroll_up, .scroll_down').off().on('click', function(event) {
                
                event.preventDefault();
                
                var button = $(this);
                adminModule.scrollUpAndDown(button);
                
            });

            $('.admin').find('.delete').off().on('click', function(event) {

                event.preventDefault();
                
                var button = $(this);
                adminModule.deleteItem(button);

            })

        };

        return {scrollUpAndDown: scrollUpAndDown, checkVerticalScroll: checkVerticalScroll, deleteItem: deleteItem, deleteFinal: deleteFinal, cancelDelete: cancelDelete, addEventListeners: addEventListeners}
    
    }();

    // Check for vertical scroll availability
    if (location.href === "http://localhost:4000/admin") {
        
        (function() {

            var adminWindows = $('.admin');
    
            adminWindows.each(function(i, adminWindow) {
    
                let windowBody = $(adminWindow).children('.window_body');
                adminModule.checkVerticalScroll(windowBody);
                
            })

        })();
            
    }

    // Add the event listeners
    adminModule.addEventListeners();

     

});



