/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Timeline()
{
    this.tScale;
    this.tAxisScale;
    this.tAxis;
    this.tGrid;
    this.xPadding = 30;
    this.yPadding = 20;
    this.tYGap = 5;
    this.minDate;
    this.maxDate;
    this.userProfile;
    this.tW = 1100;
    this.tChartW = 1060;
    this.tH = 200;
    this.monthW;
    this.monthCount = 0;
    this.barH = 40;
    this.tviz;
    this.allPositions = [];
    this.tickSize = 5;
    this.tTicks = 12;
    this.overlap = [];
    this.tTitleH = 30;
    this.currentOverlapIndex = 0;
    this.backOverlap = [];
    this.forwardOverlap = [];
    this.maxOverlap = 0;
    this.overlapMode = false;
}
Timeline.prototype.draw = function(prof, target)
{
    this.userProfile = new UserProfile();
    this.userProfile = prof;

//    this.tH = parseInt($('.timeline').css('height'));
//    top = 0;
//    left = 0;




//    console.log(this.userProfile);
    this.prepareTimelineData();
    this.tW = parseInt($('.timeline').css('width'));
    var offset = 2 * yPadding + this.tTitleH;
    this.tH = (this.overlapMode) ? this.maxOverlap : this.allPositions.length;
    this.tH = this.tH * this.barH + offset;
    this.tviz = d3.select(target);
    this.tviz.attr("width", this.tW)
            .attr("height", this.tH);
    $(target).show();
    this.drawTimelineAxis();
    drawTimelineBars(this);
    drawText(this);
    timelineEvents(this);
    $(target).show();


};

Timeline.prototype.prepareTimelineData = function()
{
//    this.minDate = new Date(1, 1, 1970);
    this.maxDate = new Date();
    this.allPositions = [];
//    console.log(this.userProfile.positions);
//    console.log("Positions count=" + this.userProfile.positions.length);
    if (this.userProfile.positions.length > 0)
    {
        this.minDate = this.userProfile.positions[0].startDate;
        for (var i = 0, j = this.userProfile.positions.length; i < j; i++)
        {
            var position = this.userProfile.positions[i];
//            console.log(position);
            this.minDate = (monthDiff(position.startDate, this.minDate) > 0) ? position.startDate : this.minDate;
            this.maxDate = (monthDiff(position.endDate, this.maxDate) < 0) ? position.endDate : this.maxDate;
            this.allPositions.push(position);
        }


    }
    this.minDate = new Date(this.minDate.getFullYear(), 0);
    this.maxDate = new Date(this.maxDate.getFullYear(), 12);
    this.sortPositions();
    this.calculateOverlap();
    this.calculateMaxOverlap();
//    console.log("MIN DATE=" + this.minDate + "\t" + this.minDate.getFullYear());
//    console.log("MAX DATE=" + this.maxDate + "\t" + this.maxDate.getFullYear());
    this.monthCount = monthDiff(this.minDate, this.maxDate);
//    console.log("Month Count=" + this.monthCount);
    this.tTicks = (this.maxDate.getFullYear() - this.minDate.getFullYear() + 1);
    this.tTicks = (this.tTicks > 12) ? 12 : this.tTicks;
};
Timeline.prototype.sortPositions = function()
{
    var temp = [];
    var sorted = {};
    var sortable = [];
    for (var i = 0, j = this.allPositions.length; i < j; i++)
        sortable.push([this.allPositions[i]['id'], this.allPositions[i]['startDate']]);

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
        for (var k = 0, l = this.allPositions.length; k < l; k++)
            if (id === this.allPositions[k].id)
            {
                temp[i] = (this.allPositions[k]);
                break;
            }
    }
//    console.log(temp);
//    console.log(this.allPositions);
    this.allPositions = temp;
};
Timeline.prototype.drawTimelineAxis = function()
{
    this.tChartW = this.tW - 2 * this.xPadding;
    this.monthW = this.tChartW / this.monthCount;

    this.tAxisScale = d3.scale.linear().domain([this.minDate.getFullYear(), this.maxDate.getFullYear()]).range([0, this.tChartW]);
    this.tAxis = d3.svg.axis().scale(this.tAxisScale).orient("bottom").ticks(this.tTicks).tickFormat(function(d) {
//       console.log(d);
//       var date = new Date(d);
        return parseInt(d);
    });
    this.tScale = d3.scale.linear().domain([0, this.monthCount]).range([0, this.tChartW]);
    this.tGrid = d3.svg.axis().scale(this.tAxisScale).orient("bottom").ticks(this.tTicks);
    this.tviz.append("g").classed("labels s_labels", true)
            .attr("class", "axis")
            .attr("transform", "translate(" + this.xPadding + ","
                    + (this.tH - this.tTitleH) + ")")
            .call(this.tAxis.tickSize(5, 0, 0));


    this.tviz.append("g").classed("grid y_grid", true)
            .attr("class", "grid")
            .attr("transform", "translate(" + this.xPadding + ","
                    + (this.tH - this.tTitleH) + ")")
            .call(this.tGrid
                    .tickSize(-this.tH, 0, 0)
                    .tickFormat(""));
};

/**
 * 
 * @param {Timeline} t
 * @returns {undefined}
 */
function drawTimelineBars(t)
{

    t.tviz.selectAll("rect")
            .data(t.allPositions)
            .enter()
            .append("rect")
            .attr({
                "height": t.barH,
                "width": function(d, i) {
//                    console.log(d);
//                    console.log(d + "\t" + xScale(d));
                    var months = monthDiff(d.startDate, d.endDate) + 1;
                    if (months < 0)
                        console.log(d);
//                    console.log(t.tScale(months));
//                 console.log(t.prototype);
                    return t.tScale(months);
                },
                "x": function(d, i) {
                    var months = monthDiff(t.minDate, d.startDate);
//                    console.log(months);
                    return t.tScale(months) + t.xPadding;
//                    return (i) * (colW + 1 * xGap) + 1 * t.xPadding;
                },
                "y": function(d, i) {
//                    return 2 * t.yPadding + t.tviz * checkOverlap(d);
                    var ol = (i === 0) ? 0 : t.checkOverlap(i);
//                    return  t.tviz * i;
//                    console.log(i + "\t" + d.startDate)
                    return t.tH - (t.barH + t.tYGap) * ol - 2 * t.yPadding - t.tTitleH;
//                    return h - yScale(d) - t.yPadding;
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
                /*
                 ,
                 "fill": function(d, i) {
                 var dVal = 0;
                 //                 if (d < 256) {
                 //                 dVal = 256 - d;
                 //                 }
                 dVal = Math.ceil(256 * (i + 1) / (t.allPositions.length + 1));
                 //                    console.log(dVal);
                 return "rgb(" + 190 + "," + 220 + "," + dVal + ")";
                 }*/
            });
}

/**
 * 
 * @param {Timeline} t
 * @returns {undefined}
 */
function drawText(t)
{
    t.tviz.selectAll("text.name")
            .data(t.allPositions)
            .enter()
            .append("text")
            .text(function(d, i) {
                var position = new Position();
                position = t.allPositions[i];
                console.log(position);
                return position.title;
            })
            .attr({
                "x": function(d, i) {
                    var months = monthDiff(t.minDate, d.startDate);
//                    console.log(months);
                    return t.tScale(months) + t.xPadding + t.tScale(monthDiff(d.startDate, d.endDate)) / 2;
                },
                "y": function(d, i) {
                    var ol = (i === 0) ? 0 : t.checkOverlap(i);
                    return t.tH - (t.barH + t.tYGap) * ol - t.tTitleH + 5 - t.yPadding;
                },
                "width": function(d, i) {
//                    console.log(d);
                    var months = monthDiff(d.startDate, d.endDate) + 1;
//                    console.log(months);
                    return t.tScale(months);
                },
                "text-anchor": "middle",
                "class": "titles"
            });
    t.tviz.append("text")
            .text(t.userProfile.name + "'s Timeline")
            .attr({
                'x': t.tChartW / 2,
                'y': t.yPadding,
                "text-anchor": "middle",
                "class": "titles"

            })
}
;

/**
 * 
 * @param {Timeline} t
 * @returns {undefined}
 */
function timelineEvents(t)
{
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
                console.log(t.allPositions);
                for (var i = 0, j = t.allPositions.length; i < j; i++)
                {
                    var pos = t.allPositions[i];
//                    console.log(id);
//                    console.log(pos['id']);
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
                for (var i = 0, j = t.allPositions.length; i < j; i++)
                {
//                    console.log(t.allPositions[i]['id']);
                    if (id === t.allPositions[i]['id'])
                        console.log(t.allPositions[i]);
                }
//                var industry = "" + self.attr("desc");
//                console.log(industry);
//                displayPreview(printedProfiles[industry], industry);
            });
}
;
Timeline.prototype.calculateMaxOverlap = function(index)
{
    for (var i = 0, j = this.allPositions.length; i < j; i++)
    {
        var ol = this.checkOverlap(i);
        this.maxOverlap = (ol > this.maxOverlap) ? ol : this.maxOverlap;
    }

};
/**
 * 
 * @param {Number} index
 * @returns {undefined}
 */
Timeline.prototype.checkOverlap = function(index)
{
    if (this.overlapMode)
    {
        var overlapCount = 0;

        var fol1 = this.forwardOverlap[index];
        var fol2 = 0;
        for (var i = index + 1, j = this.allPositions.length; i < j; i++)
            fol2 += this.forwardOverlap[i];

        var bol1 = this.backOverlap[index];
        var bol2 = 0;

        for (var i = 0; i < index; i++)
            bol2 += this.backOverlap[i];

//    console.log(bol1 + "\t" + bol2 + "\t" + fol1 + "\t" + fol2);
        if (bol1 === 0)
            return 0;
        else
            return Math.abs(bol1 - bol2);
    }
    else
        return index;
//    console.log(fol + "\t" + bol);
}

Timeline.prototype.calculateOverlap = function()
{
    for (var i = 0, j = this.allPositions.length; i < j; i++)
    {
        this.overlap[i] = [];
        this.backOverlap[i] = 0;
        this.forwardOverlap[i] = 0;
//        console.log(i);
        for (var k = 0, l = this.allPositions.length; k < l; k++)
        {
            var overlapCount = 0;
            if (i === k)
            {
                this.overlap[i][k] = 0;
//                console.log(0);
            }
            else
            {
                var p1 = this.allPositions[i];
                var p2 = this.allPositions[k];
                var s1s2 = monthDiff(p1.startDate, p2.startDate);
                var s1e2 = monthDiff(p1.startDate, p2.endDate);
                var e1s2 = monthDiff(p1.endDate, p2.startDate);
                var e1e2 = monthDiff(p1.endDate, p2.endDate);
                if (e1s2 < 0 && s1e2 > 0)
                {
                    overlapCount++;
                }
//                console.log(s1s2 + "\t" + s1e2 + "\t" + e1s2 + "\t" + e1e2 + "\t" + overlapCount);
                this.overlap[i][k] = overlapCount;
            }
            if (i >= k)
                this.backOverlap[i] += overlapCount;
            else
                this.forwardOverlap[i] += overlapCount;
        }
//        console.log(overlap[i]);
    }
    /*   console.log("Overlap:");
     console.log(overlap);
     console.log(this.backOverlap);
     console.log(this.forwardOverlap);*/
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

