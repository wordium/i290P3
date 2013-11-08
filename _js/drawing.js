/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function()
{
    init();
});

var IND_VIZ_ID = '#industry-viz';
var indChart;


function Chart(dataset, h, w, top, left, vizId)
{
    this.valueSet = dataset;
    this.valueTitles = [];
    this.values = [];
    this.maxValue = 0;
    this.minValue = 0;
    this.w = w;
    this.h = h;
    this.top = top;
    this.left = left;
    this.vizId = vizId;
    this.viz = d3.select(this.vizId);
    this.xPadding = 40;
    this.yPadding = 20;
    this.chartTitleH;
    this.chartH;
    this.chartTop;
    this.chartLeft;
    this.yAxisTop;
    this.yAxisBottom;
    this.xAxisTop;
    this.xAxisBottom;
    this.ticks = 5;
    this.title;
    this.yAxisScale;
    this.xAxisScale;
    this.yAxis;
    this.xAxis;
    this.yScale;
    this.xScale;
    this.yGrid;
    this.xGrid;
    this.xGap = 5;
    this.yGap = 5;
//    this.draw = draw;
//    this.prepareData = prepareData;
//    this.drawAxis = drawAxis;
//    this.drawAxis = drawAxis;



}


Chart.prototype.draw = function()
{
//        this.viz = d3.select(this.vizId);
//        console.log(this.viz);
    this.viz.attr("width", this.w)
            .attr("height", this.h);
//                .attr("top", top)
//                .attr("left", left);

    this.prepareData();
    console.log(this.minValue + "\t" + this.maxValue);
    this.drawAxis();
    this.drawBars();
}
Chart.prototype.prepareData = function()
{
    var max = 0;
    for (var key in this.values)
        max = (this.values[key] > max) ?
                this.values[key] : max;
    this.maxValue = max;
    var min = this.maxValue;
    for (var key in this.values)
        min = (this.values[key] < min) ?
                this.values[key] : min;
    this.minValue = min;
    console.log(this.valueSet);
    var i = 0;
    for (var key in this.valueSet)
    {
        this.values[i] = this.valueSet[key];
        this.valueTitles[i] = key;
        i++;
    }

//        console.log(this.minValue + "\t" + this.maxValue);
}
Chart.prototype.drawAxis = function()
{

    console.log('drawing axis');
    this.yAxisTop = Math.ceil(this.maxValue / 10) * 10;
    this.yAxisBottom = 0;

    this.xAxisTop = Math.ceil(this.maxValue / 10) * 10;
    this.xAxisBottom = 0;

    this.chartTitleH = (this.title) ? 10 : 0;
    this.chartH = this.h - 2 * this.yPadding - this.chartTitleH;

    this.yAxisScale = d3.scale.linear().domain([this.yAxisBottom, this.yAxisTop])
            .range([this.h - 2 * this.yPadding - this.chartH, this.yAxisBottom]);
    this.xAxisScale = d3.scale.linear().domain([this.xAxisBottom, this.xAxisTop])
            .range([this.w - 2 * this.xPadding - this.chartH, this.xAxisBottom]);

    this.yAxis = d3.svg.axis()
            .scale(this.yAxisScale).orient("left")
            .ticks(this.ticks);
    this.xAxis = d3.svg.axis()
            .scale(this.xAxisScale).orient("bottom")
            .ticks(this.ticks);

    this.yScale = d3.scale.linear().domain([this.yAxisBottom, this.yAxisTop]).range([0, this.chartH]);
    this.xScale = d3.scale.linear().domain([this.xAxisBottom, this.xAxisTop]).range([0, this.chartH]);

    this.yGrid = d3.svg.axis().scale(this.yAxisScale).orient("left").ticks(this.ticks);
    this.xGrid = d3.svg.axis().scale(this.yAxisScale).orient("bottom").ticks(this.ticks);
//        this.viz = d3.select(this.vizId);
//            console.log(this.viz);

    console.log(this);
    console.log(this.yScale(5));
    this.viz.append("g").classed("labels y_labels", true)
            .attr("class", "axis")
            .attr("transform", "translate(" + this.xPadding + ","
                    + (this.yPadding + this.chartTitleH) + ")")
            .call(this.yAxis.tickSize(10, 0, 0));


    this.viz.append("g").classed("grid y_grid", true)
            .attr("class", "grid")
            .attr("transform", "translate(" + this.xPadding + ","
                    + 10 + ")")
            .call(this.yGrid
                    .tickSize(-this.w + 2 * this.xPadding, 0, 0)
                    .tickFormat(""));
}

Chart.prototype.drawBars = function()
{
    var colW = (this.w - 2 * this.xPadding - this.values.length * this.xGap) / this.values.length;
//    for (var i = 0, j = datasetAverageByYear.length; i < j; i++)
//        addedData[columnCount + i] = datasetAverageByYear[i];
//    columnCount += datasetAverageByYear.length;
    console.log(this.values);
    this.viz.selectAll("rect")
            .data(this.values)
            .enter()
            .append("rect")
            .attr({
                "width": colW,
                "height": function(d, i) {
                    return this.yScale(d);
                },
                "x": function(d, i) {
                    return (i) * (colW + 1 * this.xGap) + 1 * this.xPadding;
                },
                "y": function(d, i) {
                    return this.h - this.yScale(d) - this.yPadding;
                },
                "desc": function(d, i) {
                    var str = i + "\t" + this.values[i];
                    return str;
                },
                "class": function(d, i) {
                    return "year-bar " + "year-bar-" + this.values[i];
                }
            });
}
function init()
{
//    IND_PREVIEW_W = IND_W - IND_BAR_W;
//    indViz = d3.select("#visualization");
//    indViz.attr("width", IND_W).attr("height", IND_H);

}


function drawIndustryBarChart(data)
{
    indChart = new Chart(data, 400, 1200, 0, 0, IND_VIZ_ID);
    indChart.draw();

}
