(function ($) {
    // Get all the accordion-row-headers
    var accordionRowHeader = $('.accordion-row-header');

    // The first row is always open
    var firstAccordionRowHeader = $(accordionRowHeader[0]);
    /*jshint latedef: nofunc */
    // To silence jshint error message - 'toggleAccordion' was used before it was defined.'
    toggleAccordion(firstAccordionRowHeader);

    // on-click function for every accordion-row-header
    accordionRowHeader.on('click', function () {
        toggleAccordion($(this));
    });

    /*
     * Function to toggle the accordion rows between open and closed states
     * and style its various components
     */
    function toggleAccordion(accordionHeader) {
        // Style the header and its visual components
        accordionHeader.toggleClass('open');
        var firstTd = accordionHeader.find('td').first();
        var chevronSpan = firstTd.find('.glyphicon');
        chevronSpan.toggleClass('glyphicon-chevron-down');

        // Find the content div of the accordion detail corresponding to the accordion header
        var accordionDetails = accordionHeader.next('.accordion-row-details');
        var contentDiv = accordionDetails.find('.content');
        // Toggle the open/closed state of the content using slide transition
        contentDiv.slideToggle();
    }
}(jQuery));
