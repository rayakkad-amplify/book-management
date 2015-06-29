/*
 * Code example to show functionality of the Amplify stacked bar widget
 */

(function ($, d3) {
    $(document).ready(function() {
        myBarData1 = {
            areasData: [
                {'dataValue': 40, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 70, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 200, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ],
            progressIndicatorData: [
                {'dataValue': 170}
            ],
            barAreasValuesVisible: true,
            progressIndicatorVisible: true,
            minMaxValuesColor: "#929292"
        };
        stackedBar1 = $('#amplify-performance-bar1');
        stackedBar1.amplifyPerformanceBar(myBarData1);

        myBarData2 = {
            areasData: [
                {'dataValue': 20, 'backgroundColor': "#bb0b03", 'fontColor': "#000"},
                {'dataValue': 150, 'backgroundColor': "#f2d301", 'fontColor': "#000"},
                {'dataValue': 250, 'backgroundColor': "#6aa506", 'fontColor': "#000"}
            ],
            maxValue: 300,
            barAreasValuesVisible: true,
            minMaxValuesColor: "#000"
        };
        stackedBar2 = $('#amplify-performance-bar2');
        stackedBar2.amplifyPerformanceBar(myBarData2);

        // Change progress indicator position
        var dropdownButton = $("#progress-indicator-dropdown .btn-dropdown-basic");
        $("#progress-indicator-dropdown").on('hidden.bs.dropdown', function () {
            var dropDownData = dropdownButton.attr('data-value');
            stackedBar1.amplifyPerformanceBar('progressIndicatorPosition', dropDownData);
        });

        // Change bar areas
        $('#change-bar-areas').on('click', function() {
            stackedBar1.amplifyPerformanceBar('performanceBarAreas', [
                {'dataValue': 20, 'backgroundColor': "#bb0b03", 'fontColor': "#000"},
                {'dataValue': 150, 'backgroundColor': "#f2d301", 'fontColor': "#000"},
                {'dataValue': 250, 'backgroundColor': "#6aa506", 'fontColor': "#000"}
            ]);
        });
        $('#reset-bar-areas').on('click', function() {
            stackedBar1.amplifyPerformanceBar('performanceBarAreas', [
                {'dataValue': 40, 'backgroundColor': "#bb0b03", 'fontColor': "#929292"},
                {'dataValue': 70, 'backgroundColor': "#f2d301", 'fontColor': "#929292"},
                {'dataValue': 200, 'backgroundColor': "#6aa506", 'fontColor': "#929292"}
            ]);
        });

        // Bar areas values visibility
        $('#show-bar-areas-values').on('click', function() {
            stackedBar1.amplifyPerformanceBar('barAreasValuesVisibility', true);
        });
        $('#hide-bar-areas-values').on('click', function() {
            stackedBar1.amplifyPerformanceBar('barAreasValuesVisibility', false);
        });

        // Progress indicator visibility
        $('#show-progress-indicator').on('click', function() {
            stackedBar1.amplifyPerformanceBar('progressIndicatorVisibility', true);
        });
        $('#hide-progress-indicator').on('click', function() {
            stackedBar1.amplifyPerformanceBar('progressIndicatorVisibility', false);
        });

        // Change min max values
        $('#change-min-value').on('click', function() {
            stackedBar1.amplifyPerformanceBar('minValue', 30);
        });
        $('#reset-min-value').on('click', function() {
            stackedBar1.amplifyPerformanceBar('minValue', 0);
        });
        $('#change-max-value').on('click', function() {
            stackedBar1.amplifyPerformanceBar('maxValue', 100);
        });
        $('#reset-max-value').on('click', function() {
            stackedBar1.amplifyPerformanceBar('maxValue', 200);
        });
    });
}(jQuery, d3));
