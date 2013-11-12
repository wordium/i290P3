/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tScale;
var tAxisScale;
var tAxis;
var tGrid;
//var xPadding = 10;
//var yPadding = 10;
var minDate;
var maxDate;
var userProfile;
var w = 1100;
var tChartW = 1100;
var h = 200;
var monthW;
var monthCount = 0;
var tviz;
var tBarH = 40;
var allPositions = [];
var tickSize = 5;
var tTicks = 12;
//var TIMELINE_ID = "my-timeline";
/**
 *  
 * @param {UserProfile} prof
 * @param {type} target
 * @returns {undefined}
 */
function drawTimeLine(prof, target)
{

    w = parseInt($(target).parent().css('width'));
    h = parseInt($(target).parent().css('height'));
//    top = 0;
//    left = 0;
    tviz = d3.select(target);
    tviz.attr("width", w)
            .attr("height", h);
    console.log(prof);
    userProfile = prof;
    prepareTimelineData();
    drawTimelineAxis();
    drawTimelineBars();


}

function prepareTimelineData()
{
    minDate = new Date(1, 1, 1900);
    maxDate = new Date();

    if (userProfile.positions.length > 0)
    {
        for (var i = 0, j = userProfile.positions.length; i < j; i++)
        {
            var position = userProfile.positions[i];
            minDate = (position.startDate < minDate) ? position.startDate : minDate;
            maxDate = (position.endDate > maxDate) ? position.endDate : maxDate;
            allPositions.push(position);
        }
    }

    if (userProfile.educations.length > 0)
    {
        for (var i = 0, j = userProfile.educations.length; i < j; i++)
        {
            var education = userProfile.educations[i];
            minDate = (education.startDate < minDate) ? education.startDate : minDate;
            maxDate = (education.endDate > maxDate) ? education.endDate : maxDate;
            allPositions.push(education);
        }

    }
    monthCount = (maxDate.getYear() - minDate.getYear() + 1) * 12;

}

function drawTimelineAxis()
{
    monthW = w / monthCount;

    tAxisScale = d3.scale.linear().domain([0, monthCount]).range([0, w]);
    tAxis = d3.svg.axis().scale(tAxisScale).orient("bottom").ticks(tTicks);
    tScale = d3.scale.linear().domain([0, monthCount]).range([0, tChartW]);
    tGrid = d3.svg.axis().scale(tAxisScale).orient("bottom").ticks(tTicks);
    tviz.append("g").classed("labels s_labels", true)
            .attr("class", "axis")
            .attr("transform", "translate(" + xPadding + ","
                    + (h - yPadding) + ")")
            .call(tAxis.tickSize(5, 0, 0));


    tviz.append("g").classed("grid y_grid", true)
            .attr("class", "grid")
            .attr("transform", "translate(" + xPadding + ","
                    + (h - yPadding) + ")")
            .call(tGrid
                    .tickSize(-h, 0, 0)
                    .tickFormat(""));
}

function drawTimelineBars()
{
    console.log(allPositions);
    tviz.selectAll("rect")
            .data(allPositions)
            .enter()
            .append("rect")
            .attr({
                "height": tBarH,
                "width": function(d, i) {
//                    console.log(d + "\t" + xScale(d));
                    var months = monthDiff(d.startDate, d.endDate);
                    console.log(months);
                    return tScale(months);
                },
                "x": function(d, i) {
                    var months = monthDiff(minDate, d.startDate);
                    console.log(months);
                    return tScale(months);
//                    return (i) * (colW + 1 * xGap) + 1 * xPadding;
                },
                "y": function(d, i) {
                    return 2 * yPadding;
//                    return h - yScale(d) - yPadding;
                },
                "desc": function(d, i) {
                    var pos = new Position();
                    pos = d;
                    var str = pos.company;
                    ;
                    return str;
                },
                "class": function(d, i) {
                    return "position-bar";
                },
                "id": function(d, i) {
                    return "position-bar-" + i;
                }
                /*,
                 "fill": function(d) {
                 var dVal = 0;
                 if (d < 256) {
                 dVal = 256 - d;
                 }
                 return "rgb(" + 190 + "," + 220 + "," + dVal + ")";
                 }*/
            });
}


function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}