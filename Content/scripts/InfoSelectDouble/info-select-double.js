var files = [];

$(document).ready(function () {

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
        $("#select-two").removeAttr("disabled");

        if (e.params.data.id != "0") {
            $.ajax(`/get-docs?folderId=${e.params.data.id}`, {
                success: function (data) {
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

                    $('#select-two').val('0');
                    $('#select-two').trigger('change');
                },
                beforeSend: showLoader,
                complete: hideLoader
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