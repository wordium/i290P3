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
var IND_VIZ_ID_V = '#industry-viz-v';
var IND_PREVIEW_ID = '#member-preview ul';
var USER_IND_PROFILE_CLASS = '.user-industry-profile';
var IND_PROFILE_DIV_ID = '#remote-profile';
var IND_MAX_DRAW = 10;
var indChart;
var profiles = [];
var profilesByIndustry = {};
var printedProfiles = {};
var valueTitles = [];
var values = [];
var drawValues = [];
var drawTitleValues = [];
var datasetByInustry = {};
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
var infoW = 0;
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
var minBarH = 30;
var colCount = 0;


var POPUP_ID = "#member-popup";


function init()
{
}
function drawIndustryBarChart(profileData)
{
    maxValue = 0;
    minValue = 0;
    profiles = profileData;
    loadIndustryData();
    prepareData();

    valueTitles = [];
    values = [];

    console.log($(IND_VIZ_ID).parent());

    w = parseInt($(IND_VIZ_ID).css('width'));
    h = parseInt($(IND_VIZ_ID).parent().css('height'));
    top = 0;
    left = 0;
    vizId = IND_VIZ_ID;
    viz = d3.select(vizId);
    IND_MAX_DRAW = 10;
    title = "Top 10 Industry Connections";
    draw('h');
}

/*
 function drawConnections(connections)
 {
 //    console.log(connections);
 
 var industries = {};
 for (var i = 0, j = profiles.length; i < j; i++)
 {
 
 var userProfile = profiles[i];
 var industry = userProfile.industry;
 industries[industry] = (industries[industry]) ?
 industries[industry] + 1 : 1;
 
 }
 console.log(industries);
 var sortedIndustries = sortObjectByValue(industries);
 }*/

/*
 function sortObjectByValue(objects)
 {
 var sorted = {};
 var sortable = [];
 for (var key in objects)
 sortable.push([key, objects[key]])
 sortable.sort(function(a, b) {
 return b[1] - a[1]
 });
 for (var i = 0, j = sortable.length; i < j; i++)
 {
 //        console.log(sortable[i]);
 sorted[sortable[i][0]] = sortable[i][1];
 }
 return sorted;
 
 }
 */



function loadIndustryData() {
    var industries = {};
    for (var i = 0, j = profiles.length; i < j; i++)
    {
        var userProfile = profiles[i];
        var industry = userProfile.industry;
        if (typeof (industry) !== 'undefined') {
            if (industries[industry])
                industries[industry].push(userProfile);
            else
                industries[industry] = [userProfile];
        }
    }


//    console.log(industries);
    profilesByIndustry = sortIndustrySet(industries);
    console.log(profilesByIndustry);

}

function sortIndustrySet(oldset)
{
    var sorted = {};
    var sortable = [];
    for (var key in oldset)
        sortable.push([key, oldset[key].length]);

    console.log(sortable);
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i = 0, j = sortable.length; i < j; i++)
    {
        //        console.log(sortable[i]);
        var key = sortable[i][0];
        sorted[key] = oldset[key];
    }

    return sorted;
}

function prepareData()
{
    var i = 0;
    for (var key in profilesByIndustry)
    {
        values[i] = profilesByIndustry[key].length;
        valueTitles[i] = key;
        i++;
    }
    colCount = (IND_MAX_DRAW > 0 && IND_MAX_DRAW < values.length) ?
            IND_MAX_DRAW : values.length;


    for (var i = 0; i < colCount - 1; i++)
    {
        var title = valueTitles[i];
        drawValues[i] = values[i];
        drawTitleValues[i] = title;
        printedProfiles[title] = profilesByIndustry[title];
    }
    drawTitleValues[colCount - 1] = 'Others';
    drawValues[colCount - 1] = 0;
    printedProfiles["Others"] = [];
    for (var i = colCount - 1; i < values.length; i++)
    {
        drawValues[colCount - 1] += values[i];
        var prof = profilesByIndustry[valueTitles[i]];
//        console.log(prof);
        for (var k = 0, l = prof.length; k < l; k++)
            printedProfiles["Others"].push(prof[k]);
    }

    printedProfiles = sortIndustrySet(printedProfiles);

    var i = 0;
    for (var key in printedProfiles)
    {
        drawValues[i] = printedProfiles[key].length;
        drawTitleValues[i] = key;
        i++;
    }

    var max = 0;
    var min = 100000000;
    for (var i = 0, j = drawValues.length; i < j; i++)
    {
        max = (drawValues[i] > max) ? drawValues[i] : max;
        min = (drawValues[i] < min) ? drawValues[i] : min;
    }

    minValue = min;
    maxValue = max;
//    console.log("min=" + min + "\tmax=" + max);
}
function draw(orientation)
{
    prepareScale(orientation);
    viz.attr("width", w)
            .attr("height", h);
//                .attr("top", top)
//                .attr("left", left);
    drawChartTitle();
    switch (orientation)
    {
        case 'h':
            drawXAxis();
            drawHBars();
            drawHTitles();
            drawHBaseLine();
            hBarEvents();
            break;
        case 'v':
            drawYAxis();
            drawVBars();
            drawVTitles();
            drawVBaseLine()
            break;
    }
}

function prepareScale(orientation)
{
    chartTitleH = (title) ? 20 : 0;
    h = (minBarH + xGap) * colCount + 2 * yPadding + chartTitleH;

    calcColumnWidth();
    calcBarHeight();

    chartH = h - 2 * yPadding - chartTitleH;
    chartW = w - 2 * xPadding - infoW;
    chartTop = h - yPadding;
    chartLeft = xPadding;


}
function calcColumnWidth()
{
    colW = (w - 2 * xPadding - colCount * xGap) / colCount;

}
function calcBarHeight()
{
    barH = (h - 2 * yPadding - chartTitleH - colCount * xGap) / colCount;

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

    console.log("chartW=" + chartW);
    console.log("maxValue=" + maxValue);
    console.log("xAxisTop=" + xAxisTop);
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

    viz.selectAll("rect")
            .data(drawValues)
            .enter()
            .append("rect")
            .attr({
                "width": colW,
                "height": function(d, i) {
                    return yScale(d);
                },
                "x": function(d, i) {
                    return (i) * (colW + 1 * xGap) + 1 * xPadding;
                },
                "y": function(d, i) {
                    return chartTop - yScale(d);
                },
                "desc": function(d, i) {
                    var str = i + "\t" + values[i];
                    return str;
                },
                "class": function(d, i) {
                    return "industry-column industry-column-" + i;
                }
            });
}
function drawHBars()
{
    console.log(drawValues);
    viz.selectAll("rect")
            .data(drawValues)
            .enter()
            .append("rect")
            .attr({
                "height": barH,
                "width": function(d, i) {
//                    console.log(d + "\t" + xScale(d));
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
                    var str = drawTitleValues[i];
                    return str;
                },
                "class": function(d, i) {
                    return "industry-column";
                },
                "id": function(d, i) {
                    return "industry-column-h-" + i;
                },
                "fill": function(d) {
                    var dVal = 0;
                    if (d < 256) {
                        dVal = 256 - d;
                    }
                    return "rgb(" + 190 + "," + 220 + "," + dVal + ")";
                }
            });
}

function drawVTitles()
{
    viz.selectAll("text.name")
            .data(drawTitleValues)
            .enter()
            .append("text")
            .text(function(d, i) {
                return d;
            })
            .attr({
                "x": function(d, i) {
                    return i * (colW + xGap) + xGap / 2 + xPadding;
                },
                "y": h - yPadding,
                "text-anchor": "middle",
                "class": "titles column-title-" + i,
                "id": function(d, i) {
                    return "industry-column-v-" + i;
                }
            });
}

function drawHTitles()
{
    viz.selectAll("text.name")
            .data(drawTitleValues)
            .enter()
            .append("text")
            .text(function(d, i) {
                return d + " - " + drawValues[i];
            })
            .attr({
                "x": function(d, i) {
                    return xPadding + 10;
                },
                "y": function(d, i) {
//                    return h - yPadding;
                    return i * (barH + xGap) + yPadding + chartTitleH + barH / 2 + xGap;
                },
                "text-anchor": "left",
                "class": "titles"
            });
}

function drawChartTitle()
{
    viz.append("text")
            .text(title)
            .attr({
                "x": chartW / 2,
                "y": chartTitleH + 15,
                "text-anchor": "middle",
                "class": "chart-title"
            });

}


function drawVBaseLine()
{

    viz.append("line")
            .attr('class', 'base-line')
            .attr({
                "x1": xPadding,
                "x2": chartW - xPadding,
                "y1": chartH - yPadding,
                "y2": chartH - yPadding
            });
}
function drawHBaseLine()
{
    viz.append("line")
            .attr('class', 'base-line')
            .attr({
                "x1": xPadding,
                "x2": xPadding,
                "y1": chartH + yPadding + chartTitleH,
                "y2": chartH
            });
}
function vColEvents()
{

}

function hBarEvents() {

    $(IND_VIZ_ID + " rect").unbind("mouseenter")
            .unbind("mouseleave")
            .unbind("click");

    $(IND_VIZ_ID + " rect")
            .on("mouseenter", function()
            {
                var self = $(this);
                self.animate({"opacity": .8}, 100);
                self.attr('class', self.attr('class') + ' selected-column');
            })
            .on("mouseleave", function() {
                var self = $(this);
                self.animate({"opacity": 1}, 100);
                self.attr('class', self.attr('class').replace('selected-column', ""));
            })
            .on("click", function() {
                var self = $(this);
                var industry = "" + self.attr("desc");
                console.log(industry);
                displayPreview(printedProfiles[industry], industry);
            });
}


function profilePreviewEvents()
{

    $(USER_IND_PROFILE_CLASS).unbind("mouseenter")
            .unbind("mouseleave")
            .unbind("click");

//    $("#visualization .year-bar").unbind("click");
// hover event interaction
    $(USER_IND_PROFILE_CLASS)
            .on("mouseenter", function()
            {
                var self = $(this);
                self.animate({"opacity": .8}, 100);
                self.attr('class', self.attr('class') + ' user-industry-profile-hover');
                var id = self.attr('id');
                id = id.replace('preview-profile-', '');
                formatMemberPopup(id);
                $(POPUP_ID).css({
                    "left": parseInt(self.position().left - 60),
                    "top": self.position().top - 100})
                        .show();

            })
            .on("mouseleave", function() {
                var self = $(this);
                self.animate({"opacity": 1}, 100);
                self.attr('class', self.attr('class').replace(' user-industry-profile-hover', ""));
                $(POPUP_ID).hide();
            })
            .on("click", function() {
                var self = $(this);
                var id = self.attr('id');
                id = id.replace('preview-profile-', '');
//                console.log(id);
                var profile = new UserProfile();

                for (var i = 0, j = profiles.length; i < j; i++)
                {
                    profile = (profiles[i].id === id) ? profiles[i] : profile;
                }
//                console.log(profile);

                displayProfile(profile);
                
                console.log(profile);
                
                getOtherProfileFromSQL(profile.username);
                
            });
}

function displayPreview(profs, title)
{
    $(IND_PREVIEW_ID).empty();
    var head = "<label class='preview-header'>" + title + "-" + profs.length + "</label>";
    $(IND_PREVIEW_ID).append(head);
    for (var i = 0, j = profs.length; i < j; i++)
    {
        var profile = profs[i];
//                console.log(profile);
        $(IND_PREVIEW_ID).append(formatPreviewProfileHTML(profile));
    }
    profilePreviewEvents();
}
/**
 * 
 * @param {UserProfile} profile
 * @returns {undefined}
 */
function displayProfile(profile)
{
    $(IND_PROFILE_DIV_ID).empty();
    var output = profile.formatHTML();
    $(IND_PROFILE_DIV_ID).append(output);
}

/**
 * 
 * @param {UserProfile} profile
 * @returns {undefined}
 */
function formatPreviewProfileHTML(profile)
{
    var hstr = "<li id='preview-profile-" + profile.id
            + "' class='user-industry-profile'>"
//            + "<a href='" + profile.profileUrl + "' target='_blank'>"
            + "<img src='" + profile.pictureUrl + "' alt='" + profile.name + "'/>"
//            + "<h1>" + profile.name
//            + "</h1>"
//            +"</a>"
            + "</li>";
    return hstr;

}


function formatMemberPopup(id)
{
    var profile = new UserProfile();

    for (var i = 0, j = profiles.length; i < j; i++)
    {
        if (profiles[i].id === id) {
            profile = profiles[i];
            console.log('profile found');
            console.log(profile);
            break;
        }

    }


    var msg = "<p><strong>" + profile.name + "</strong>"
            + "<br>" + profile.title
            + "<br>" + profile.currentCompany + "<p>";
    console.log(msg);
    $(POPUP_ID).empty();
    $(POPUP_ID).append(msg);



}
