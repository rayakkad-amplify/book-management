(function($, window, document, undefined) {
    $('#book-results-table').DataTable({
        "lengthMenu": [[50, 100, 150, -1], [50, 100, 150, "All"]],
        "order": [],
        "columnDefs": [ {
            "targets"  : 'no-sort',
            "orderable": false,
        }]
    });

    $('#personal-list-table').DataTable({
        "lengthMenu": [[50, 100, 150, -1], [50, 100, 150, "All"]],
        "order": [],
        "columnDefs": [ {
            "targets"  : 'no-sort',
            "orderable": false,
        }]
    });

    $('#school-list-table').DataTable({
        "lengthMenu": [[50, 100, 150, -1], [50, 100, 150, "All"]],
        "order": [],
        "columnDefs": [ {
            "targets"  : 'no-sort',
            "orderable": false,
        }]
    });

    $('#district-list-table').DataTable({
        "lengthMenu": [[50, 100, 150, -1], [50, 100, 150, "All"]],
        "order": [],
        "columnDefs": [ {
            "targets"  : 'no-sort',
            "orderable": false,
        }]
    });
})(jQuery, window, document);
