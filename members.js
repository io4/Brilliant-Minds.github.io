function load() {
    var s = document.location.search.substring(1);
    if (s == "")
        createList();
    else
        createRecord(s);
}

function createList() {
    var resp = jQuery.getJSON("members.json");
    resp.done(function(e) {
        //
    });
}

function createRecord(name) {
    var resp = jQuery.getJSON("members/" + name + ".json");
    resp.done(function(e) {
        $("<a href=\"members.html\">< Back</a>").appendTo("#content");
        title = $("<b>" + name + " </h4>");
        $("<span class=\"badge\">" + e.rank + "</span>").appendTo(title);
        title.prependTo("#content");
    });

    resp.error(function(e) {
        // Prepend an error message
        $("<a href=\"members.html\">< Back</a>").appendTo("#content");
        $("<div class=\"alert alert-error\">Could find no member named \""
            + name + "\" :(</div>").appendTo("#content");
    });
}

$(load);
