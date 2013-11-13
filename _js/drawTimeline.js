/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tScale;
var tAxisScale;
var tAxis;
var tGrid;
var tXPadding = 30;
var tYPadding = 20;
var tYGap = 5;
var minDate;
var maxDate;
var userProfile;
var tW = 1100;
var tChartW = 1060;
var tH = 200;
var monthW;
var monthCount = 0;
var tviz;
var tBarH = 40;
var allPositions = [];
var tickSize = 5;
var tTicks = 12;
var overlap = [];
var tTitleH = 60;
var currentOverlapIndex = 0;

//var TIMELINE_ID = "my-timeline";
/**
 *  
 * @param {UserProfile} prof
 * @param {type} target
 * @returns {undefined}
 */
function drawTimeline(prof, target)
{
    userProfile = new UserProfile();
    userProfile = prof;
    w = parseInt($(target).parent().css('width'));
    h = parseInt($(target).parent().css('height'));
//    top = 0;
//    left = 0;
    tviz = d3.select(target);
    tviz.attr("width", tW)
            .attr("height", tH);

//    console.log(userProfile);
    prepareTimelineData();

    drawTimelineAxis();
    drawTimelineBars();
    drawText();
    timelineEvents();


}

function prepareTimelineData()
{
//    minDate = new Date(1, 1, 1970);
    maxDate = new Date();
    allPositions = [];
//    console.log(userProfile.positions);
//    console.log("Positions count=" + userProfile.positions.length);
    if (userProfile.positions.length > 0)
    {
        minDate = userProfile.positions[0].startDate;
        for (var i = 0, j = userProfile.positions.length; i < j; i++)
        {
            var position = userProfile.positions[i];
//            console.log(position);
            minDate = (monthDiff(position.startDate, minDate) > 0) ? position.startDate : minDate;
            maxDate = (monthDiff(position.endDate, maxDate) < 0) ? position.endDate : maxDate;
            allPositions.push(position);
        }
    }
    /*
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
     */
    minDate = new Date(minDate.getFullYear(), 1);
    maxDate = new Date(maxDate.getFullYear(), 12);
    sortPositions();
    calculateOverlap();
    console.log("MIN DATE=" + minDate + "\t" + minDate.getFullYear());
    console.log("MAX DATE=" + maxDate + "\t" + maxDate.getFullYear());
    monthCount = monthDiff(minDate, maxDate);
    console.log("Month Count=" + monthCount);
    tTicks = (maxDate.getFullYear() - minDate.getFullYear() + 1);



}
function sortPositions()
{
    var temp = [];
    var sorted = {};
    var sortable = [];
    for (var i = 0, j = allPositions.length; i < j; i++)
        sortable.push([allPositions[i]['id'], allPositions[i]['startDate']]);

//    console.log(sortable);
    sortable.sort(function(a, b) {
//        return b[1] - a[1]
        return monthDiff(b[1], a[1]);
    });

//    console.log(sortable);
    for (var i = 0, j = sortable.length; i < j; i++)
    {
        var id = sortable[i][0];
//        console.log(id);
        for (var k = 0, l = allPositions.length; k < l; k++)
            if (id === allPositions[k].id)
            {
                temp[i] = (allPositions[k]);
                break;
            }
    }
//    console.log(temp);
//    console.log(allPositions);
    allPositions = temp;
    /*
     for (var i = 0, j = sortable.length; i < j; i++)
     {
     //        console.log(sortable[i]);
     sorted[sortable[i][0]] = sortable[i][1];
     }*/

}
function drawTimelineAxis()
{
    monthW = tW / monthCount;
    var tChartW = tW - 2 * tXPadding;

    tAxisScale = d3.scale.linear().domain([minDate.getFullYear(), maxDate.getFullYear()]).range([0, tChartW]);
    tAxis = d3.svg.axis().scale(tAxisScale).orient("bottom").ticks(tTicks).tickFormat(function(d) {
//       console.log(d);
//       var date = new Date(d);
        return parseInt(d);
    });
    tScale = d3.scale.linear().domain([0, monthCount]).range([0, tChartW]);
    tGrid = d3.svg.axis().scale(tAxisScale).orient("bottom").ticks(tTicks);
    tviz.append("g").classed("labels s_labels", true)
            .attr("class", "axis")
            .attr("transform", "translate(" + tXPadding + ","
                    + (tH - tTitleH) + ")")
            .call(tAxis.tickSize(5, 0, 0));


    tviz.append("g").classed("grid y_grid", true)
            .attr("class", "grid")
            .attr("transform", "translate(" + tXPadding + ","
                    + (tH - tTitleH) + ")")
            .call(tGrid
                    .tickSize(-tH, 0, 0)
                    .tickFormat(""));
}

function drawTimelineBars()
{
//    console.log(allPositions);
    tviz.selectAll("rect")
            .data(allPositions)
            .enter()
            .append("rect")
            .attr({
                "height": tBarH,
                "width": function(d, i) {
//                    console.log(d);
//                    console.log(d + "\t" + xScale(d));
                    var months = monthDiff(d.startDate, d.endDate) + 1;
//                    console.log(months);
                    return tScale(months);
                },
                "x": function(d, i) {
                    var months = monthDiff(minDate, d.startDate);
//                    console.log(months);
                    return tScale(months) + tXPadding;
//                    return (i) * (colW + 1 * xGap) + 1 * tXPadding;
                },
                "y": function(d, i) {
//                    return 2 * tYPadding + tBarH * checkOverlap(d);
                    var overlap = (i === 0) ? 0 : checkOverlap(i);
//                    return  tBarH * i;
//                    console.log(i + "\t" + d.startDate)
                    return tH - (tBarH + tYGap) * overlap - tYPadding - tTitleH;
//                    return h - yScale(d) - tYPadding;
                },
                "desc": function(d, i) {
                    var pos = new Position();
                    pos = d;
                    var str = pos.title;
                    ;
                    return str;
                },
                "class": function(d, i) {
                    return "position-bar";
                },
                "id": function(d, i) {
                    return "position-bar-" + d['id'];
                }
                ,
                "fill": function(d, i) {
                    var dVal = 0;
//                 if (d < 256) {
//                 dVal = 256 - d;
//                 }
                    dVal = Math.ceil(256 * (i + 1) / (allPositions.length + 1));
//                    console.log(dVal);
                    return "rgb(" + 190 + "," + 220 + "," + dVal + ")";
                }
            });
}
function timelineEvents() {

    $(".timeline rect").unbind("mouseenter")
            .unbind("mouseleave")
            .unbind("click");

    $(".timeline rect")
            .on("mouseenter", function()
            {
                var self = $(this);
                self.animate({"opacity": .8}, 100);
                self.attr('class', self.attr('class') + ' selected-column');
                var id = parseInt((self.attr('id')).replace("position-bar-", ""));
                var msg = "";
                for (var i = 0, j = allPositions.length; i < j; i++)
                {
                    var pos = allPositions[i];
//                    console.log(id);
                    if (pos['id'] === id) {
                        msg = pos.formatHTML();
                        console.log(msg);
                        break;
                    }
                }
                $('#position-popup').empty()
                        .append(msg)
                        .css({"left": parseInt(self.position().left - 60),
                            "top": self.position().top - 100})
                        .show();
            })
            .on("mouseleave", function() {
                var self = $(this);
                self.animate({"opacity": 1}, 100);
                self.attr('class', self.attr('class').replace('selected-column', ""));
                $('#position-popup').hide();
            })
            .on("click", function() {
                var self = $(this);
                var id = parseInt((self.attr('id') + "").replace("position-bar-", ''));
//                console.log(id);
                for (var i = 0, j = allPositions.length; i < j; i++)
                {
//                    console.log(allPositions[i]['id']);
                    if (id === allPositions[i]['id'])
                        console.log(allPositions[i]);
                }
//                var industry = "" + self.attr("desc");
//                console.log(industry);
//                displayPreview(printedProfiles[industry], industry);
            });
}

function drawText()
{
    tviz.selectAll("text.name")
            .data(allPositions)
            .enter()
            .append("text")
            .text(function(d, i) {
                var position = new Position();
                position = allPositions[i];
                return position.title;
            })
            .attr({
                "x": function(d, i) {
                    var months = monthDiff(minDate, d.startDate);
//                    console.log(months);
                    return tScale(months) + tXPadding + tScale(monthDiff(d.startDate, d.endDate)) / 2;
                },
                "y": function(d, i) {
                    var overlap = (i === 0) ? 0 : checkOverlap(i);
                    return tH - (tBarH + tYGap) * overlap - tTitleH + 5;
                },
                "width": function(d, i) {
                    console.log(d);
                    var months = monthDiff(d.startDate, d.endDate) + 1;
                    console.log(months);
                    return tScale(months);
                },
                "text-anchor": "middle",
                "class": "titles"
            });
}

function monthDiff(d1, d2) {
    var months;
//    console.log(d1);
//    console.log(d2);
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
//    console.log(months);
//    return months <= 0 ? 0 : months;
    return months + 1;
}
/**
 * 
 * @param {Number} index
 * @returns {undefined}
 */
function checkOverlap(index)
{
    var overlapCount = 0;

    var fol1 = forwardOverlap[index];
    var fol2 = 0;
    for (var i = index + 1, j = allPositions.length; i < j; i++)
        fol2 += forwardOverlap[i];

    var bol1 = backOverlap[index];
    var bol2 = 0;

    for (var i = 0; i < index; i++)
        bol2 += backOverlap[i];

//    console.log(bol1 + "\t" + bol2 + "\t" + fol1 + "\t" + fol2);
    if (bol1 === 0)
        return 0;
    else
        return Math.abs(bol1 - bol2);

//    console.log(fol + "\t" + bol);
}
var backOverlap = [];
var forwardOverlap = [];
function calculateOverlap()
{
    for (var i = 0, j = allPositions.length; i < j; i++)
    {
        overlap[i] = [];
        backOverlap[i] = 0;
        forwardOverlap[i] = 0;

//        console.log(i);
        for (var k = 0, l = allPositions.length; k < l; k++)
        {
            var overlapCount = 0;
            if (i === k)
            {
                overlap[i][k] = 0;
//                console.log(0);
            }
            else
            {
                var p1 = allPositions[i];
                var p2 = allPositions[k];
                var s1s2 = monthDiff(p1.startDate, p2.startDate);
                var s1e2 = monthDiff(p1.startDate, p2.endDate);
                var e1s2 = monthDiff(p1.endDate, p2.startDate);
                var e1e2 = monthDiff(p1.endDate, p2.endDate);


                if (e1s2 < 0 && s1e2 > 0)
                {
                    overlapCount++;
                }

//                console.log(s1s2 + "\t" + s1e2 + "\t" + e1s2 + "\t" + e1e2 + "\t" + overlapCount);

                overlap[i][k] = overlapCount;
            }
            if (i >= k)
                backOverlap[i] += overlapCount;
            else
                forwardOverlap[i] += overlapCount;
        }
//        console.log(overlap[i]);
    }
    /*   console.log("Overlap:");
     console.log(overlap);
     console.log(backOverlap);
     console.log(forwardOverlap);*/
}