utilities = (function ($) {
    /*
     * Function to decode the value of data-icon to display the icon characters
     */
    this.htmlDecode = function (value) {
        if (value) {
            return $('<div />').html(value).text();
        } else {
            return '';
        }
    };

    /*
     * Function to sort an array in the descending order
     */
    this.sortArrayDescendingOrder = function (arrayToSort) {
        arrayToSort.sort(function (a, b) {
            return b.dataValue - a.dataValue;
        });
    };
    
    return this;
}(jQuery));
