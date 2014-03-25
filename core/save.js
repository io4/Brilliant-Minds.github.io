function SaveBlock(Element){
		//Element = $(this);
		SaveID = $(Element).children("b").html();
		ptjq.getJSON('/Browse/View.json?ID='+SaveID, function(data){
			SaveElement = ptjq("<div class=\"savegame\"></div>");
				ImgElement = ptjq("<a href=\"/Browse/View.html?ID="+data.ID+"\"><img height=\"96\" width=\"153\" src=\"http://static.powdertoy.co.uk/"+data.ID+"_small.png\"/></a>").appendTo(SaveElement);
				ImgElement.on("mouseover", function(){
					CImgElement = ptjq(this);
					if(CImgElement.hasClass("active") == false)
					{
						CImgElement.addClass("active");
						ImgOverlay = ptjq('<div class="overlay"></div>').prependTo(CImgElement.parent());
						ImgOverlay.css({"opacity": 0, "top": "28px"});
						//FormElement = ptjq('<form class="SaveDownloadDo" method="POST" action="/Browse/View.html?ID='+data.ID+'"><input type="hidden" name="DoDownload" value="'+data.ID+'"/></form>').appendTo(ImgOverlay);
						FormElement = ptjq('<form class="SaveDownloadDo" method="POST" action="/Browse/View.html?ID='+data.ID+'"></form>').appendTo(ImgOverlay);
						ptjq('<a class="btn btn-primary" href="/Browse/View.html?ID='+data.ID+'">View</a>').appendTo(FormElement);
						ptjq('<a class="btn btn-inverse" href="ptsave:'+data.ID+'#'+data.Name+'">Open</a>').appendTo(FormElement);
						/*if(CImgElement.queued == true) {
							ptjq('<input type="submit" class="btn-submit btn btn-success disabled" value="Queue"/>').appendTo(FormElement);
						} else {
							ptjq('<input type="submit" class="btn-submit btn btn-inverse" value="Queue"/>').appendTo(FormElement);
						}
						FormElement.submit(function(){
							Form = $(this);
							Form.children(".btn-submit").addClass("disabled");
							Form.children(".btn-submit").val("Queueing");
							Link = Form.attr("action").replace(/\.html/, ".json");
							ptjq.post(Link, $(this).serialize(), function(data){
								//PopupUtility(data.HTML);
								if(data.Status=="1"){
									CDownloadElement = Form.children(".btn-submit");
									CDownloadElement.val("Queued");
									CDownloadElement.addClass("btn-success");
									CDownloadElement.addClass("disabled");
									CDownloadElement.removeClass("btn-inverse");
								} else {
									PopupUtility(data.HTML);
								}
							}, "json");
							return false;
						});*/
						
						
						ImgOverlay.animate({"opacity": 1, "top": "3px"}, 200);
						
						ImgOverlay.on("mouseleave", function(){
							CImgOverlay = $(this);
							CImgElement = CImgOverlay.parent().children("a");
							CImgOverlay.animate({"opacity": 0, "top": "-23px"}, 200, function(){
								CImgOverlay.remove();
								CImgElement.removeClass("active");
							});
						});
					}
				});

				SaveInfoElement = ptjq("<div class=\"caption\"></div>").appendTo(SaveElement);
					TitleElement = ptjq("<h5 title=\""+data.Name+"\"><a href=\"/Browse/View.html?ID="+data.ID+"\">"+data.ShortName+"</a></h5>").appendTo(SaveInfoElement);
					AuthorElement = ptjq("<span class=\"author\">"+data.Username+"</span>").appendTo(SaveInfoElement);
					CommentsElement = ptjq("<span class=\"comments\">"+data.Comments+" comments</span>").appendTo(SaveInfoElement);
					ClearElement = ptjq("<div class=\"Clear\"></div>").appendTo(SaveInfoElement);
					/*FormElement = $("<form class=\"SaveDownloadDo\" method=\"POST\" action=\"/Browse/View.html?ID="+data.ID+"\"></form>").appendTo(SaveInfoElement);
						DownloadElement = $("<input type=\"submit\" class=\"btn\" id=\"fDB"+data.ID+"\" value=\"Download\"/>").appendTo(FormElement);
						HiddenIDElement = $("<input type=\"hidden\" name=\"DoDownload\" value=\""+data.ID+"\"/>").appendTo(FormElement);
					FormElement.submit(function(){
						Link = $(this).attr("action").replace(/\.html/, ".json");
						$.post(Link, $(this).serialize(), function(data){
							//PopupUtility(data.HTML);
							if(data.Status=="1"){
								CDownloadElement = $("#fDB"+data.SaveID);
								CDownloadElement.val("Queued");
								CDownloadElement.attr("disabled", "disabled");
							} else {
								PopupUtility(data.HTML);
							}
						}, "json");
						return false;
					});*/
			ptjq(Element).replaceWith(SaveElement);
		});
}
