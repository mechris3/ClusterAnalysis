function Cluster()
{
	var w=800, h=600;
	var data = [];		
	var centroids = [];
	var numberOfPoints=2500;
	var padding=30;
	var centroidRadius=10;
	var coordinateRadius=4;
	// this initialises with random but biased data. If the coordinate is less than half the width/height it is reduced, otherwise increase it
	// this will tend to group the data into four clusters
	//this.initialiseData();
	this.initialiseData = new Function()
		{
			for (i=0;i<numberOfPoints;i++)
			{
				var x=Math.random()*100;
				var y=Math.random()*100;
				if (x<50) { x = x * 0.9 } else {x = x *1.1}
				if (y<50) { y = y * 0.9 } else {y = y *1.1}
				data.push({"x":x,"y":y,"name":"point"+i,"color":"black","centroid":""})
			}
			var colors = ["yellow","blue","green","gray"]
			for (i=0;i<4;i++)
			{
				var x=Math.random()*100;
				var y=Math.random()*100;
				centroids.push({"x":x,"y":y,"name":"centroid"+i,"color":colors[i],"centroid":""})
			}
		};
	
	
				
	var widthScale = d3.scale.linear().domain([0,100*1.1]).range([padding,w-padding]);
	var heightScale = d3.scale.linear().domain([0,100*1.1]).range([h-padding,padding])				
				
	var xAxis = d3.svg.axis().scale(widthScale)				
	var yAxis = d3.svg.axis().scale(heightScale).orient("left")					
									
	var canvas = d3.select("body").append("svg").attr("width",w).attr("height",h).style("background-color","#DDD")
												
	var coordinates = canvas.selectAll("circle.coordinate").data(data)
			.enter()
				.append("g")
				.append("circle")
				.attr("cx", function(d) { return (w/2)})
				.attr("cy", function(d) { return (h/2)})		
				.attr("r", coordinateRadius)
				.attr("fill",function(d){return d.color})
				.attr("stroke","black")
				.attr("title",function(d) {return parseInt(d.x)+","+parseInt(d.y)})

	coordinates.transition()
				.duration(1000)
				.attr("cx", function(d) { return widthScale(d.x)})
				.attr("cy", function(d) { return heightScale(d.y)})						
						
	var centroidsPoints = canvas.selectAll("circle.coordinate").data(centroids)
		.enter()
			.append("g")
			.append("circle")
			.attr("cx", function(d) { return (w/2)})
			.attr("cy", function(d) { return (h/2)})												
			.attr("r", centroidRadius )
			.attr("fill",function (d){return d.color})
			.attr("stroke","black")
			.attr("title",function(d) {return d.name+"("+parseInt(d.x)+","+parseInt(d.y)+")"})		

		centroidsPoints.transition()
			.duration(1500)	
			.attr("cx", function(d) { return widthScale(d.x)})
			.attr("cy", function(d) { return heightScale(d.y)})						
									
				
		canvas.append("g")
			.attr("transform",function(){return "translate(0,"+(h-padding)+")"})
			.attr("class","axis")
			.call(xAxis)
					
		canvas.append("g")
			.attr("transform",function(){return "translate("+padding+",00)"})
			.attr("class","axis")
			.call(yAxis)					


		this.findNearestCentroid = function()
			{
				for (var i=0;i<data.length;i++)				
				{
					var minimumDistance="x", centroidName;
					var xDist, yDist, Dist;				
					for (var j=0;j<centroids.length;j++)
					{					
						xDist=data[i].x-centroids[j].x;
						yDist=data[i].y-centroids[j].y;
						Dist=Math.sqrt((xDist*xDist)+(yDist*yDist))				
						if (minimumDistance=="x") {minimumDistance=Dist;centroidName=centroids[j].name};
						if (minimumDistance>Dist)  {minimumDistance=Dist;centroidName=centroids[j].name,data[i].distance=Dist};										
				
					}				
					
					data[i].centroid=centroidName			
				}
								
				coordinates.transition().delay(0).duration(1500)
					.attr("fill",function (d)
						{
							if (d.centroid=="centroid0") {d.color=colors[0]}
							if (d.centroid=="centroid1") {d.color=colors[1]}
							if (d.centroid=="centroid2") {d.color=colors[2]}
							if (d.centroid=="centroid3") {d.color=colors[3]}
							
							return d.color
						})
					.attr("title",function(d) {return d.centroid+" ("+parseInt(d.x)+","+parseInt(d.y)+") Distance:"+d.distance})
			}
		
		this.moveCentroid = function()
		{
			var dt = new Date();
			
			for (var i=0;i<centroids.length;i++)
			{
				var xTotal=0, yTotal=0, num=0;
				for (var j=0;j<data.length;j++)
				{
					if (centroids[i].name==data[j].centroid)
					{
						num++;
						xTotal+=data[j].x;
						yTotal+=data[j].y;
					}
				}
				centroids[i].x=xTotal/num;
				centroids[i].y=yTotal/num;
				
			}
		
			
		centroidsPoints.transition()
			.delay(1000)
			.duration(1500)							
			.attr("cx", function(d) { return widthScale(d.x)})
			.attr("cy", function(d) { return heightScale(d.y)})		
	}
			
						
			function log(x) {return console.log(x)}
}