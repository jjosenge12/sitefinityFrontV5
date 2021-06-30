var files = [];

$(document).ready(function () {

    $("#select-one").select2({
        dropdownParent: $("#select-one").parent()
    });

    $("select").on("select2:open", function () {
        $(this).siblings("[class='focus-border']").addClass("active");
    });

    $("select").on("select2:close", function () {
        $(this).siblings("[class='focus-border active']").removeClass("active");
    });

    $("#select-one").on("select2:select", function (e) {

        if (e.params.data.id != "0") {
            var file = $("#select-one option:selected")[0].value;
            window.open(file);
        }
    });
});