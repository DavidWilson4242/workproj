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

    // given a target, returns the line [distance] lines
    // after the target.  For example, consider:
    //   DATE OF BIRTH
    //   January 24th, 2000
    // nextline_n("DATE OF BIRTH", 1); // January 24th, 2000
    var nextline_n = function(target, distance) {
        for (var i = 0; i < lines.length; i++) {
        	var substr = lines[i].slice(0, target.length);
            if (substr == target) {
                return lines[i + distance];
            }
        }
        return "";
    }

    var nextline = function(target) {
        return nextline_n(target, 1);
    }

    var colon_field = function(target) {
    	for (var i = 0; i < lines.length; i++) {
    		var substr = lines[i].substring(0, lines.length + 1);
    		var colon = lines[i].charAt(lines.length + 1);
    		if (substr == target && colon == ':') {
    			return lines[i].substring(lines.length + 2);
    		}
    	}
    	return "";
    }

    var full_name = nextline("Name:");

    return {
        "client_first_name": full_name.split(" ")[0],
        "client_last_name":  full_name.split(" ")[1],
        "client_email":      nextline("Email:"),
        "altair_fileno":     nextline("Altair File Number"),
        "origin_addr":       nextline_n("Origin Address", 2),
        "destination_addr":  nextline_n("Destination Address", 2),
        "company_name":      nextline("Company:"),
        "mobile_phone":      colon_field("Mobile Phone")
    }
}

function push_information(info) {
	console.log(info.company_name + "!");
    $('[name="LastName"]').val(info.client_last_name).change();
    $('[name="FirstName"]').val(info.client_first_name).change();
    $('[name="CompanyName"]').val(info.company_name).change();
    $('[name="EmailAddress"]').val(info.client_email).change();
    $('[name="ClientId"').val("1142").change();

    // force FormalName to update
   	$('[name="FormalName"]').val(info.client_first_name + " " + info.client_last_name).change();
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
            console.log(content);
            push_information(get_altair_info(content));
        }
    }
}
