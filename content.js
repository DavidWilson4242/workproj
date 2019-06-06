const new_relo_tab = "http://etrans.portalfront.com/etrans/Relocation/NewTransferee.asp";

function get_altair_info(content) {
    var lines = [];
    var current = "";
    var index = 0;
    while (index < content.length) {
        var c = content.charAt(index);
        if (c == '\n') {
            lines.push(current);
            current = "";
        } else {
            current += c;
        }
        index++;
    }

    var nextline_n = function(target, distance) {
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] == target && i < lines.length - 1) {
                return lines[i + distance];
            }
        }
        return "";
    }

    var nextline = function(target) {
        return nextline_n(target, 1);
    }

    return {
        "client_first_name": nextline("First Name"),
        "client_last_name":  nextline("Last Name"),
        "client_email":      nextline("E-mail Address"),
        "altair_fileno":     nextline("Altair File Number"),
        "origin_addr":       nextline_n("Origin Address", 2),
        "destination_addr":  nextline_n("Destination Address", 2),
        "company_name":      nextline("Company Name")
    }
}

function push_information(info) {
    $('[name="LastName"]').val(info.client_last_name).change();
    $('[name="FirstName"]').val(info.client_first_name).change();
    $("#ClientId").val("1142").change();
}

if (location == new_relo_tab) {

    // create the button
    var new_button_tr = $("body");
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", "new_fast_button");
    button.setAttribute("content", "New FAST");
    button.innerHTML = "New FAST";

    var file_input = document.createElement("INPUT");
    file_input.setAttribute("type", "file");

    new_button_tr.append(file_input);
    new_button_tr.append(button);

    button.onclick = function() {
        var file = file_input.files[0];

        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            push_information(get_altair_info(content));
        }
    }
}
