// Initialize all Semanti Components
$('.ui.left.sidebar').sidebar({
    transition: 'overlay'
});

$('.ui.dropdown')
  .dropdown({
    on: 'hover'
  })
;

$('#help').click(function(){
	$('#helpModal').modal('show');
});

// Set default values for scrollTo plugin
$.extend($.scrollTo.defaults, {
  axis: 'y',
  duration: 750,
  offset: ($(window).height() / 2)*-1
});

//On press of "enter" allow search by raga name submission
$(document).keypress(function (e) {
  if (e.which == 13) {
    var ragaName = $('#searchByNameID').val().toLowerCase();
    searchRaga(ragaName);
    $(document).scrollTo($('[name='+ragaName+']'));
  }
});

//Event handler for search by Raga name
$("#searchByName").click(function(){
	var ragaName = $('#searchByNameID').val().toLowerCase();
	searchRaga(ragaName);
	$(document).scrollTo($('[name='+ragaName+']'));
});

//Even handler for search by swaras
$("#searchRaga").click(function(){
	var rValue = $('#R').val().substring(1);
	var gValue = $('#G').val().substring(1);
	var dValue = $('#D').val().substring(1);
	var nValue = $('#N').val().substring(1);

	if((Number(rValue) > Number(gValue)) || (Number(dValue) > Number(nValue))){
		alert('Note that the "G" swara must be a higher note than the "R" swara and the "N" swara must be higher than the "D" swara.');
	}
	var swarasConcat = 'S ' + $('#R').val()+' '+$('#G').val()+' '+$('#M').val()+' P '+ 
						$('#D').val()+' '+$('#N').val()+' S';
	swarasConcat = swarasConcat.replace(/\s+/g, '');
	console.log(swarasConcat);
	$(document).scrollTo($('#t'+swarasConcat));
	searchSwara(swarasConcat);
});

//D3 js chart initialization
var diameter = 820;
var tree = d3.layout.tree()
	.size([360, diameter / 2 - 140])
	.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("#chart").append("svg") .attr("width", diameter) .attr("height", diameter)
	.append("g")
	.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2.2 + ")");

d3.select("#chart").attr("align","center");

svg.append("circle").attr("r", diameter/3.13).style("fill", "#7EBC89");
svg.append("circle").attr("r", diameter/4).style("fill", "#C1DBB3");
svg.append("circle").attr("r", diameter/6).style("fill", "#FAEDCA");

//D3 chart populating
d3.json("js/flare.json", function(error, root) { 
	if (error) throw error;
	var nodes = tree.nodes(root), links = tree.links(nodes);
	var link = svg.selectAll(".link") .data(links)
		.enter().append("path") .attr("class", "link") .attr("d", diagonal);
	var node = svg.selectAll(".node") .data(nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
	node.append("circle") 
		.attr("mydata:name", function(d){
			return d.name.toLowerCase();
		})
		.attr("id", function(d){return d.scale.replace(/\s+/g, '');})
		.attr("r", function(d){return 6-(d.level*.5)})
		.attr("fill", function(d){
			if(d.level === 1){
				return "#F7F7F2";
			}else if(d.level === 2){
				return "#A8C686";
			}else if(d.level === 3){
				return "#899878";
			}else if(d.level === 4){
				return "#250902";
			}
		})
		.attr("stroke", function(d){
				return "#FFFFFF";
		});
	node.append("text")
		.attr("mydata:name", function(d){
			return d.name.toLowerCase();
		})
		.attr("id", function(d){return "t"+d.scale.replace(/\s+/g, '');})
		.attr("dy", ".31em")
		.attr("class", function(d){
			if(d.level === 1 || d.level === 4){
				return "normal";
			}else if(d.level === 2 ){
				return "shadow";
			}else if(d.level === 3){
				return "shadow2";
			}
		})        // <=== Here's the different line
		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";})
		.attr("font-size",function(d){
			if(d.level === 1){
				return "18";
			}else if(d.level === 2){
				return "12";
			}else if(d.level === 3 || d.level === 4){
				return "10";
			}
		})
		.attr("font-weight", function(d){
			return 'bold';
		})
		.attr("fill", function(d){
			if(d.level === 1 || d.level === 4){
				return "#222725";
			}else if(d.level === 2){
				return "#254441";
			}else if(d.level === 3){
				return "#ffffff";
			}
		})
		.text(function(d) { 
			if(d.level!==1){
				return d.name;
			}
		});
	node.on("mouseover", function(d){
		if(d.level===4){
			d3.select(this).select("text")
				.text(function(d){
					if(d.level!==1){
						return d.scale;
					}
				})
		}
	});
	node.on("mouseout", function(d){
		d3.select(this).select("text")
			.text(function(d){
				if(d.level!==1){
					return d.name;
				}
			})
	});
	node.on("click", function(d){
		populateList(d.name.replace(/\s+/g, ''));
		splitAndConvert(d.scale);
		$('#ragaName').html(d.name);
		$('#scaleimage').attr('src','images/'+d.name+'.svg');
		$('#arohanam').html(d.scale+'<div class="detail">Arohanam</div>');
		$('#avarohanam').html(reverse(d.scale)+'<div class="detail">Avarohanam</div>');
		$('#ragaModal').modal('show');
	});

});

//search for the node pertaining to the searched swara combination
function searchSwara(swaras){
	resetCircles();
	d3.select("#" + swaras).classed('highlight', true);
	d3.select("#t" + swaras).classed('highlight', true);

};


//search for the node pertaining to the searched raga name
function searchRaga(name){
	console.log(name);
	resetCircles();
	d3.selectAll("[name="+name+"]").classed('highlight', true);
};


//function to reset all colors on the chart
function resetCircles(){
	d3.selectAll('circle').classed('highlight', false);
	d3.selectAll('text').classed('highlight', false);
};


//take an array of carnatic notes and split into array of western notes
function splitAndConvert(swaras){
	var splitArray = swaras.split(" ");
	var resultArray = [];
	resultArray.push('C4');
	for(var i=1; i<splitArray.length-1; i++){
		resultArray.push(westernToCarnatic[splitArray[i]]);
	}
	resultArray.push('C5');
	resultArray.push('C5');
	for(var i=splitArray.length-2; i>0; i--){
		resultArray.push(westernToCarnatic[splitArray[i]]);
	}
	resultArray.push('C4');
	console.log(resultArray);
	createMIDI(resultArray);

};

function populateList(name){
	$('#compositionList').empty();
	for(var i=0; i<compositions[name].length; i++){
		console.log(compositions[name][i]);
		$('#compositionList').append("<div class='item'>"+compositions[name][i]+"</div>");
	}
}


//dictionary for carnatic to western conversion
var westernToCarnatic = {S:'C4', R1:'C#4', R2:'D4', R3:'D#4', G1:'D4', G2:'D#4', G3:'E4', M1:'F4', M2:'F#4', 
						P:'G4', D1:'G#4', D2:'A4', D3:'A#4', N1:'A4', N2:'A#4', N3:'B4', S2:'C5'};


//MIDI file creation variables
var track;
var write;
var currentRaga;


//write a binary64 MIDI file with the given array of notes
function createMIDI(notes){
	track = new MidiWriter.Track();
	track.addEvent(new MidiWriter.ProgramChangeEvent({instrument:105}));
	var noteSpeed1 = new MidiWriter.NoteEvent({pitch:notes, duration: '4', sequential: true});
	var noteSpeed2 = new MidiWriter.NoteEvent({pitch:notes, duration: '8', sequential: true});
	var noteSpeed3 = new MidiWriter.NoteEvent({pitch:notes, duration: '16', sequential: true});
	track.addEvent(noteSpeed1);
	track.addEvent(noteSpeed2);
	track.addEvent(noteSpeed3);
	track.addEvent(new MidiWriter.NoteEvent({pitch: ['A4'], duration: '1', wait:'2', velocity:1}));
	write = new MidiWriter.Writer([track]);
	console.log('data:audio/midi;base64,' + write.base64());
	currentRaga = 'data:audio/midi;base64,' + write.base64();
	
}


//helper function to reverse order of words in a string
function reverse(s) {
  var split = s.split(' ');
  var result = [];
  for(var i = split.length-1; i>=0; i--){
  	result.push(split[i]);
  }
  return result.join(' ');
}


//position chart in the middle of the page
d3.select(self.frameElement).style("height", diameter + "px");
var chart2 = d3.select("#chart2")
    .append("svg")


