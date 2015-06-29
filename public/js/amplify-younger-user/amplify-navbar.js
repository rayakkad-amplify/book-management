(function ($) {
    /*
     * Function to show the full navigation bar
     */
    $(document.body).on('click', '.btn-nav', function (event) {
        var btnNav = $(event.currentTarget);
        var navbarContainer = $('.navbar-container');
        // Show full navigation bar
        navbarContainer.addClass('in');
        // Hide standalone hamburger menu
        btnNav.addClass('out');
    });

    /*
     * Function to hide the full navigation bar
     */
    $(document.body).on('click', '#hamburger-menu', function (event) {
        var hamburgerMenu = $(event.currentTarget);
        var navbarContainer = $('.navbar-container');
        // Hide full navigation bar
        navbarContainer.removeClass('in');
        var btnNav = $('.btn-nav');
        // Show standalone hamburger menu
        btnNav.removeClass('out');
    });
}(jQuery));
