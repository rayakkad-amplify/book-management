/*
 * Code example to show functionality of the notes widget
 */

(function ($) {
    /*
     * Function to show the notes widget
     */
    $(document).ready(function() {
        notes = $('#notes');
        notes.notesWidget();
    });
    /*
     * Function to hide the notes widget when the done button is clicked
     */
    $(document.body).on('click', '#notes .modal-footer .btn-primary', function (event) {
        notes.notesWidget('hide');
    });

    /*
     * Function to edit text in the notes widget
     */
    $(document.body).on('click', 'button.btn.btn-secondary.text-edit', function (event) {
        notes.notesWidget('setText', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    });
}(jQuery));
