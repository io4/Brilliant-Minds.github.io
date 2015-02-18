function load(){
    var s = document.location.search.substring(1);
    if (s === ""){
        createList();
    } else {
        createRecord(s);
    }
}

function createRankBadge(rank) {
    var cl = "";
    if (rank.indexOf("Don") != -1)
        cl = "badge-diamond";
    else if (rank.indexOf("Under Boss") != -1)
        cl = "badge-warning";
    else if (rank.indexOf("Consigliere") != -1)
        cl = "badge-silver";
    else if (rank.indexOf("Soilder Leader") != -1)
        cl = "badge-bronze";
    else if (rank.indexOf("Soilder") != -1 || rank.indexOf("Ensign") != -1)
        cl = "badge-inverse";
    else if (rank.indexOf("Associate") != -1)
        cl = "label-success";
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
        // Global variables for the "boxes"
        var li, i;

        var offbox = $("<div class=\"col-md-6\"></div>");
        $("<h4>Moderators (" + e.moderators.length + ")</h4>").appendTo(offbox);
        var moderators = $("<ul></ul>");
        for (i = 0;i < e.moderators.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.moderators[i][0]) + "\">" + e.moderators[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.moderators[i][1]).appendTo(li);
            li.appendTo(moderators);
        }
        officers.appendTo(offbox);
        offbox.appendTo("#content");
        
        $("<h4>Enlisted (" + e.members.length + ")</h4>").appendTo(offbox);
        var members = $("<ul></ul>");
        for (i = 0;i < e.members.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.members[i][0]) + "\">" + e.members[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.members[i][1]).appendTo(li);
            li.appendTo(members);
        }
        enlisted.appendTo(offbox);

        var preoffbox = $("<div class=\"col-md-6\"></div>");
        $("<h4>Preofficers (" + e.noobs.length + ")</h4>").appendTo(preoffbox);
        var noobs = $("<ul></ul>");
        for (i = 0;i < e.noobs.length; i++) {
            li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.noobs[i][0]) + "\">" + e.noobs[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.noobs[i][1]).appendTo(li);
            li.appendTo(noobs);
        }
        preofficers.appendTo(preoffbox);
});
function createRecord(name) {
    var resp = jQuery.getJSON("members/" + name + ".json");
    var i;
    resp.done(function(e) {
        // Avatar
        var avatar = $("<img class=\"member-avatar\" style=\"border-radius:3px;position:relative;z-index:-1;\"></img>").appendTo("#content");
        // fetch the image URL from the powdertoythings.co.uk API wrapper
        var resp = jQuery.getJSON("http://powdertoythings.co.uk/Powder/User.json?Name="+ encodeURIComponent(name));
        resp.done(function(e) {
            var src = e.User.Avatar;
            // check if it's hosted on gravatar or powdertoy.co.uk
            if (src.substring(0, 4) != "http")
                src = "http://powdertoy.co.uk" + src;
            avatar[0].src = src;

            // remove the element if no avatar was found
            avatar[0].onerror = function() {
                avatar.remove();
            };
        });

        // Title
        var title = $("<h4>" + name + " </h4>");
        createRankBadge(e.rank).appendTo(title);
        title.appendTo("#content");
        $("<i>" + e.rank_comment + "</i>").appendTo("#content");

        // Put awards into a table and sort it by rank
        var sortable = [];

        for (var i in e.awards)
            sortable.push([i, e.awards[i]]);
        sortable.sort(function(a, b) {return b[1] - a[1];});

        i = 0;
        // Award box
        var box = $("<div class=\"award-box\"></div>");
        for (i = 0;i < sortable.length; i++) {
            createAwardBadge(sortable[i][0], sortable[i][1]).appendTo(box);
        }
        box.appendTo("#content");

        // Links
        $("<br><a class=\"text-muted\" href=\"http://powdertoy.co.uk/User.html?Name=" + encodeURIComponent(name) + "\">Forum Profile</a>").appendTo("#content");
        for (i = 0;i in e.links;) {
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
        if (status !== "")
            $("<small class=\"text-muted\">" + status + ")</small>").appendTo("#content");

        // Prepend the back link
        $("<a href=\"members.html\">< Back</a><br>").prependTo("#content");
    });

    resp.error(function() {
        // Prepend an error message
        /*var resp = jQuery.getJSON("members.json");
        resp.done(function(e) {
            var i = 0;
            for (i < e.moderators.length; i++;) {
                if (e.officers[i][0] == name) {
                    foundbutnorecord( e.moderators[i][1]);
                }
            }
            for (i < e.members.length; i++;) {
                if (e.enlisted[i][0] == name) {
                    foundbutnorecord( e.members[i][1]);
                }
            }
            for (i < e.noobs.length; i++;) {
                if (e.noobs[i][0] == name) {
                    foundbutnorecord( e.preofficers[i][1]);
                }
            }
                       var foundbutnorecord = function(rank) {
                // Avatar
                var avatar = $("<img class=\"member-avatar\" style=\"border-radius:3px;position:relative;z-index:-1;\"></img>").appendTo("#content");
                // fetch the image URL from the powdertoythings.co.uk API wrapper
                var resp = jQuery.getJSON("http://powdertoythings.co.uk/Powder/User.json?Name=" + encodeURIComponent(name));
                resp.done(function(e) {
                    var src = e.User.Avatar;
                    // check if it's hosted on gravatar or powdertoy.co.uk
                    if (src.substring(0, 4) != "http") {
                        src = "http://powdertoy.co.uk" + src;
                    }
                    avatar[0].src = src;

                    // remove the element if no avatar was found
                    avatar[0].onerror = function() {
                        avatar.remove();
                    };
                });

                // Title
                var title = $("<h4>" + name + " </h4>");
                createRankBadge(rank).appendTo(title);
                title.appendTo("#content");

            };
        });

        resp.error(function() {*/
            // Prepend an error message
            $("<a href=\"members.html\">< Back</a>").prependTo("#content");
            $("<div class=\"alert alert-danger\"><strong>Sorry,</strong> I couldn't find a member page for " + name + " :(</div>").appendTo("#content");
       // });
    });
}

$(load);
