if((document.URL.indexOf("vk.com")!=-1)&&(document.URL.indexOf("story")!=-1)){
	if (!window.VkStorySaverLib) {
		window.VkStorySaverLib = {
			forMutation: function(mutation) {
				var a, diva, prevLink;
				var story = document.body.getElementsByClassName("story_view_row_active")[0];
				if (!story) {
					window.observer.disconnect();
				} else {
					if (story.getElementsByClassName("vk story saver").length) {
						diva = story.getElementsByClassName("vk story saver")[0];
						if (diva.getElementsByTagName("a").length) {
							a = diva.getElementsByTagName("a")[0];
							prevLink = a.href;
						} else {
							a = document.createElement("a");
							a.innerText = "Сохранить";
						}
					} else {
						diva = document.createElement("div");
						diva.className = "vk story saver";
						diva.style.marginLeft = "6px";
						a = document.createElement("a");
						a.innerText = "Сохранить";
						story.getElementsByClassName("story_view_info")[0].appendChild(diva);
					}
					if (document.body.getElementsByClassName("story_view_video").length) {
						if (document.body.getElementsByClassName("story_view_video")[0].currentSrc.indexOf(".mp4") != -1) {
							a.href = document.body.getElementsByClassName("story_view_video")[0].currentSrc;
							if (a.href.indexOf("?") > -1) {
								a.href = a.href.substring(0, a.href.indexOf("?"));}
								a.download = ".mp4";
							}
						} else {
							if (document.body.getElementsByClassName("story_view_photo started").length) {
								if (document.body.getElementsByClassName("story_view_photo started")[0].currentSrc.indexOf(".jpg") != -1) {
									a.href = document.body.getElementsByClassName("story_view_photo started")[0].currentSrc;
									if (a.href.indexOf("?") > -1) {
										a.href = a.href.substring(0, a.href.indexOf("?"));}
										a.download = ".jpg";
									}
								} else {
									if (document.body.getElementsByClassName("story_view_photo").length) {
										if (document.body.getElementsByClassName("story_view_photo")[0].currentSrc.indexOf(".jpg") != -1) {
											a.href = document.body.getElementsByClassName("story_view_photo")[0].currentSrc;
											if (a.href.indexOf("?") > -1) {
												a.href = a.href.substring(0, a.href.indexOf("?"));}
												a.download = ".jpg";
											}
										}
									}
								}
								if (a.href && (a.href != prevLink)) {
									diva.appendChild(a);
								}
							}
						}
					}
				}

				if (document.body.getElementsByClassName("story_view_row_active").length) {
					if (!document.body.getElementsByClassName("story_view_row_active")[0].getElementsByClassName("vk story saver").length) {
						var diva1 = document.createElement("div");
						diva1.className = "vk story saver";
						diva1.style.marginLeft = "6px";
						document.body.getElementsByClassName("story_view_row_active")[0].getElementsByClassName("story_view_info")[0].appendChild(diva1);
						var target = document.getElementsByClassName("story_view_row_active")[0];
						window.observer = new MutationObserver(function(mutations) {
							mutations.forEach(function(mutation) {
								VkStorySaverLib.forMutation(mutation);
							})
						});
						var config = {
							childList: true,
							characterData: true,
							subtree: true
						};
						observer.observe(target, config);
					}
					var checkFlag = true,
					check = document.body.getElementsByClassName("story_view_row_active")[0];
					if (check) {
						check = check.getElementsByClassName("vk story saver")[0];
						if (check) {
							check = check.getElementsByTagName("a")[0];
							if (check) {
								check = check.href;
								if (check) {
									checkFlag = false;
								}
							}
						}
					}
					if (checkFlag) {
						VkStorySaverLib.forMutation(null);
					}
				}
			}
