function load() {
    var s = document.location.search.substring(1);
    if (s == "")
        createList();
    else
        createRecord(s);
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
    else if (rank.indexOf("Probationary") != -1)
        cl = "label-danger";
    else if (rank.indexOf("Chief") != -1 || rank.indexOf("Petty") != -1)
        cl = "label-primary";
    else if (rank.indexOf("Warrant") != -1)
        cl = "label-info"
    else
        cl = "label-default";

    var link = "ranks.html#rank-" + rank.toLowerCase().replace(" ", "-");
    return $("<a href=\"" + link + "\"><span class=\"label " + cl + "\">" + rank + "</span></a>");
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
    $("#content").addClass("row");

    resp.done(function(e) {
        var offbox = $("<div class=\"col-md-6\"></div>");
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

        var preoffbox = $("<div class=\"col-md-6\"></div>");
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

        //I'll add the probationary members here after the banned list
        $("<h4>Probationary (" + e.probationary.length + ")</h4>").appendTo(offbox);
        var probationary = $("<ul></ul>");
        for (var i = 0; i < e.probationary.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.probationary[i][0]) + "\">" +
                e.probationary[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.probationary[i][1]).appendTo(li);
            li.appendTo(probationary);
        }
        probationary.appendTo(offbox);

        // Add the date of the last update and a count of active members
        $("<small class=\"text-muted\">Active members: " + 
            (e.officers.length + e.preofficers.length + e.probationary.length) + "</small><br\>").appendTo(offbox)
        $("<small class=\"text-muted\">Last updated: " + e.updated + "</small>").appendTo(offbox);

        preoffbox.appendTo("#content");
    });
}

function createRecord(name) {
    var resp = jQuery.getJSON("members/" + name + ".json");
    resp.done(function(e) {
        // Avatar
        var avatar = $("<img class=\"member-avatar\" style=\"border-radius:3px;position:relative;z-index:-1;\"></img>").appendTo("#content");
        // fetch the image URL from the powdertoythings.co.uk API wrapper
        var resp = jQuery.getJSON("http://powdertoythings.co.uk/Powder/User.json?Name="
            + encodeURIComponent(name));
        resp.done(function(e) {
            var src = e.User.Avatar;
            // check if it's hosted on gravatar or powdertoy.co.uk
            if (src.substring(0, 4) != "http")
                src = "http://powdertoy.co.uk" + src;
            avatar[0].src = src;

            // remove the element if no avatar was found
            avatar[0].onerror = function(e) {
                avatar.remove();
            }
        });

        // Title
        var title = $("<h4>" + name + " </h4>");
        createRankBadge(e.rank).appendTo(title);
        title.appendTo("#content");
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
        $("<br><a class=\"text-muted\" href=\"http://powdertoy.co.uk/User.html?Name=" + encodeURIComponent(name) + "\">Forum Profile</a>").appendTo("#content");
        for (var i in e.links) {
            $("<span class=\"text-muted\">&nbsp;&middot;&nbsp;</span><a class=\"text-muted\" href=\"" + e.links[i] + "\">" + i + "</a>").appendTo("#content");
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
            $("<small class=\"text-muted\">" + status + ")</small>").appendTo("#content");

        // Prepend the back link
        $("<a href=\"members.html\">< Back</a><br>").prependTo("#content");
    });

    resp.error(function(e) {
        // Prepend an error message
        $("<a href=\"members.html\">< Back</a>").prependTo("#content");
        $("<div class=\"alert alert-danger\"><strong>Sorry,</strong> I couldn't find a member page for "
            + name + " :(</div>").appendTo("#content");
    });
}

$(load);
