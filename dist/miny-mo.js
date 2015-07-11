var svg = d3.select("svg");

var playerChosen = false;
var countdownIndex = 0;
var countdown = [ "touch me...", "eeny", "meeny", "miny", "MO!" ];

d3.select("body")
	.on("touchstart", fingerScreenStart)
	.on("touchend", fingerScreenEnd)
	.on("touchmove", fingerScreenMove);

var svgHeight = svg.style("height").replace("px", "");
var svgWidth = svg.style("width").replace("px", "");

var text = svg.selectAll("text.countdown")
	.data([countdownIndex])
	.enter()
		.append("text")
			.attr("class", "countdown")
			.attr("x", svgWidth / 2)
			.attr("y", svgHeight / 2)
			.text(function(d, i) { return countdown[d]; });

var interval = window.setInterval(tickCountdown, 1000);

function updateFingers(touches) {
	if(!playerChosen) {
		var fingers = svg.selectAll("circle.finger")
			.data(touches, function(d) { return d.identifier; })
			.attr("cx", function(d) { return d[0]; })
			.attr("cy", function(d) { return d[1]; });

		fingers
			.enter()
			.append("circle")
				.attr("class", "finger")
				.attr("cx", function(d) { return d[0]; })
				.attr("cy", function(d) { return d[1]; })
				.attr("r", 1)
			.transition()
				.duration(100)
				.attr("r", 60);

		fingers
			.exit()
			.transition()
				.duration(100)
				.attr("r", 1)
				.remove();		
	}
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tickCountdown() {

	svg.select("text.countdown")
		.text(countdown[countdownIndex]);

	// Have we run out of stuff to countdown?  Choose a player
	if(countdownIndex >= countdown.length - 1) {

		var fingers = svg.selectAll("circle.finger");

		var player = getRandomInt(1, fingers[0].length) - 1;

		fingers.each(function(d, i) {
			d3.select(this).attr("class", i === player ? "chosen" : "haha");
		});

		playerChosen = true;
		window.clearInterval(interval);
	}
	else if(countdownIndex > 0) {
		// Update the display for countdown
		countdownIndex++;
	}
}

function resetCountdown(touches, isEnd) {
	if(playerChosen) {
		return;
	}

	if(isEnd && touches.length === 0) {
		countdownIndex = 0;	// Show help
		tickCountdown();	// Force the display to update
	}
	else {
		countdownIndex = 1;	// Start countdown
	}
}

function fingerScreenStart() {
	d3.event.preventDefault();
	var touches = d3.touches(svg.node());
	updateFingers(touches);
	resetCountdown(touches, false);		
}

function fingerScreenMove() {
	d3.event.preventDefault();
	var touches = d3.touches(svg.node());
	updateFingers(touches);
}

function fingerScreenEnd() {
	d3.event.preventDefault();
	var touches = d3.touches(svg.node());
	updateFingers(touches);
	resetCountdown(touches, true);
}