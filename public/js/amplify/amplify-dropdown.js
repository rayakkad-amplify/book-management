(function ($) {
    /*
     * Function to handle non-selectable dropdown-menu item
     */
    $(document.body).on('click', '.dropdown-menu a:not(.header):not(.selectable)', function (event) {
        var dropdownMenuItem = $(event.currentTarget);
        var btnGroup = dropdownMenuItem.closest('.btn-group');
        var btnDropdownLabel = btnGroup.find('.btn-dropdown-label');
        btnDropdownLabel.text(dropdownMenuItem.text());
        var btnDropdownButton = btnGroup.find('button');
        btnDropdownButton.attr('data-value', dropdownMenuItem.data('value'));
        // Hide the dropdown menu
        btnGroup.children('.dropdown-toggle').dropdown('toggle');
        event.preventDefault();
    });

    /*
     * Function to handle selectable dropdown-menu item
     */
    $(document.body).on('click', '.dropdown-menu a.selectable:not(.header)', function (event) {
        var dropdownMenuItem = $(event.currentTarget);
        if (dropdownMenuItem.attr('data-state') === 'unselected') {
            addCheckmark(dropdownMenuItem);
        }
        else {
            removeCheckmark(dropdownMenuItem);
        }
        updateSelectableHeaderState(dropdownMenuItem);
        event.stopPropagation();
    });

    /*
     * Function to handle dropdown-menu header
     */
    $(document.body).on('click', '.dropdown-menu a.header:not(.selectable)', function (event) {
        event.stopPropagation();
    });

    /*
     * Function to handle selectable dropdown-menu header
     */
    $(document.body).on('click', '.dropdown-menu a.header.selectable', function (event) {
        var dropdownMenuItem = $(event.currentTarget);
        var categoryItems = dropdownMenuItem.siblings('.items').find('a');
        if (dropdownMenuItem.attr('data-state') === 'unselected') {
            addCheckmark(dropdownMenuItem);
            addCheckmark(categoryItems);
        }
        else {
            removeCheckmark(dropdownMenuItem);
            removeCheckmark(categoryItems);
        }
        event.stopPropagation();
    });

    /*
     * Function to add a checkmark to the selectable menu item
     */
    function addCheckmark(item) {
        item.addClass('active');
        item.attr('data-state', 'selected');
        var itemIconCheckbox = item.find('.icon-checkbox');
        itemIconCheckbox.attr('data-icon', utilities.htmlDecode('&#xe601;'));
    }

    /*
     * Function to remove the checkmark from the selectable menu item
     */
    function removeCheckmark(item) {
        item.removeClass('active');
        item.attr('data-state', 'unselected');
        var itemIconCheckbox = item.find('.icon-checkbox');
        itemIconCheckbox.attr('data-icon', utilities.htmlDecode('&#xe602;'));
    }

    /*
     * Function to add a dash to the selectable menu item
     */
    function addDashmark(item) {
        item.addClass('active');
        item.attr('data-state', 'unselected');
        var itemIconCheckbox = item.find('.icon-checkbox');
        itemIconCheckbox.attr('data-icon', utilities.htmlDecode('&#xe605;'));
    }

    /*
     * Function that adds a checkmark/dash or removes checkmark from the category header
     */
    function updateSelectableHeaderState(item) {
        var itemList = item.closest('.items');
        var itemCount = itemList.children().length;
        var itemSelectedCount = itemList.find('[data-state="selected"]').length;
        var itemCategoryHeader = itemList.siblings('.selectable');
        if (itemSelectedCount === 0) {
            removeCheckmark(itemCategoryHeader);
        }
        else if (itemSelectedCount === itemCount) {
            addCheckmark(itemCategoryHeader);
        }
        else {
            addDashmark(itemCategoryHeader);
        }
    }
}(jQuery));
