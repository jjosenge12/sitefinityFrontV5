var files = [];

$(document).ready(function () {

    $("#step-two").click(function () {
        $("#step-line").toggleClass("active-step");
        $(this).toggleClass("active-step");

    });

    $("#select-one").select2({
        dropdownParent: $("#select-one").parent()
    });
    $("#select-two").select2({
        dropdownParent: $("#select-two").parent()
    });

    $("select").on("select2:open", function () {
        $(this).siblings("[class='focus-border']").addClass("active");
    });

    $("select").on("select2:close", function () {
        $(this).siblings("[class='focus-border active']").removeClass("active");
    });

    $("#select-one").on("select2:select", function (e) {
        let libId = $("#library-id").val();
        $("#step-line").addClass("active-step");
        $("#step-two").addClass("active-step");

        if (e.params.data.id != "0") {
            $.getJSON('/get-docs/' + libId + "/" + e.params.data.id, null, function (data) {
                console.log(data);
                $("#select-two").html($("#select-two option[value='0']"));
                $.each(data.documents, function () {
                    files.push(this);

                    var option = document.createElement('option');
                    option.innerHTML = this.Title;
                    option.value = this.Id;
                    option.dataset.url = this.Url;
                    $("#select-two").append(option);
                });
            });
        }
    });

    $("#select-two").on("select2:select", function (e) {

        if (e.params.data.id != "0") {
            var file = $("#select-two option:selected")[0];
            window.open(file.dataset.url);
        }
    });
});

function getDocuments(folderId) {
    $.getJSON('/api/default/documents', null, function (data) {
        $.each(data.value, function () {
            if (this.FolderId == folderId) {
                files.push(this);

                var option = document.createElement('option');
                option.innerHTML = this.Title;
                option.value = this.Id;
                option.dataset.url = this.Url;
                $("#select-two").append(option);
            }
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert('Error al intentar obtener los documentos!');
    });
}