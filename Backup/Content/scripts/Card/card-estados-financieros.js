var folders = [], files = [], ef_folder_id = "90e3d793-be60-4d3b-9f00-743f0e67a8c9", selected_folder, card_type;

$(document).ready(function () {
    if ((card_type = $("#card-type").val()) == "estados-financieros") {
        ef_folder_id = "3c2d9423-a7a9-4d5f-b491-94b5552c38f0";
    }
    else if (card_type == "informacion-financiera") {
        ef_folder_id = "1f9ecda0-69b7-4b57-8bf8-09ef1a00510a";
    }

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


    $.getJSON('/api/default/folders', null, function (data) {
        $.each(data.value, function () {
            if (this.RootId == ef_folder_id) {
                folders.push(this);

                var option = document.createElement('option');
                option.innerHTML = this.Title;
                option.value = this.Id;
                $("#select-one").append(option);

            }
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert('Error al intentar obtener los documentos!');
    });

    $("#select-one").on("select2:select", function (e) {

        if (e.params.data.id != "0") {
            $("#step-line").addClass("active-step");
            $("#step-two").addClass("active-step");

            getDocuments(e.params.data.id);
        }
    });

    $("#select-two").on("select2:select", function (e) {

        if (e.params.data.id != "0") {
            var file = $("#select-two option:selected")[0];
            console.log(file);
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