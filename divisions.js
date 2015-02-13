function load() {
    var s = document.location.search.substring(1);
    if (s === "")
        createList();
    else
        createPage(s);
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
    else if (rank.indexOf("Chief") != -1 || rank.indexOf("Petty") !=-1)
        cl = "label-primary";
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
        // Global variables for the "boxes"
        var li, i;

        var securitybox = $("<div class=\"col-md-6\"></div>");
        $("<h4><a href=\"divisions.html?\">Security</a> (" + e.bmnsd.length + ")</h4>").appendTo(securitybox);
        var bmnsd = $("<ul></ul>");
        for (i = 0;i < e.bmnsd.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmnsd[i][0]) + "\">" + e.bmnsd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmnsd[i][1]).appendTo(li);
            li.appendTo(bmnsd);
        }
        bmnsd.appendTo(securitybox);
        securitybox.appendTo("#content");

        var technicalbox = $("<div class=\"col-md-6\"></div>");
        $("<h4><a href=\"divisions.html?\">Technical</a> (" + e.bmntd.length + ")</h4>").appendTo(technicalbox);
        var bmntd = $("<ul></ul>");
        for (i = 0;i < e.bmntd.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmntd[i][0]) + "\">" + e.bmntd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmntd[i][1]).appendTo(li);
            li.appendTo(bmntd);
        }
        bmntd.appendTo(technicalbox);
        technicalbox.appendTo("#content");

        $("<h4><a href=\"divisions.html?\">Public Relations</a> (" + e.bmnprd.length + ")</h4>").appendTo(securitybox);
        var bmnprd = $("<ul></ul>");
        for (i = 0;i < e.bmnprd.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmnprd[i][0]) + "\">" + e.bmnprd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmnprd[i][1]).appendTo(li);
            li.appendTo(bmnprd);
        }
        bmnprd.appendTo(securitybox);

        $("<h4><a href=\"divisions.html?\">Records</a> (" + e.bmnrd.length + ")</h4>").appendTo(technicalbox);
        var bmnrd = $("<ul></ul>");
        for (i = 0;i < e.bmnrd.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmnrd[i][0]) + "\">" + e.bmnrd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmnrd[i][1]).appendTo(li);
            li.appendTo(bmnrd);
        }
        bmnrd.appendTo(technicalbox);


        $("<h4><a href=\"divisions.html?\">Research and Development</a> (" + e.bmnrdd.length + ")</h4></a>").appendTo(securitybox);
        var bmnrdd = $("<ul></ul>");
        for (i = 0;i < e.bmnrdd.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.bmnrdd[i][0]) + "\">" + e.bmnrdd[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.bmnrdd[i][1]).appendTo(li);
            li.appendTo(bmnrdd);
        }
        bmnrdd.appendTo(securitybox);
        // Add the date of the last update
        $("<small class=\"text-muted\">Last updated: " + e.updated + "</small>").appendTo(technicalbox);

    });
}

function createPage(name) {
    var resp = jQuery.getJSON("divisions/" + name + ".json");
    resp.done(function(e)){
        // Title
        var title = $("<h4>" + name + " </h4>");
        title.appendTo("#content");
        // Links
        for (var i in e.links) {
            $("<span class=\"text-muted\">&nbsp;&middot;&nbsp;</span><a class=\"text-muted\" href=\"" + e.links[i] + "\">" + i + "</a>").appendTo("#content");
        }
        // Aaand add the page
        $("<div class=\"member-page\">" + e.page + "</div>").appendTo("#content");

        // Prepend the back link
        $("<a href=\"divisions.html\">< Back</a><br>").prependTo("#content");
    });

    resp.error(function(e) {
        // Prepend an error message
        $("<a href=\"divisions.html\">< Back</a>").prependTo("#content");
        $("<div class=\"alert alert-danger\"><strong>Sorry,</strong> I couldn't find a division page for " + name + " :(</div>").appendTo("#content");
    });
}

$(load);
