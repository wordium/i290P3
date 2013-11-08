/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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
var valueSet;
var valueTitles = [];
var values = [];
var maxValue = 0;
var minValue = 0;
var w;
var h;
var top;
var left;
var vizId;
var viz;
var xPadding = 20;
var yPadding = 40;
var infoH = 400;
var infoW = 400;
var chartTitleH;
var chartH;
var chartW;
var chartTop;
var chartLeft;
var yAxisTop;
var yAxisBottom;
var xAxisTop;
var xAxisBottom;
var ticks = 5;
var title;
var yAxisScale;
var xAxisScale;
var yAxis;
var xAxis;
var yScale;
var xScale;
var yGrid;
var xGrid;
var xGap = 5;
var yGap = 5;
var colW;
var barH;
var minColW = 20;
var minBarH = 20;
//    draw = draw;
//    prepareData = prepareData;
//    drawAxis = drawAxis;
//    drawAxis = drawAxis;


function init()
{

}
function drawIndustryBarChart(data)
{

    valueSet = data;
    valueTitles = [];
    values = [];
    maxValue = 0;
    minValue = 0;
    w = 1200;
    h = 400;
    top = 0;
    left = 0;
    vizId = IND_VIZ_ID;
    viz = d3.select(vizId);
    draw('h');

}
function draw(orientation)
{


    prepareData();
    prepareScale(orientation);
    viz.attr("width", w)
            .attr("height", h);
//                .attr("top", top)
//                .attr("left", left);
    switch (orientation)
    {
        case 'h':
            drawXAxis();
            drawHBars();
            drawHTitles();
            break;
        case 'v':
            drawYAxis();
            drawVBars();
            drawBTitles();
            break;
    }

}
function prepareData()
{

//    console.log(valueSet);
    var i = 0;
    for (var key in valueSet)
    {
        values[i] = valueSet[key];
        valueTitles[i] = key;
        i++;
    }
//    console.log(valueTitles);

    var max = 0;
    for (var key in values)
        max = (values[key] > max) ?
                values[key] : max;
    maxValue = max;
    var min = maxValue;
    for (var key in values)
        min = (values[key] < min) ?
                values[key] : min;
    minValue = min;
//    console.log(minValue + "\t" + maxValue);
}

function prepareScale(orientation)
{
    chartTitleH = (title) ? 20 : 0;
    var count = values.length;
    calcColumnWidth();
    calcBarHeight();
    switch (orientation)
    {
        case 'h':
            if (barH < minBarH)
            {
                h = (minBarH + xGap) * count + 2 * yPadding + chartTitleH;
                console.log("new h=" + h);
                calcBarHeight();
            }
            break;
        case 'v':
            if (colW < minCoLW)
            {
                w = (minColW + xGap) * count + 2 * xPaddding + infoW;
                console.log('new w=' + w);
                calcColumnWidth();
            }
    }



    chartH = h - 2 * yPadding - chartTitleH;
    chartW = w - 2 * xPadding - infoW;
    chartTop = h - yPadding;
    chartLeft = xPadding;


}
function calcColumnWidth()
{
    colW = (w - 2 * xPadding - values.length * xGap) / values.length;
    console.log("colW=" + colW);

}
function calcBarHeight()
{
    barH = (h - 2 * yPadding - chartTitleH - values.length * xGap) / values.length;
    console.log('barH=' + barH);
}
function drawYAxis()
{
    yAxisTop = Math.ceil(maxValue / 10) * 10;
    yAxisBottom = 0;
    yAxisScale = d3.scale.linear().domain([yAxisBottom, yAxisTop])
            .range([h - 2 * yPadding - chartH, yAxisBottom]);
    yAxis = d3.svg.axis().scale(yAxisScale).orient("left").ticks(ticks);
    yScale = d3.scale.linear().domain([yAxisBottom, yAxisTop]).range([0, chartH]);
    yGrid = d3.svg.axis().scale(yAxisScale).orient("left").ticks(ticks);

    viz.append("g").classed("labels y_labels", true)
            .attr("class", "axis")
            .attr("transform", "translate(" + xPadding + ","
                    + (yPadding + chartTitleH) + ")")
            .call(yAxis.tickSize(10, 0, 0));

    viz.append("g").classed("grid y_grid", true)
            .attr("class", "grid")
            .attr("transform", "translate(" + xPadding + ","
                    + 10 + ")")
            .call(yGrid
                    .tickSize(-w + 2 * xPadding, 0, 0)
                    .tickFormat(""));
}

function drawXAxis()
{
    xAxisTop = Math.ceil(maxValue / 10) * 10;
    xAxisBottom = 0;
    xAxisScale = d3.scale.linear().domain([xAxisBottom, xAxisTop]).range([0, chartW]);
    xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom").ticks(ticks);
    xScale = d3.scale.linear().domain([xAxisBottom, xAxisTop]).range([0, chartW]);
    xGrid = d3.svg.axis().scale(xAxisScale).orient("bottom").ticks(ticks);
    viz.append("g").classed("labels s_labels", true)
            .attr("class", "axis")
            .attr("transform", "translate(" + xPadding + ","
                    + (h - yPadding) + ")")
            .call(xAxis.tickSize(5, 0, 0));


    viz.append("g").classed("grid y_grid", true)
            .attr("class", "grid")
            .attr("transform", "translate(" + xPadding + ","
                    + (h - yPadding) + ")")
            .call(xGrid
                    .tickSize(-chartH, 0, 0)
                    .tickFormat(""));
}
function drawVBars()
{

//    for (var i = 0, j = datasetAverageByYear.length; i < j; i++)
//        addedData[columnCount + i] = datasetAverageByYear[i];
//    columnCount += datasetAverageByYear.length;
    console.log(values);
    viz.selectAll("rect")
            .data(values)
            .enter()
            .append("rect")
            .attr({
                "width": colW,
                "height": function(d, i) {
//                    console.log(i + "\t" + d + "\t" + yScale(d));
                    return yScale(d);
                },
                "x": function(d, i) {
                    return (i) * (colW + 1 * xGap) + 1 * xPadding;
                },
                "y": function(d, i) {
                    return chartTope - yScale(d);
                },
                "desc": function(d, i) {
                    var str = i + "\t" + values[i];
                    return str;
                },
                "class": function(d, i) {
                    return "year-bar " + "year-bar-" + values[i];
                }
            });
}

function drawHBars()
{
    viz.selectAll("rect")
            .data(values)
            .enter()
            .append("rect")
            .attr({
                "height": barH,
                "width": function(d, i) {
                    console.log(i + "\t" + d + "\t" + xScale(d));
                    return xScale(d);
                },
                "x": function(d, i) {
                    return chartLeft;
//                    return (i) * (colW + 1 * xGap) + 1 * xPadding;
                },
                "y": function(d, i) {
                    return i * (barH + xGap) + yPadding + chartTitleH;
//                    return h - yScale(d) - yPadding;
                },
                "desc": function(d, i) {
                    var str = i + "\t" + values[i];
                    return str;
                },
                "class": function(d, i) {
                    return "year-bar " + "year-bar-" + values[i];
                }
            });
}

function drawVTitles()
{
    viz.selectAll("text.name")
            .data(valueTitles)
            .enter()
            .append("text")
            .text(function(d, i) {
                console.log(d);
                return d;
            })
            .attr({
                "x": function(d, i) {
                    return i * (colW + xGap) + xGap / 2 + xPadding;
                },
                "y": h - yPadding,
                "text-anchor": "middle",
                "class": "titles"
            });
}

function drawHTitles()
{
    viz.selectAll("text.name")
            .data(valueTitles)
            .enter()
            .append("text")
            .text(function(d, i) {
                console.log(d);
                return d + " - " + values[i];
            })
            .attr({
                "x": function(d, i) {
                    return xPadding + 10;
                },
                "y": function(d, i) {
//                    return h - yPadding;
                    return i * (barH + xGap) + yPadding + chartTitleH + 16;
                },
                "text-anchor": "left",
                "class": "titles"
            });
}