/*
This one assembles the elements from data.js into cool HTML.
*/

function hex(csscolor){
	return csscolor.replace("#", "0x")
}

function writeTable(){
	document.write("<table id='table'>")

	document.write("<tr>")
	for (var i in COLUMNS){
		document.write("<th class='columnheader'>")
		document.write(COLUMNS[i])
		document.write("</th>")
	}

	for (var i in TABLE){
		var row = TABLE[i]
		document.write("<tr>")

		document.write("<th class='rowheader'>")
		document.write(ROWS[i])
		document.write("</th>")

		for (var j in row){
			var column = row[j]
			var el = ELEMENTS[column]

			var TextColor = "#000000"
			if (hex(el.co) < 0x555555) {
				TextColor = "#ffffff"
			}

			var Tooltip = "<b>"+column+"</b><br>"
			Tooltip += el.de + "<br>"
			Tooltip += "<br><b>State:</b> " + el.st
			Tooltip += "<br><b>Flammable:</b> " + el.fl
			Tooltip += "<br><b>Explosive:</b> " + el.ex
			//Tooltip += "<br><b>Temperature:</b> " + el.te
			Tooltip += "<br><b>Meltable:</b> " + el.me
			Tooltip += "<br><b>Hardness:</b> " + el.ha
			Tooltip += "<br><b>Weight:</b> " + el.we
			Tooltip += "<br><b>Heat Conductivity:</b> " + el.he
			
			Tooltip += "<br><b>Transitions:</b> " + el.tr

			document.write('<td class="element" style="background-color: '+el.co+'; color: '+TextColor+';" title="'+Tooltip+'">')
			document.write(el.id + "<br><br>")
			document.write(column)
			document.write("</td>")
		}
		document.write("</tr>")
	}
	document.write("</table>")
}