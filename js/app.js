// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

class Device{
	constructor(deviceName, iconURL, consumption){
		this.deviceName = deviceName
		this.iconURL = iconURL
		this.consumption = consumption
		this.timeRange = []
		this.rowIsSet = false
	}
}

function isValidUrl(_string){
	const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
	return matchPattern.test(_string);
}

document.addEventListener('DOMContentLoaded', () => {
	const planner = document.getElementById('planner');

	var devices = [];

	var deviceCount = 0;

	$('#addNewDevice').submit(function(event){
		var deviceName = $('#deviceName').val();
		var deviceIcon = $('#deviceIcon').val();
		var deviceConsumption = $('#deviceConsumption').val();

		if(deviceName && isValidUrl(deviceIcon) && deviceConsumption){
			devices.push(new Device(deviceName, deviceIcon, deviceConsumption));

			buildRow(devices[deviceCount]);

			deviceCount++;

			$('#deviceName').val('')
			$('#deviceIcon').val('');
			$('#deviceConsumption').val('');
		}

		event.preventDefault();
	})

	// devices.push(new Device('Пральна машина', 'images/src/washing-machine.png', '2 кВт'))
	// devices.push(new Device('Електрична плита', 'images/src/stove.png', '1,5 кВт'))
	// devices.push(new Device('Насос поливу', 'images/src/drop.png', '500 Вт'))

	var rowCount = 0

	var selectedRow = null
	var startPos = null
	var endPos = null

	//create row for device function
	function buildRow(device){
		let html = 
		`<div class="row mb-4">
			<div class="col-4 col-lg-3 col-xl-2 d-flex align-items-center">
				<div class="icon">
					<img src="${device.iconURL}" alt="">
				</div>
				<div class="description">
					<h6>${device.deviceName}</h6>
					<span>${device.consumption}</span>
				</div>
			</div>
			<div class="col-8 col-lg-9 col-xl-10">
				<div class="grid" id="grid-${rowCount}">
		`
					for(var i = 0; i < 24; i++){ //draw 24 grid cols - for time range
						html  += 
						`
						<div class="grid-col">
							<div class="grid-col-main d-flex align-items-center">
								<div class="fill-block"></div>
							</div>
							<div class="grid-col-footer">
								${i}:00
							</div>
						</div>
						`
					}
		html +=
		`
				</div>
			</div>
		</div>
		<span class="divider">`

		rowCount++

		planner.innerHTML += html

		//find blocks
		var blocks = $(`.fill-block`)

		$(blocks).on('click', function(){
			var parent = $(this).parent().parent().parent() //find .grid of clicked block
			parent = parseInt($(parent).attr('id').slice(5)) //transform grid id into grid number

			//selectedRow on start always false
			if(selectedRow == parent){ //if clicked row is selected row
				if(!devices[parent].rowIsSet){ //if clicked row's device is not setRow then set setRow to true and push info into array

					endPos = $('.fill-block').index(this)//if clicked row is selected row then set endPos
					endPos = endPos - (24 * selectedRow) //set end pos minus (24 * num of rows) blocks from prev rows
					
					for(var i = startPos; i <= endPos; i++){
						devices[parent].timeRange.push(i)
					}

					devices[parent].rowIsSet = true
				}
				if(devices[parent].rowIsSet){ //if clicked row's device is setRow then set setRow to false and clear array
					devices[parent].timeRange.length = 0

					devices[parent].rowIsSet = false
				}
			}
			else{ //else set new selected row
				selectedRow = parent

				//if clicked row is new selected row then set endPos
				startPos = $('.fill-block').index(this)
				startPos = startPos - (24 * selectedRow) //set start pos minus (24 * num of rows) blocks from prev rows
			}
	
			//debug console logs
			// console.log(`selectedRow ${selectedRow}`)
			// console.log(`parent ${parent}`)
			// console.log(`startPos ${startPos}`)
			// console.log(`${startPos} = ${startPos} - (24 * ${selectedRow})`)
			// console.log(`endPos ${endPos}`)
			// console.log(`endPos = ${endPos} - (24 * ${selectedRow})`)
	
			if(startPos != null && selectedRow != null && endPos > startPos){
				clearChoosenTime(selectedRow)
				//draw range
				chooseTime(selectedRow, startPos, endPos)
			}
		})
	}

	function clearChoosenTime(row){
		var blocks = $(`#grid-${row} .fill-block`)

		$(blocks).removeClass("fill-block-first")
		$(blocks).removeClass("fill-block-last")
		$(blocks).removeClass("fill-block-active")

		console.log(devices[0].timeRange)
	}

	//set time range of device function
	function chooseTime(row, startHour, endHour){

		var blocks = $(`#grid-${row} .fill-block`)

		$(blocks[startHour]).addClass("fill-block-first")
		$(blocks[endHour]).addClass("fill-block-last")

		for(var i = startHour; i <= endHour; i++){
			$(blocks[i]).addClass("fill-block-active")
		}

		//reset all info
		selectedRow = null
		startPos = null
		endPos = null
	}

	//log json into console function
	function stringifyDevices(devices){
		var string = JSON.stringify(devices)
		console.log(string)
	}

	// buildRow(devices[0])
	// buildRow(devices[1])
	// buildRow(devices[2])

	// stringifyDevices(devices)
})
