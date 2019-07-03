const diary_tab = "https://etrans.portalfront.com/etrans/Common/UserDiary.asp";

if (location == diary_tab) {

	var output_text = "";

	var rows = $(".viewItemEven, .viewItemOdd");

	rows.each(function() {
		var ee_section = $(this).children()[4];
		if (ee_section) {
			var get_link = $(ee_section).find("a").attr("href");
			$.get(get_link, function(data0, status0) {
				var formal_name = $(".TransfereeTitle", data0).text();
				$(".transportSelector", data0).each(function(index) {
					if (index == 3) {
						return;
					}
					var trans_link = $(this).find("a").attr("href");
					$.get(trans_link, function(data1, status1) {
						var parsed_data = {
							"pickup_city":   $("#PickupCity", data1).val(),
							"pickup_state":  $("#PickupState", data1).val(),
							"dropoff_city":  $("#DropoffCity", data1).val(),
							"dropoff_state": $("#DropoffState", data1).val(),
							"car_year":      $("#ModelYear", data1).val(),
							"car_make":      $("#Make", data1).val(),
							"car_model":     $("#Model", data1).val(),
							"pickup_date":   $("#PickupDateStart", data1).val()
						}
						if (parsed_data.pickup_city == undefined) {
							return;
						}
						if (parsed_data.pickup_date == "" || parsed_data.pickup_date == undefined) {
							parsed_data.pickup_date = $("#TransportPickupDateStart", data1).val();
						}
						var car_name = parsed_data.car_year + " " +
						               parsed_data.car_make + " " +
						               parsed_data.car_model;
						if (index == 0) {
							output_text += "\r\n";
							output_text += "-------------------------------\r\n";
							output_text += "TRANSP: |       | EE: |       |\r\n";
							output_text += "        |_______|     |_______|\r\n";
							output_text += ("Name:    " + formal_name.trim() + "\r\n");
							output_text += ("Depart:  " + parsed_data.pickup_city + ", " + parsed_data.pickup_state + "\r\n");
							output_text += ("Arrive:  " + parsed_data.dropoff_city + ", " + parsed_data.dropoff_state + "\r\n");

						}
						output_text += ("Vehicle: " + car_name);
						output_text += (" (" + parsed_data.pickup_date + ")\r\n");


					});
				});
			});
		}
	})

	console.log("loading...");
	setTimeout(function() {
		var temp = document.createElement("a");
		temp.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output_text));
		temp.setAttribute("download", "test.txt");
		temp.click();
		console.log("done...");
	}, 60000);



}