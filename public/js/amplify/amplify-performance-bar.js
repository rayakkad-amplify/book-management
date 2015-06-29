(function ($, d3, window, document, undefined) {
    /*
     * Amplify Performance Bar widget class definition
     */
    var AmplifyPerformanceBar = function (element, options) {
        this._element = element;
        this._$element = $(element);
        this._d3Element = d3.select(element);

        options = $.extend({}, AmplifyPerformanceBar.DEFAULTS, options);
            
        this._areasData = options.areasData;
        utilities.sortArrayDescendingOrder(this._areasData);
        this._progressIndicatorData = options.progressIndicatorData;
        this._barAreasValuesVisible = options.barAreasValuesVisible;
        this._progressIndicatorVisible = options.progressIndicatorVisible;
        this._minMaxValuesVisible = options.minMaxValuesVisible;
        this._minMaxValuesColor = options.minMaxValuesColor;
        this._numberOfBarAreas = this._areasData.length;
        this._colorScheme = options.colorScheme;
        this._minValue = options.minValue;
        
        // If the max bar value is not set, then set it to the value of the last bar area
        if ('maxValue' in options) {
            this._maxValue = options.maxValue;
        } else {
            this._maxValue = this._areasData[0].dataValue;
        }

        render(this);
    };

    /*
     * Function to calculate the scaled value of the bar areas and progress indicator
     */
    function calculateScaledValue (elementData, minValue, maxValue) {
        var performanceBarScale = d3.scale.linear()
                        .domain([minValue, maxValue]) // get input domain min max values
                        .range([0, 100]) // set output range
                        .clamp(true); // force values outside the range to nearest min max values
        for (var index = 0, len = elementData.length; index < len; index++) {
            elementData[index].scaledValue = performanceBarScale(elementData[index].dataValue);
        }
    }

    /*
     * Function to add the D3 elements to the DOM and attach a span to them
     */
    function addD3ElementsToDOM (cssSelector, elementData, element, d3Element) {
        // We need to attach things to specific elements. This is to avoid errors
        // when there are multiple bars
        var cssQuerySelector = '#' + element.id + ' .' + cssSelector;
        var selectorData = addDataToD3Element(cssQuerySelector, elementData, d3Element);
        var selectorEnter = selectorData.enter();
        var selectorEnterDivs = selectorEnter.append('div').attr('class', cssSelector);
        selectorEnterDivs.append('span');
        return selectorEnterDivs;
    }

    /*
     * Function to get the D3 elements and attach data to them
     */
    function addDataToD3Element (cssSelector, elementData, d3Element) {
        var selector = d3Element.selectAll(cssSelector);
        var selectorData = selector.data(elementData);
        return selectorData;
    }

    /*
     * Function to render the bar areas the first time
     */
    function render (performanceBar) {
        // Set default color scheme
        for (var index = 0; index < performanceBar._numberOfBarAreas; index++) {
            // If background color is not defined
            if (('backgroundColor' in performanceBar._areasData[index]) === false) {
                if ((index % 2) === 0) { // If index is even
                    performanceBar._areasData[index].backgroundColor = performanceBar._colorScheme.darkGrey;
                } else { // If index is odd
                    performanceBar._areasData[index].backgroundColor = performanceBar._colorScheme.lightGrey;
                }
            }
            // If font color is not defined
            if (('fontColor' in performanceBar._areasData[index]) === false) {
                performanceBar._areasData[index].fontColor = performanceBar._colorScheme.black;
            }
        }

        calculateScaledValue(performanceBar._areasData, performanceBar._minValue, performanceBar._maxValue);

        var selectedDivs = addD3ElementsToDOM('performance-bar-area', performanceBar._areasData,
                                                performanceBar._element, performanceBar._d3Element);
        setStyles(selectedDivs, 'width', 'background');

        // Render the text of the bar areas if they are set to be visible
        if (performanceBar._barAreasValuesVisible) {
            setText(performanceBar, 'performance-bar-area');
        }
        // Update the text of the min max values if minMaxValues visible is true
        if (performanceBar._minMaxValuesVisible) {
            setMinBarValueText(performanceBar);
            setMaxBarValueText(performanceBar);
            setMinMaxFontColor(performanceBar);
        }

        // Render the progress indicator if it is visible
        if (performanceBar._progressIndicatorVisible) {
            renderProgressIndicator(performanceBar);
        }
    }

    /*
     * Function to render the progress indicator the first time
     */
    function renderProgressIndicator (performanceBar) {
        // Set default color scheme
        // If background color is not defined
        if (('backgroundColor' in performanceBar._progressIndicatorData[0]) === false) {
            performanceBar._progressIndicatorData[0].backgroundColor = performanceBar._colorScheme.black;
        }
        // If font color is not defined
        if (('fontColor' in performanceBar._progressIndicatorData[0]) === false) {
            performanceBar._progressIndicatorData[0].fontColor = performanceBar._colorScheme.black;
        }
        
        // Calculate the progress indicator value to make it appropriate to the bar scale
        calculateScaledValue(performanceBar._progressIndicatorData, performanceBar._minValue,
                                performanceBar._maxValue);

        // Render the progress indicator
        var barProgressIndicatorEnteredDivs = addD3ElementsToDOM('performance-bar-progress-indicator',
                                                performanceBar._progressIndicatorData, performanceBar._element,
                                                performanceBar._d3Element);

        setStyles(barProgressIndicatorEnteredDivs, 'left', 'background');
        
        // Update text
        setText(performanceBar, 'performance-bar-progress-indicator');
    }

    /*
     * Function to render the styles of the bar elements
     */
    function setStyles (enteredDivs, property1, property2) {
        // Update width or left position depending on what is passed as property1
        enteredDivs.style(property1, function (boundData) {
            return boundData.scaledValue + '%'; 
        });
        
        // Update background color
        enteredDivs.style(property2, function (boundData) {
            return boundData.backgroundColor; 
        });
    }

    /*
     * Function to render the text on the bar
     */
    function setText (performanceBar, cssSelector, textData) {
        // We need to attach elements and properties to specific elements. This is to avoid errors
        // when there are multiple bars
        var cssQuerySelector = '#' + performanceBar._element.id + ' .' + cssSelector;
        var selector = d3.selectAll(cssQuerySelector);
        var selectorSpan = selector.select('span');
        // Set text color
        selectorSpan.style('color', function (boundData) {
            return boundData.fontColor;
        });

        selectorSpan.text(function (boundData) {
            // Set text on progress indicator
            if (textData) {
                return textData;
            }
            // Set text of bar areas only if the value is greater than minValue and less than maxValue
            else if (boundData.dataValue >= performanceBar._minValue && 
                        boundData.dataValue <= performanceBar._maxValue) {
                return boundData.dataValue;
            }
        });
    }

    /*
     * Function to render the min value on the bar
     */
    function setMinBarValueText (performanceBar) {
        var $performanceBar = $('#' + performanceBar._element.id);
        $performanceBar.attr('data-minValue', performanceBar._minValue);
    }

    /*
     * Function to render the max value on the bar
     */
    function setMaxBarValueText (performanceBar) {
        var $performanceBar = $('#' + performanceBar._element.id);
        $performanceBar.attr('data-maxValue', performanceBar._maxValue);
    }

    /*
     * Function to set the font color for min and max values
     */
    function setMinMaxFontColor (performanceBar) {
        var $performanceBar = $('#' + performanceBar._element.id);
        $performanceBar.css({
            'color': performanceBar._minMaxValuesColor
        });
    }

    AmplifyPerformanceBar.prototype = {
        /*
         * Function to set the performance bar areas
         */
        performanceBarAreas : function (updatedBarAreasData) {
            // If no value is passed, act as getter
            if (updatedBarAreasData === undefined) {
                return this._areasData;
            }

            // If value is passed, act as setter
            var barAreasData,
                selectedDivs,
                updatedValueLength,
                cssQuerySelector;
            
            // Check the number of areas
            updatedValueLength = updatedBarAreasData.length;
            this._areasData = updatedBarAreasData;

            utilities.sortArrayDescendingOrder(this._areasData);
            calculateScaledValue(this._areasData, this._minValue, this._maxValue);
            cssQuerySelector = '#' + this._element.id + ' .performance-bar-area';

            // If the number of areas increase, add a new element and then update the areas
            if (updatedValueLength > this._numberOfBarAreas) {
                // Add the new element(s)
                selectedDivs = addD3ElementsToDOM('performance-bar-area', this._areasData,
                                                    this._element, this._d3Element);
            }

            // If the number of areas decrease, use the exit function to remove extra areas and then update them
            else if (updatedValueLength < this._numberOfBarAreas) {
                barAreasData = addDataToD3Element(cssQuerySelector, this._areasData, this._d3Element);
                barAreasData.exit().remove();
            }

            this._numberOfBarAreas = updatedValueLength;

            // Update the data associated with all the elements
            barAreasData = addDataToD3Element(cssQuerySelector, this._areasData, this._d3Element);
            setStyles(barAreasData, 'width', 'background');

            // Update the text on the bar
            if (this._barAreasValuesVisible) {
                setText(this, 'performance-bar-area');
            }

            // Update the text on the min and max values
            if (this._minMaxValuesVisible) {
                setMinBarValueText(this);
                setMaxBarValueText(this);
                setMinMaxFontColor(this);
            }
        },

        /*
         * Function to set the position of the progress indicator on the bar
         */
        progressIndicatorPosition : function (updatedPosition) {
            // If no value is passed, act as getter
            if (updatedPosition === undefined && this._progressIndicatorVisible) {
                return this._progressIndicatorData[0].dataValue;
            }

            // If value is passed, act as setter
            if (this._progressIndicatorVisible) {
                // Calculate the updated values
                this._progressIndicatorData[0].dataValue = updatedPosition;
                calculateScaledValue(this._progressIndicatorData, this._minValue, this._maxValue);

                var cssQuerySelector = '#' + this._element.id + ' .performance-bar-progress-indicator';
                var barProgressIndicatorData = 
                    addDataToD3Element(cssQuerySelector, this._progressIndicatorData, this._d3Element);
                // Update the position of progress indicator
                setStyles(barProgressIndicatorData, 'left', 'background');

                // Update text
                // If the updatedPosition is greater than maxValue or less than minValue
                // then then progress indicator's text is the updated value. Else its the scaled position
                if (updatedPosition > this._maxValue || updatedPosition < this._minValue) {
                    setText(this, 'performance-bar-progress-indicator', updatedPosition);
                } else {
                    setText(this, 'performance-bar-progress-indicator');
                }
            }
        },

        /*
         * Function to get/set the visibility of the bar areas values
         */
        barAreasValuesVisibility : function (isVisible) {
            // If no value is passed, act as getter
            if (isVisible === undefined) {
                return this._barAreasValuesVisible;
            }

            // If value is passed, act as setter
            this._barAreasValuesVisible = isVisible;
            var performanceBar = $("#" + this._element.id);
            var barValuesSpans = performanceBar.find('.performance-bar-area').children();
            if (isVisible) {
                setText(this, 'performance-bar-area');
                barValuesSpans.show(100);
            } else {
                barValuesSpans.hide(100);    
            }
        },

        /*
         * Function to get/set the visibility of the progress indicator
         */
        progressIndicatorVisibility : function (isVisible) {
            // If no value is passed, act as getter
            if (isVisible === undefined) {
                return this._progressIndicatorVisible;
            }

            // If value is passed, act as setter
            this._progressIndicatorVisible = isVisible;
            var performanceBar = $("#" + this._element.id);
            var progressIndicator = performanceBar.find('.performance-bar-progress-indicator');
            if (isVisible) {
                progressIndicator.show(100);
                // If the progress indicator has not been set before, render it 
                renderProgressIndicator(this);
            } else {
                progressIndicator.hide(100);    
            }
        },

        /*
         * Function to get/set the min value of the bar
         */
        minValue : function (updatedMinBarValue) {
            // If no value is passed, act as getter
            if (updatedMinBarValue === undefined) {
                return this._minValue;
            }

            // If value is passed, act as setter
            this._minValue = updatedMinBarValue;
            this.performanceBarAreas(this._areasData);
            this.progressIndicatorPosition(this._progressIndicatorData[0].dataValue);
        },

        /*
         * Function to get/set the max value of the bar
         */
        maxValue : function (updatedMaxBarValue) {
            // If no value is passed, act as getter
            if (updatedMaxBarValue === undefined) {
                return this._maxValue;
            }

            // If value is passed, act as setter
            this._maxValue = updatedMaxBarValue;
            this.performanceBarAreas(this._areasData);
            this.progressIndicatorPosition(this._progressIndicatorData[0].dataValue);
        },

        /*
         * Function to get/set the visibility of the min max values
         */
        minMaxValuesVisibility : function (isVisible) {
            // If no value is passed, act as getter
            if (isVisible === undefined) {
                return this._minMaxValuesVisible;
            }

            // If value is passed, act as setter
            this._minMaxValuesVisible = isVisible;
            var performanceBar = $("#" + this._element.id);
            if (isVisible === false) {
                performanceBar.addClass('hide-min-value');
                performanceBar.addClass('hide-max-value');
            } else {
                performanceBar.removeClass('hide-min-value');
                performanceBar.removeClass('hide-max-value');
            }
        },

        /*
         * Function to get/set background of the performance bar
         */
        performanceBarBackgroundColor : function (backgroundColor) {
            // If no value is passed, act as getter
            if (backgroundColor === undefined) {
                return this._$element.css("background-color");
            }

            // If value is passed, act as setter
            this._$element.css({
                "background-color" : backgroundColor
            });
        }
    };

    /*
     * Amplify Performance Bar widget plugin definition
     */
    var old = $.fn.amplifyPerformanceBar;

    $.fn.amplifyPerformanceBar = function (option, parameter) {
        var returnValue = [];
        this.each(function () {
            var $this = $(this);
            // Check if the object exists. If it does not exist create it and initialize it.
            var amplifyPerformanceBar = $this.data('amplifyPerformanceBar');
            if (!amplifyPerformanceBar) {
                amplifyPerformanceBar = new AmplifyPerformanceBar(this, option);
                $this.data('amplifyPerformanceBar', amplifyPerformanceBar);
            }
            // Making a function public but prefixing it with an underscore to indicate it is an internal function
            // is a best practice. Hence checking if the function name begins with a underscore or not.
            else if (typeof amplifyPerformanceBar[option] === 'function' && option.charAt(0) !== '_') {
                var textAreaText = amplifyPerformanceBar[option](parameter);
                returnValue.push(textAreaText);
            }
            else if (typeof option !== 'undefined' && typeof option !== 'object' &&
                        typeof amplifyPerformanceBar[option] !== 'function') {
                throw "Undefined function";
            }
        });
        if (returnValue.length === 1) {
            return returnValue[0];
        }
        else if (returnValue.length > 1) {
            return returnValue;
        }
        else if (returnValue.length === 0) {
            return this;
        }
    };

    $.fn.amplifyPerformanceBar.Constructor = AmplifyPerformanceBar;

    /*
     * Amplify Performance Bar widget plugin default values
     */
    AmplifyPerformanceBar.DEFAULTS = {
        areasData: [
            {'dataValue': 0},
        ],
        progressIndicatorData: [
            {'dataValue': 0}
        ],
        minValue: 0,
        barAreasValuesVisible: true,
        progressIndicatorVisible: false,
        minMaxValuesVisible: true,
        minMaxValuesColor: "#000",
        colorScheme: {'darkGrey': "#aaa", 'lightGrey': "#ddd", 'black': "#000"}
    };

    /*
     * Amplify Performance Bar widget no conflict
     */
    $.fn.amplifyPerformanceBar.noConflict = function () {
        $.fn.amplifyPerformanceBar = old;
        return this;
    };
})(jQuery, d3, window, document);
