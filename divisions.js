function load() {
    var s = document.location.search.substring(1);
    if (s == "")
        createList();
}

function createRankBadge(rank) {
    var cl = "";
    if (rank.indexOf("Fleet Admiral") != -1)
        cl = "badge-diamond";
    else if (rank.indexOf("Admiral") != -1)
        cl = "badge-warning";
    else if (rank.indexOf("Captain") != -1)
        cl = "badge-silver";
    else if (rank.indexOf("Commander") != -1)
        cl = "badge-bronze";
    else if (rank.indexOf("Lieutenant") != -1 || rank.indexOf("Ensign") != -1)
        cl = "badge-inverse";
    else if (rank.indexOf("Candidate") != -1)
        cl = "label-success";
    else
        cl = "label-default";

    var link = "ranks.html#rank-" + rank.toLowerCase().replace(" ", "-");
    return $("<a href=\"" + link + "\"><span class=\"label " + cl + "\">" + rank + "</span></a>");
}

function createList() {
    var resp = jQuery.getJSON("divisions.json");
    // Set content to be fluid
    $("#content").addClass("row");

    resp.done(function(e) {
        var securitybox = $("<div class=\"col-md-6\"></div>");
        $("<h4>BMN Security Division (" + e.bmnsd.length + ")</h4>").appendTo(securitybox);
        var bmnsd = $("<ul></ul>");
        for (var i = 0; i < e.bmnsd.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmnsd[i][0]) + "\">" +
                e.bmnsd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmnsd[i][1]).appendTo(li);
            li.appendTo(bmnsd);
        }
        bmnsd.appendTo(securitybox);
        securitybox.appendTo("#content");

        var technicalbox = $("<div class=\"col-md-6\"></div>");
        $("<h4>BMN Technical Division (" + e.bmntd.length + ")</h4>").appendTo(technicalbox);
        var bmntd = $("<ul></ul>")
        for (var i = 0; i < e.bmntd.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmntd[i][0]) + "\">" +
                e.bmntd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmntd[i][1]).appendTo(li);
            li.appendTo(bmntd);
        }
        bmntd.appendTo(technicalbox);
        technicalbox.appendTo("#content");

        $("<h4>BMN Records Division (" + e.bmnrd.length + ")</h4>").appendTo(securitybox);
        var bmnrd = $("<ul></ul>");
        for (var i = 0; i < e.bmnrd.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmnrd[i][0]) + "\">" +
                e.bmnrd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmnrd[i][1]).appendTo(li);
            li.appendTo(bmnrd);
        }
        bmnrd.appendTo(securitybox);

        // Add the date of the last update
        $("<small class=\"text-muted\">Last updated: " + e.updated + "</small>").appendTo(technicalbox);

    });
}

$(load);
