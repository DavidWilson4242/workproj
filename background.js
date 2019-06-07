var current_relo_data = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message_type == "set_relo_data") {
		current_relo_data = request.data;
		sendResponse({message: "success"});
	} else if (request.message_type == "get_relo_data") {
		if (current_relo_data == null) {
			sendResponse({message: "failure"});
		} else {
			sendResponse({message: "success", relo_data: current_relo_data});
		}
	} else {
		sendResponse({message: "unknown message_type"});
	}
});