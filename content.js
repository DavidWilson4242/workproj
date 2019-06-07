const new_relo_tab = "http://etrans.portalfront.com/etrans/Relocation/NewTransferee.asp";
const transferee_tab = "http://etrans.portalfront.com/etrans/Relocation/MainTransferee.asp";
const transport_tab = "http://etrans.portalfront.com/etrans/Relocation/MainTransport.asp?";

const manufacturers = [
	"Acura", "Alfa-Romero", "Aston-Martin", "Audi",
	"Bentley", "BMW", "Bugatti", "Buick", "Byton",
	"Cadillac", "Chevrolet", "Chrysler", "Citroen",
	"Cupra", "Dodge", "Ferrari", "Fiat", "Ford",
	"Geely", "Genesis", "GMC", "Honda", "Hyundai",
	"Infiniti", "Jaguar", "Jeep", "Kia", "Koenigsegg",
	"Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus",
	"Maserati", "Maybach", "Mazda", "Mclaren", "Merdeces",
	"Mini", "Mitsubishi", "Nissan", "Opel", "Pagani",
	"Peugeot", "Pontiac", "Porsche", "Ram", "Renault",
	"Rivian", "Rolls-Royce", "Skoda", "Smart", "Subaru",
	"Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

// given a target, returns the line [distance] lines
// after the target.  For example, consider:
//   DATE OF BIRTH
//   January 24th, 2000
// nextline_n("DATE OF BIRTH", 1); // January 24th, 2000
var nextline_n = function(lines, target, distance) {
    for (var i = 0; i < lines.length; i++) {
    	var substr = lines[i].slice(0, target.length);
        if (substr == target) {
            return lines[i + distance]; 
        }
    }
    return "";
}

// returns a field formatted like this
// FIELD_NAME
// <CONTENTS>
var nextline = function(lines, target) {
    return nextline_n(lines, target, 1);
}

// returns a field formatted like:
// FIELD_NAME: <CONTENTS>
var colon_field = function(lines, target) {
	for (var i = 0; i < lines.length; i++) {
		var substr = lines[i].substring(0, lines.length + 1);
		var colon = lines[i].charAt(lines.length + 1);
		if (substr == target && colon == ':') {
			return lines[i].substring(lines.length + 2);
		}
	}
	return "";
}

// Given the contents of a file, splits it
// into an array of lines and returns it
function convert_to_lines(content) {
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
    return lines;
}

function get_plus_info(content) {
	var lines = convert_to_lines(content);
	var full_name = nextline(lines, "Relocating employee:")

	// gather information about the autos.
	// maximum of three lines each
	var manu = null; // index of manufacturer
	var year = null; // index of year
	var model = null; // index of model
	for (var i = 1; i <= 3; i++) {
		var line_auto = nextline_n(lines, "Vehicle #1", i);
		if (line_auto == "") {
			break;
		}
		if (manufacturers.includes(line_auto)) {
			manu = line_auto;
		} else if (!isNaN(line_auto)) {
			year = parseInt(line_auto);
		} else {
			model = line_auto;
		}
	}

	return {
		"our_client":        "PLUS RELOCATION",
		"client_first_name": full_name.split(" ")[0],
		"client_last_name":  full_name.split(" ")[1],
		"client_email":      nextline(lines, "Email:"),
		"company_name":      nextline(lines, "Company:"),
		"reference_num":     nextline(lines, "Plus file:"),
		"mobile_phone":      nextline(lines, "Mobile phone:"),
		"home_phone":        nextline(lines, "Home phone:"),
		"work_phone":        nextline(lines, "Work phone:"),
		"origin_addr":       nextline(lines, "Departure location:"),
		"destination_addr":  nextline(lines, "Destination location:"),
		"pickup_date":       nextline(lines, "Preferred pickup date(s):"),
		"manufacturer":      manu || "",
		"model":             model || "",
		"year":              year || ""
	}
}


function stringify_address(address) {
	var add_num = address.number || "";
	var street = address.street || "";
	return {
		address_line: add_num + " " + street + " " + address.type,
		state: address.state,
		city: address.city,
		zip: address.zip
	}
}

// NEW RELO TAB
// This is where the user decides whether or not to use
// New FAST.  In the future, this extension should be
// able to automatically determine the client company
// based on the input file. TODO 
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
            // TODO THIS SHOULD NOT BE SPECIFIC TO JUST PLUS RELOCATION!
            // The program should be able to determine the client company
            // from the uploaded file.
          	var info = get_plus_info(content);

		    $('[name="LastName"]').val(info.client_last_name).change();
		    $('[name="FirstName"]').val(info.client_first_name).change();
		    $('[name="CompanyName"]').val(info.company_name).change();
		    $('[name="EmailAddress"]').val(info.client_email).change();
		    $('[name="ClientId"').val("1310").change();

		    // force FormalName to update
		   	$('[name="FormalName"]').val(info.client_first_name + " " + info.client_last_name).change();

		   	var message = {
		   		message_type: "set_relo_data",
		   		data: info
		   	}
		   	// store the current relocation data.  See background.js
		   	chrome.runtime.sendMessage(message, function(response) {
		   		console.log(response.message);
		   	});
        }
    }

// TRANSFEREE TAB
// All we do here is populate some fields.  The user shouldn't need
// to check this, everything should be filled in perfectly.
} else if (location.toString().search(transferee_tab) > -1) {

	chrome.runtime.sendMessage({message_type: "get_relo_data"}, function(response) {

		if (response.message == "failure") {
			return;
		}

		var info = response.relo_data;

	    $("#FirstName").val(info.client_first_name).change();
	    $("#LastName").val(info.client_last_name).change();
	    $("#CellPhone").val(info.mobile_phone).change();
	    $("#CellPhone2").val(info.home_phone).change();
	    $("#ClientReference").val(info.reference_num).change();
	    $("#EmailAddress").val(info.client_email).change();
	    $('[name="CompanyName"]').val(info.company_name).change();
	});

// TRANSPORT TAB
// The way I see it, it'll be impossible to make this part perfect.
// Addresses aren't always complete, making them difficult to parse.
// Sometimes car information is also incomplete.  These are things that
// the user will definitely need to look over after using New FAST.
} else if (location.toString().search(transport_tab) > -1) {

	chrome.runtime.sendMessage({message_type: "get_relo_data"}, function(response) {
		
		if (response.message == "failure") {
			return;
		}

		var info = response.relo_data;

		// create formal name
		var prefix = $('[name="Prefix"]').val();
		var formal_name = prefix + " " + info.client_first_name + " " + info.client_last_name;
		$('[name="FormalName"]').val(formal_name).change();
		$('[name="PickupFormalName"]').val(formal_name).change();
		$('[name="DropoffFormalName"]').val(formal_name).change();

		// setup origin address
		var origin_string = stringify_address(parseAddress.parseLocation(info.origin_addr));
		$("#PickupAddress1").val(origin_string.address_line).change();
		$("#PickupCity").val(origin_string.city).change();
		$("#PickupState").val(origin_string.state).change();
		$("#PickupZip").val(origin_string.zip).change();
		$("#PickupCountry").val("U.S.A.").change();
		$("#PickupCellPhone").val(info.mobile_phone).change();
		$("#PickupHomePhone").val(info.home_phone).change();
		$("#PickupWorkPhone").val(info.work_phone).change();

		// setup destination address
		var dest_string = stringify_address(parseAddress.parseLocation(info.destination_addr));
		$("#DropoffAddress1").val(dest_string.address_line).change();
		$("#DropoffCity").val(dest_string.city).change();
		$("#DropoffState").val(dest_string.state).change();
		$("#DropoffZip").val(dest_string.zip).change();
		$("#DropoffCountry").val("U.S.A.").change();
		$("#DropoffCellPhone").val(info.mobile_phone).change();
		$("#DropoffHomePhone").val(info.home_phone).change();
		$("#DropoffWorkPhone").val(info.work_phone).change();


		// setup information about the transferee
	    $('[name="FirstName"]').val(info.client_first_name).change();
	    $('[name="LastName"]').val(info.client_last_name).change();
	    $('[name="EmailAddress"]').val(info.client_email).change();
	    $('[name="TransfereeCellPhone"]').val(info.mobile_phone).change();
	    $('[name="TransfereeCellPhone2"]').val(info.home_phone).change();

	    // setup information about the auto
	    $("#TransportType").val("Auto").change();

	    $("#CounselorComments").val("PU/LD: " + info.pickup_date).change();
	    // calculate miles
	    // doCalcMiles is defined somewhere else...
	    //$("#Miles").val(doCalcMiles()).change();
	});

}