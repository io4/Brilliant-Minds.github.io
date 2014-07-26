// Use like this:
// <save data-id="1234567" data-author="Author Name" data-title=""

function loadSaves() {
    $.each($("save"), function(o) {
        $this = $(this);
        var id = $this.attr("data-id");
        var author = $this.attr("data-author");
        var title = $this.attr("data-title");
        var img = $this.attr("data-img");

        var stitle;
        if (title.length >= 21)
            stitle = title.substring(0, 21) + "...";
        else
            stitle = title;

        if (img == undefined)
            img = "http://static.powdertoy.co.uk/" + id + "_small.png";
        
        var html = $(
["<div class=\"savegame-outer\">",
"  <div class=\"savegame\">",
"    <div class=\"overlay\">",
"      <a class=\"btn btn-primary\" href=\"http://powdertoy.co.uk/Browse/View.html?ID=" + id + "\">View</a>",
"      <a class=\"btn btn-inverse\" href=\"ptsave:" + id + "#" + title.replace(/[,.\s]+/g, "_") + "\">Open</a>",
"    </div>",
"    <a href=\"http://powdertoy.co.uk/Browse/View.html?ID=" + id + "\">",
"      <img type=\"image/png\" height=\"96\" width=\"153\" src=\"" + img + "\">",
"    </a>",
"    <div class=\"caption\">",
"      <h6>",
"        <a href=\"http://powdertoy.co.uk/Browse/View.html?ID=" + id + "\">" + stitle + "</a>",
"      </h6>",
"      <span class=\"author\">" + author + "</span>",
"    </div>",
"  </div>",
"</div>"].join("\n"));
        $this.replaceWith(html);
    });
}

$(loadSaves);
