(function ($, window, document, undefined) {
    /*
     * Notes widget class definition
     */
    var NotesWidget = function (element) {
        this.element = element;
        this.$element = $(element);
    };

    NotesWidget.prototype = {
        /*
         * Function to initialize plugin
         */
        _init : function (options) {
            this.title = this.$element.find('.modal-title');
            this.textArea = this.$element.find('.notes-text');
            this.characterCountDisplay = this.$element.find('.character-counter');
            this.doneButton = this.$element.find('.modal-footer .btn-primary');
            options = $.extend({}, $.fn.notesWidget.defaults, options);
            this.setMaxCharactersLimit(options.maxCharacters);
            this._bindEvents();
        },

        /*
         * Function to bind the 'shown.bs.modal' and 'hidden.bs.modal' events of the Bootstrap modal component
         * and 'input' event for the textArea
         */
        _bindEvents : function () {
            this.$element.on('shown.bs.modal', $.proxy(this._onShown, this));
            this.textArea.on('input', $.proxy(this._onInput, this));
            this.$element.on('hidden.bs.modal', $.proxy(this._onHidden, this));
        },

        /*
         * Function to set focus on the widget's textarea and set any values and attributes
         * of plugin components
         */
        _onShown : function () {
            this._setCharacterCount();
            // Following lines are a hack to set the cursor at the end of the text
            // when existing text is loaded into the widget
            var notesValue = this.getText();
            this.setText('');
            this.textArea.focus();
            this.setText(notesValue);
        },

        /*
         * Function to handle widget behavior on text input
         */
        _onInput : function () {
            this._setCharacterCount();
        },

        /*
         * Function to reset the widget when it is hidden
         */
        _onHidden : function () {
            this.setText('');
            this._disableCharacterCountDisplay();
            this._disableDoneButton();
        },

        /*
         * Function to set the values of the character count
         */
        _setCharacterCount : function () {
            var text = this.getText();
            var characterCount = text.length;
            var trimmedCharacterCount = text.trim().length;
            this.characterCountDisplay.text(this.characterLimit-characterCount);
            if (characterCount === 0) {
                this._disableCharacterCountDisplay();
            }
            else {
                this._enableCharacterCountDisplay();
            }
            // Enable the done button only when there is non-whitespace text
            if (trimmedCharacterCount === 0) {
                this._disableDoneButton();
            }
            else {
                this._enableDoneButton();
            }
        },

        /*
         * Function to enable the character count display
         */
        _enableCharacterCountDisplay : function () {
            this.characterCountDisplay.removeClass('hidden');
        },

        /*
         * Function to disable the character count display
         */
        _disableCharacterCountDisplay : function () {
            this.characterCountDisplay.addClass('hidden');
        },

        /*
         * Function to enable the done button
         */
        _enableDoneButton : function () {
            this.doneButton.removeAttr('disabled');
        },

        /*
         * Function to disable the done button
         */
        _disableDoneButton : function () {
            this.doneButton.attr('disabled', 'disabled');
        },

        /*
         * Function to show error message on the character counter
         */
        displayErrorMessage : function (errorText) {
            this.characterCountDisplay.text(errorText);
            this._enableCharacterCountDisplay();
        },

        /*
         * Function to show the widget
         */
        show : function () {
            this.$element.modal('show');
        },

        /*
         * Function to hide the widget
         */
        hide : function () {
            this.$element.modal('hide');
        },

        /*
         * Function to get text from the widget
         */
        getText : function () {
            return this.textArea.val();
        },

        /*
         * Function to set text in the widget
         */
        setText : function (text) {
            this.textArea.val(text);
        },

        /*
         * Function to get the title from the widget
         */
        getTitle : function () {
            return this.title.text();
        },

        /*
         * Function to set the title in the widget
         */
        setTitle : function (text) {
            this.title.text(text);
        },

        /*
         * Function to get the maximum character limit from the widget
         */
        getMaxCharactersLimit : function () {
            return parseInt(this.textArea.attr('maxlength'), 10);
        },

        /*
         * Function to set the maximum character limit on the widget
         */
        setMaxCharactersLimit : function (maximumCharacters) {
            this.textArea.attr('maxlength', maximumCharacters.toString());
            this.characterLimit = maximumCharacters;
        }
    };

    /*
     * Notes widget plugin definition
     */
    var old = $.fn.notesWidget;

    $.fn.notesWidget = function (option, parameter) {
        var returnValue = [];
        this.each(function () {
            var $this = $(this);
            // Check if the object exists. If it does not exist create it and initialize it.
            var notesWidget = $this.data("notesWidget");
            if (!notesWidget) {
                notesWidget = new NotesWidget(this);
                $this.data("notesWidget", notesWidget);
                notesWidget._init(option);
            }
            // Making a function public but prefixing it with an underscore to indicate it is an internal function
            // is a best practice. Hence checking if the function name begins with a underscore or not.
            else if (typeof option === 'string' && option.charAt(0) !== '_') {
                var textAreaText = notesWidget[option](parameter);
                returnValue.push(textAreaText);
            }
        });
        if (returnValue.length === 1) {
            return returnValue[0];
        }
        else if (returnValue.length > 1) {
            return returnValue;
        }
        else {
            return this;
        }
    };

    $.fn.notesWidget.Constructor = NotesWidget;

    /*
     * Notes widget plugin default values
     */
    $.fn.notesWidget.defaults = {
        'maxCharacters': 1000
    };

    /*
     * Notes widget no conflict
     */
    $.fn.notesWidget.noConflict = function () {
        $.fn.notesWidget = old;
        return this;
    };
})(jQuery, window, document);
