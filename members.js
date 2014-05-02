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

function createAwardBadge(name, rank) {
    var cl = "";
    var rn = "";
    switch (rank) {
        case 0:
            cl = "badge-inverse"; rn = "Badge"; break;
        case 1:
            cl = "badge-default"; rn = "Standard rank"; break;
        case 2:
            cl = "badge-bronze"; rn = "Bronze rank"; break;
        case 3:
            cl = "badge-silver"; rn = "Silver rank"; break;
        case 4:
            cl = "badge-warning"; rn = "Gold rank"; break;
        case 5:
            cl = "badge-diamond"; rn = "Diamond rank"; break;
    }
    var link = "infos.html#award-" + name.toLowerCase().replace(" ", "-");
    return $("<a href=\"" + link + "\"><span class=\"badge " + cl + "\" title=\"" + rn + "\">" + name + "</span></a><span> </span>");
}

function createList() {
    var resp = jQuery.getJSON("members.json");
    // Set content to be fluid
    $("#content").addClass("row-fluid");

    resp.done(function(e) {
        var offbox = $("<div class=\"span6\"></div>");
        $("<h4>Officers (" + e.officers.length + ")</h4>").appendTo(offbox);
        var officers = $("<ul></ul>");
        for (var i = 0; i < e.officers.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.officers[i][0]) + "\">" +
                e.officers[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.officers[i][1]).appendTo(li);
            li.appendTo(officers);
        }
        officers.appendTo(offbox);
        offbox.appendTo("#content");

        var preoffbox = $("<div class=\"span6\"></div>");
        $("<h4>Preofficers (" + e.preofficers.length + ")</h4>").appendTo(preoffbox);
        var preofficers = $("<ul></ul>")
        for (var i = 0; i < e.preofficers.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.preofficers[i][0]) + "\">" +
                e.preofficers[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.preofficers[i][1]).appendTo(li);
            li.appendTo(preofficers);
        }
        preofficers.appendTo(preoffbox);

        // I'll just add the resigned and banned members here for now
        $("<h4>Resigned (" + e.resigned.length + ")</h4>").appendTo(offbox);
        var resigned = $("<ul></ul>");
        for (var i = 0; i < e.resigned.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.resigned[i]) + "\">" +
                e.resigned[i] + "</a><span> </span>").appendTo(li);
            li.appendTo(resigned);
        }
        resigned.appendTo(offbox);

        $("<h4>Banned (" + e.banned.length + ")</h4>").appendTo(offbox);
        var banned = $("<ul></ul>");
        for (var i = 0; i < e.banned.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.banned[i]) + "\">" +
                e.banned[i] + "</a><span> </span>").appendTo(li);
            li.appendTo(banned);
        }
        banned.appendTo(offbox);

        // Add the date of the last update and a count of active members
        $("<small class=\"muted\">Active members: " + 
            (e.officers.length + e.preofficers.length) + "</small><br\>").appendTo(preoffbox)
        $("<small class=\"muted\">Last updated: " + e.updated + "</small>").appendTo(preoffbox);

        preoffbox.appendTo("#content");
    });
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
        $("<div class=\"member-page\">" + e.page + "</div>").appendTo("#content");

        // Oh, and don't forget the voucher and safe status
        var status = "";
        if (e.voucher) {
            status += "(This member has a voucher";

            if (e.safe == 1)
                status += " and is safe for the next IMC/IRC";
            else if (e.safe == 2)
                status += " and is autosafe";
        }
        else {
            if (e.safe == 1)
                status += "(This member is safe for the next IMC/IRC";
            else if (e.safe == 2)
                status += "(This member is absolutely necessary to keep the group going and thus is autosafe";
        }
        if (status != "")
            $("<small class=\"muted\">" + status + ")</small>").appendTo("#content");

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
