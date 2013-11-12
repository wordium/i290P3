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
var IND_PREVIEW_ID = '#industry-member-preview ul';
var USER_IND_PROFILE_CLASS = '.user-industry-profile';
var IND_PROFILE_DIV_ID = '#user-profile';
var IND_MAX_DRAW = 10;
var indChart;
var valueSet;
var valueTitles = [];
var values = [];
var drawValues = [];
var drawTitleValues = [];
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
var profiles = [];

var popup = $("#member-popup");

//    draw = draw;
//    prepareData = prepareData;
//    drawAxis = drawAxis;
//    drawAxis = drawAxis;


function init()
{
}
function drawIndustryBarChart(profileData)
{

    profiles = profileData;
    valueSet = loadIndustryData();
    valueTitles = [];
    values = [];
    maxValue = 0;
    minValue = 0;
    console.log($(IND_VIZ_ID).parent());

    w = parseInt($(IND_VIZ_ID).css('width'));
    h = parseInt($(IND_VIZ_ID).parent().css('height'));
//    console.log(w + "\t" + h);
    top = 0;
    left = 0;
    vizId = IND_VIZ_ID;
    viz = d3.select(vizId);
    IND_MAX_DRAW = 10;
    title = "Top 10 Industry Connections";
    draw('h');
    /*vizId = IND_VIZ_ID_V;
     viz = d3.select(vizId);
     draw('v');
     */
}


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
}
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

function loadIndustryData() {
    var industries = {};
    for (var i = 0, j = profiles.length; i < j; i++)
    {

        var userProfile = profiles[i];
        var industry = userProfile.industry;
        industries[industry] = (industries[industry]) ?
                industries[industry] + 1 : 1;

    }
    console.log(industries);
    return sortObjectByValue(industries);
}
function draw(orientation)
{


    prepareData();
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
function prepareData()
{
    var i = 0;
    for (var key in valueSet)
    {
        values[i] = valueSet[key];
        valueTitles[i] = key;
        i++;
    }
    colCount = (IND_MAX_DRAW > 0 && IND_MAX_DRAW < values.length) ?
            IND_MAX_DRAW : values.length;


    for (var i = 0; i < colCount - 1; i++)
    {
        drawValues[i] = values[i];
        drawTitleValues[i] = valueTitles[i];
    }
    drawTitleValues[colCount - 1] = 'Others';
    drawValues[colCount - 1] = 0;
    for (var i = colCount - 1; i < values.length; i++)
    {
        drawValues[colCount - 1] += values[i];
    }

    var tempSet = {};
    for (var i = 0; i < colCount; i++)
    {
        tempSet[drawTitleValues[i]] = drawValues[i];
    }
    tempSet = sortObjectByValue(tempSet);

    var i = 0;
    for (var key in tempSet)
    {
        drawValues[i] = tempSet[key];
        drawTitleValues[i] = key;
        i++;
    }

    var max = 0;
    for (var key in drawValues)
        max = (drawValues[key] > max) ?
                drawValues[key] : max;
    maxValue = max;
    var min = maxValue;
    for (var key in drawValues)
        min = (drawValues[key] < min) ?
                drawValues[key] : min;
    minValue = min;

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
    viz.selectAll("rect")
            .data(drawValues)
            .enter()
            .append("rect")
            .attr({
                "height": barH,
                "width": function(d, i) {
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
                displayPreview(industry);
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
                popup.css({
                    "left": parseInt(self.position().left),
                    "top": self.position().top - 60})
                        .show();



            })
            .on("mouseleave", function() {
                var self = $(this);
                self.animate({"opacity": 1}, 100);
                self.attr('class', self.attr('class').replace(' user-industry-profile-hover', ""));
                popup.hide();
            })
            .on("click", function() {
                var self = $(this);
                var id = self.attr('id');
                id = id.replace('preview-profile-', '');
//                console.log(id);
                var profile;

                for (var i = 0, j = profiles.length; i < j; i++)
                {
//                    console.log(profiles[i].id + "\t" + profiles[i].industry);
//                    if(profiles[i].id === id || $.inArray(profiles[i].industry, drawTitleValues) === -1)
                    profile = (profiles[i].id === id) ? profiles[i] : profile;
                }
                console.log(profile);

                displayProfile(profile);
            });
}

function displayPreview(industry)
{
    $(IND_PREVIEW_ID).parent().css('height', h + 'px');
    $(IND_PREVIEW_ID).empty();
    var industryProfiles = [];
//    console.log(industry);
    for (var i = 0, j = profiles.length; i < j; i++)
    {
        var profile = new UserProfile();
        profile = profiles[i];
//        console.log(profile);
        if ($.inArray(profile.industry, drawTitleValues) === -1)
            console.log("Profile " + profile.name + "\tOTHER");
        else
            console.log("Profile " + profile.name + "\t"+ profile.industry);
        if (profile.industry === industry || $.inArray(profile.industry, drawTitleValues) === -1)
        {
            industryProfiles.push(profile);
            var html = $(formatPreviewProfileHTML(profile));
            $(IND_PREVIEW_ID).append(html);
        }
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
//    var html = $(formatProfileHTML(profile));
//    var html = $(profile.formatHTML);
    $(IND_PROFILE_DIV_ID).empty();
    var output = profile.formatHTML();
    console.log(output);
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

/**
 * 
 * @param {UserProfile} profile
 * @returns {String}
 */
/*
 function formatProfileHTML(profile)
 {
 var hstr = "<div id='profile-" + profile.id
 + "' class='user-profile'>"
 + "<a href='" + profile.profileUrl + "' target='_blank'>"
 + "<img src='" + profile.pictureUrl + "' alt='" + profile.name + "'/>"
 + "<h1>" + profile.name
 + "</h1></a>"
 + "<h2>" + profile.title + "</h2>"
 + ((profile.positions[0]) ? "<h2>" + profile.positions[0].company + "</h2>" : "")
 + ((profile.summary) ? "<h1>Summary:</h1><p>" + profile.summary + "</p>" : "")
 + "</div>";
 return hstr;
 
 }
 */


function formatMemberPopup(id)
{
    var profile = new UserProfile();

    for (var i = 0, j = profiles.length; i < j; i++)
    {
        profile = (profiles[i].id === id) ? profiles[i] : profile;
    }

    var msg = "<h1>" + profile.name + "</h1>"
            + "<p>" + profile.title + "</p>"
            + "<p>" + profile.currentCompany + "<p>";

    popup.empty().append(msg);



}
