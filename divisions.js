function load() {
    var s = document.location.search.substring(1);
    if (s == "")
        createList();
    else
        createRecord(s);
}

function createRankBadge(rank) {
    var cl = "";
    if (rank.indexOf("Admiral") != -1)
        cl = "badge-warning";
    else if (rank.indexOf("Captain") != -1)
        cl = "badge-silver";
    else if (rank.indexOf("Commander") != -1)
        cl = "badge-bronze";
    else if (rank.indexOf("Lieutenant") != -1 || rank.indexOf("Ensign") != -1)
        cl = "badge-inverse";
    else if (rank.indexOf("Candidate") != -1)
        cl = "badge-success";
    else
        cl = "badge-default";

    return $("<span class=\"label " + cl + "\">" + rank + "</span>");
}

function createList() {
    var resp = jQuery.getJSON("divsions.json");
    // Set content to be fluid
    $("#content").addClass("row-fluid");

    resp.done(function(e) {
        var offbox = $("<div class=\"span6\"></div>");
        $("<h4>Officers</h4>").appendTo(offbox);
        var officers = $("<ul></ul>");
        for (var i = 0; i < e.officers.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"divisions.html?" + encodeURIComponent(e.officers[i][0]) + "\">" +
                e.officers[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.officers[i][1]).appendTo(li);
            li.appendTo(officers);
        }
        officers.appendTo(offbox);
        offbox.appendTo("#content");
}

function createRecord(name) {
    var resp = jQuery.getJSON("members/" + name + ".json");
    resp.done(function(e) {
        // Title
        var title = $("<h4>" + name + " </h4>");
        createRankBadge(e.rank).appendTo(title);
        title.prependTo("#content");
        $("<i>" + e.rank_comment + "</i>").appendTo("#content");

        // Put awards into a table and sort it by rank
        sortable = [];
        for (var i in e.awards)
            sortable.push([i, e.awards[i]]);
        sortable.sort(function(a, b) {return b[1] - a[1]});

        // Award box
        var box = $("<div class=\"award-box\"></div>");
        for (var i = 0; i < sortable.length; i++) {
            createAwardBadge(sortable[i][0], sortable[i][1]).appendTo(box);
        }
        box.appendTo("#content");

        // Links
        $("<br><a class=\"muted\" href=\"http://powdertoy.co.uk/User.html?Name=" + encodeURIComponent(name) + "\">Forum Profile</a>").appendTo("#content");
        for (var i in e.links) {
            $("<span class=\"muted\">&nbsp;&middot;&nbsp;</span><a class=\"muted\" href=\"" + e.links[i] + "\">" + i + "</a>").appendTo("#content");
        }

        // Aaand add the page
        $("<div class=\"member-page\">" + e.page + "</div>").appendTo("#content")

        // Prepend the back link
        $("<a href=\"members.html\">< Back</a><br>").prependTo("#content");
    });

    resp.error(function(e) {
        // Prepend an error message
        $("<a href=\"members.html\">< Back</a>").prependTo("#content");
        $("<div class=\"alert alert-error\">Sorry, I couldn't find a member page for "
            + name + " :(</div>").appendTo("#content");
    });
}

$(load);
