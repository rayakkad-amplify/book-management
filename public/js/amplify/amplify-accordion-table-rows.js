(function ($) {
    // Get all the accordion-row-headers
    var accordionRowHeaders = $('.accordion-row-header');

    // on-click function for every accordion-row-header
    accordionRowHeaders.on('click', function () {
        var self = $(this);
        // Style the header and its visual components
        self.toggleClass('open');
        var firstTd = self.find('td').first();
        var chevronSpan = firstTd.find('.glyphicon');
        chevronSpan.toggleClass('glyphicon-chevron-down');

        // Find the content div of the accordion detail corresponding to the accordion header
        var accordionDetails = self.next('.accordion-row-details');
        var contentDiv = accordionDetails.find('.content');
        // Toggle the open/closed state of the content using slide transition
        contentDiv.slideToggle();
    });
}(jQuery));
