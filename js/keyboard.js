
var svg = d3.select("body").append("svg")
	.attr("width", 720)
	.attr("height", 400);

d3.json("js/keyboard.json", function(error, graph) {
	if (error) throw error;
    var nodes = graph.keys;
    var node = svg.selectAll(".node") .data(nodes)
    	.enter().append("g")
    	.attr("class", "node")
    node.append("rect")
    	.attr("fill", function(d){
    		if(d.color==="white"){
    			return '#FCFAFA';
    		}else{
    			return '#3E363F';
    		}
    	})
    	.attr("stroke", "black")
    	.attr("x", function(d){
    		return d.start;
    	})
    	.attr("y", 0)
    	.attr("width",function(d){
    		if(d.color==="white"){
    			return 100;
    		}else{
    			return 60;
    		}
    	})
    	.attr("height",function(d){
    		if(d.color==="white"){
    			return 400;
    		}else{
    			return 200;
    		}
    	})
    	.on("click", function(d){
    		if(d.color==="white"){
    			d3.select(this).transition()
    				.style("fill", '#C8D3D5')
    				.transition()
    				.style("fill", '#FCFAFA');
    		}else{ 
    			d3.select(this).transition()
    				.style("fill", '#161316')
    				.transition()
    				.style("fill", '#3E363F');
    		}
    		playSound(d.note);
    	});
    node.append("text")
    	.attr("class", "westernNote")
    	.style("visibility","hidden")
    	.attr("dy",".31em")
    	.attr("x", function(d){
    		if(d.color==='white'){
    			return d.start+50;
    		}else{
    			return d.start+30;
    		}
    	})
    	.attr("y", function(d){
    		if(d.color === 'white'){
    			return 250;
    		}else {
    			return 30;
    		}
    	})
    	.attr("text-anchor", "middle")
    	.attr("font-size", "30")
    	.attr("font-weight", "bold")
    	.attr("fill", function(d){
    		if(d.color==="white"){
    			return "black";
    		}else{
    			return "white";
    		}
    	})
    	.text(function(d){
    		return d.note.substr(0,d.note.indexOf('4'));
    	});
    node.append("text")
    	.attr("dy",".31em")
    	.style("visibility","hidden")
    	.attr("class", "westernNote")
    	.attr("x", function(d){
    		if(d.color==='white'){
    			return d.start+50;
    		}else{
    			return d.start+30;
    		}
    	})
    	.attr("y", function(d){
    		if(d.color === 'white'){
    			return 300;
    		}else {
    			return 70;
    		}
    	})
    	.attr("text-anchor", "middle")
    	.attr("font-size", "30")
    	.attr("font-weight", "bold")
    	.attr("fill", function(d){
    		return "white";
    	})
    	.text(function(d){
    		if(d.title === d.note){
    			return "";
    		}else{
    			return d.title.substr(0,d.title.indexOf('4'));
    		}
    	});
    node.append("text")
    	.attr("dy",".31em")
    	.style("visibility","hidden")
    	.attr("class", "carnaticNote")
    	.attr("x", function(d){
    		if(d.color==='white'){
    			return d.start+50;
    		}else{
    			return d.start+30;
    		}
    	})
    	.attr("y", function(d){
    		if(d.color === 'white'){
    			return 300;
    		}else {
    			return 110;
    		}
    	})
    	.attr("text-anchor", "middle")
    	.attr("font-size", "30")
    	.attr("font-weight", "bold")
    	.attr("fill", function(d){
    		return "#38E4AE";
    	})
    	.text(function(d){
    		return d.name;
    	});
    node.append("text")
    	.attr("dy",".31em")
    	.style("visibility","hidden")
    	.attr("class", "carnaticNote")
    	.attr("x", function(d){
    		if(d.color==='white'){
    			return d.start+50;
    		}else{
    			return d.start+30;
    		}
    	})
    	.attr("y", function(d){
    		if(d.color === 'white'){
    			return 350;
    		}else {
    			return 150;
    		}
    	})
    	.attr("text-anchor", "middle")
    	.attr("font-size", "30")
    	.attr("font-weight", "bold")
    	.attr("fill", function(d){
    		return "#38E4AE";
    	})
    	.text(function(d){
    		return d.name2;
    	})

});

$('.westernNote').hide()
var track;
var write;
var currentRaga;
function playSound(note){
	track = new MidiWriter.Track();
	var noteSpeed1 = new MidiWriter.NoteEvent({pitch:[note], duration: '2', sequential: true});
	track.addEvent(noteSpeed1);
	track.addEvent(new MidiWriter.NoteEvent({pitch: ['A4'], duration: '1', wait:'2', velocity:1}));
	write = new MidiWriter.Writer([track]);
	console.log('data:audio/midi;base64,' + write.base64());
	mp2 = new MidiPlayer('data:audio/midi;base64,' + write.base64(), 'btn2');
	MIDIjs.play('data:audio/midi;base64,' + write.base64());
}


