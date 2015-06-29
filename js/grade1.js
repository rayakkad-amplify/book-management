$(document).ready(function() {

    $('#pathways-main-button').popover();

    var NUMBER_BARS = 5;
    var performanceBarArray = [];

    // DORF Accuracy mapping data
    var dorfAccuracyMap = [
        {
            rangeValues: [0, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99],
            mapValues: [0, 3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81, 87, 93, 99, 105]
        }
    ];

    // All values required for the performance bars
    var allStackedBarData = [
        {
            areasData: [
                {'dataValue': 47, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 58, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 153, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ],
            progressIndicatorData: [
                {'dataValue': 0, 'backgroundColor': "#000", 'fontColor': "#000"}
            ],
            progressIndicatorVisible: true,
            minMaxValuesColor: '#929292',
            minMaxValuesVisible: false
        },

        {
            areasData: [
                {'dataValue': 6, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 13, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 60, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ],
            progressIndicatorData: [
                {'dataValue': 0, 'backgroundColor': "#000", 'fontColor': "#000"}
            ],
            progressIndicatorVisible: true,
            minMaxValuesColor: '#929292',
            minMaxValuesVisible: false
        },

        {
            areasData: [
                {'dataValue': 32, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 47, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 155, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ],
            progressIndicatorData: [
                {'dataValue': 0, 'backgroundColor': "#000", 'fontColor': "#000"}
            ],
            progressIndicatorVisible: true,
            minMaxValuesColor: '#929292',
            minMaxValuesVisible: false
        },

        {
            areasData: [
                {'dataValue': 82, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 90, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 100, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ],
            progressIndicatorData: [
                {'dataValue': 0, 'backgroundColor': "#000", 'fontColor': "#000"}
            ],
            progressIndicatorVisible: true,
            minMaxValuesColor: '#929292',
            minMaxValuesVisible: false
        },

        {
            areasData: [
                {'dataValue': 111, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 155, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 380, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ],
            progressIndicatorData: [
                {'dataValue': 0, 'backgroundColor': "#000", 'fontColor': "#000"}
            ],
            progressIndicatorVisible: true,
            minMaxValuesColor: '#929292',
            minMaxValuesVisible: false
        }
    ];

    var dibelsComposite = $('#dibels-composite');
    var nwfWWRInput = $('#nwf-wwr');
    var dorfFluencyInput = $('#dorf-fluency');
    var dorfAccuracyInput = $('#dorf-accuracy');
    
    for (var index = 0; index < NUMBER_BARS; index++) {
        // Get a serial id for each performance bar
        var element = '#amplify-performance-bar' + index;
        performanceBarArray.push($(element));

        // Create the performance bar for each id
        performanceBarArray[index].amplifyPerformanceBar(allStackedBarData[index]);

        var performanceBarAreas = performanceBarArray[index].find('.performance-bar-area');

        // For right aligning the red cutpoint area
        performanceBarAreas.last().find('span').addClass('right-align');

        // For hiding the max values
        var maxValueSpan = performanceBarAreas.first().find('span');
        maxValueSpan.css({'display': 'none'});

        // Add a tooltip to each bar area with corresponding data value as tooltip title
        performanceBarAreas.each(function () {
            // Get the data of this specific element
            var thisD3ElementData = d3.select(this).data();
            // Add title to tooltip and data-toggle attribute to the element associated
            // with it
            var tooltip = $('.ui-toolkit .tooltip');
            $(this).tooltip({
                title: thisD3ElementData[0].dataValue,
                placement: 'bottom'
            });
            $(this).attr('data-toggle', 'tooltip');

            // On shown.bs.tooltip event, adjust the left position of the tooltip to
            // show the tooltip at the end of each bar area 
            $(this).on('shown.bs.tooltip',  function () {
                // Get the specific tooltip since there can be more than one instance of the
                // tooltip at a given time
                var self = $(this);
                var selfParentID = self.parent().attr('id');
                // Calculate and set left position of the tooltip
                var tooltip = $('.ui-toolkit #' + selfParentID + ' .tooltip.fade.bottom.in');
                var tooltipLeftPosition = tooltip.prev().width() - tooltip.width() / 2;
                tooltip.css({
                    "left" : tooltipLeftPosition + 'px',
                    "top" : "2px"
                });
            });
        });
    }

    $('.performance-bar-input').on('input', function () {
        // Set the progress indicator depending on the input value
        var performanceBarInputValue = parseInt($(this).val());
        var performanceBarId = $(this).prev().children().attr('id');
        var index = parseInt(performanceBarId.substr(23, 1));
        // Set the position of the progress indicator to input value is its not NaN, else set to 0
        if (isNaN(performanceBarInputValue) === false) {
            performanceBarArray[index].amplifyPerformanceBar('progressIndicatorPosition', performanceBarInputValue);
        } else {
            performanceBarArray[index].amplifyPerformanceBar('progressIndicatorPosition', 0);
        }
        
        // Highlight the button corresponding to the input value
        highlightButton($(this), performanceBarInputValue);

        // Calculate the composite score
        calculateCompositeScore();
    });

    $('.amplify-modal .btn-secondary').click(function () {
        // Find the perfomance bar corresponding to the same row as the clicked button
        var buttonDataValue = parseInt($(this).attr('data-value'));
        var buttonRow = $(this).parent().parent();
        var performanceBar = buttonRow.find('.performance-bar');
        var performanceBarID = performanceBar.attr('id');
        var index = performanceBarID.substr(23, 1);
        // Set position of the progress indicator based on the min value of the range in the button
        performanceBarArray[index].amplifyPerformanceBar('progressIndicatorPosition', buttonDataValue);

        // Set value of input box on the same row as the button
        var performanceBarInputValue = buttonRow.find('.performance-bar-input');
        performanceBarInputValue.val(buttonDataValue);

        // Remove any previously highlighted button and highlight the clicked button
        var rowButtons = buttonRow.find('.btn');
        rowButtons.removeClass('btn-quaternary');
        $(this).addClass('btn-quaternary');

        // Calculate the composite score
        calculateCompositeScore();
    });

    /* 
     * Function to highlight the button corresponding to the same row as the 
     * input box based on the value of the input box
     */
    function highlightButton (inputBox, inputBoxValue) {
        // Highlight corresponding button if input is changed
        var buttonRow = inputBox.parent().parent();
        // Get all buttons in the same row as the performance bar
        var rowButtons = buttonRow.find('.btn');
        rowButtons.removeClass('btn-quaternary');
        var targetButton;
        // Get the button whose range corresponds to the input value
        rowButtons.each(function () {
            var buttonDataValue = parseInt($(this).attr('data-value'));
            if (inputBoxValue >= buttonDataValue) {
                targetButton = $(this);
            }
        });
        // Highlight the button
        if (targetButton !== undefined) {
            targetButton.addClass('btn-quaternary');
        }
    }

    /* 
     * Function to calculate and display the composite score based on NWF-WWR, DORF-Fluency 
     * and DORF-Accuracy values. 
     */
    function calculateCompositeScore () {
        // Calculate composite score
        var mappedIndex;

        // Get NWF-WWR input value
        var nwfWWRValue = parseInt(nwfWWRInput.val());

        // Get DORF-Fluency input value
        var dorfFluencyValue = parseInt(dorfFluencyInput.val());
    
        // Get DORF-Accuracy input value
        var dorfAccuracyValue = parseInt(dorfAccuracyInput.val());
        // Get the mapped value only if it is not NaN
        if (isNaN(dorfAccuracyValue) === false) {
            for (var index = 0, len = dorfAccuracyMap[0].rangeValues.length; index < len; index++) {
                if (dorfAccuracyValue >= dorfAccuracyMap[0].rangeValues[index]) {
                    mappedIndex = index;
                }
            }
            dorfAccuracyValue = dorfAccuracyMap[0].mapValues[mappedIndex];
        }

        // Calculate the composite score
        // Set progress indicator position only if composite score is not NaN, else set to 0
        var compositeScore = (nwfWWRValue * 2) + dorfFluencyValue + dorfAccuracyValue;
        if (isNaN(compositeScore) === false) {
            performanceBarArray[performanceBarArray.length - 1].amplifyPerformanceBar('progressIndicatorPosition', compositeScore);    
        } else {
            performanceBarArray[performanceBarArray.length - 1].amplifyPerformanceBar('progressIndicatorPosition', 0);    
        }
        
        // Display the EOY composite score value
        dibelsComposite.html(function() {
            $(this).removeClass();
            // Display a dash if the composite score is NaN
            if (isNaN(compositeScore)) {
                return "&mdash;";
            }
            else {
                // Find the cutpoint color (red, yellow, green) corresponding to the value
                // of the composite score
                var cutPointIndex = 0;
                for (var index = 0, len = allStackedBarData[allStackedBarData.length - 1].areasData.length; index < len; index++) {
                    if (compositeScore <= allStackedBarData[allStackedBarData.length - 1].areasData[index].dataValue) {
                        cutPointIndex = index;
                    }
                }
                // Set color to the composite score
                if (cutPointIndex === 2) {
                    $(this).addClass('std-red');
                } else if (cutPointIndex === 1) {
                    $(this).addClass('std-yellow');
                } else {
                    $(this).addClass('std-green');
                }
                return compositeScore;
            }
        });
    }
});
