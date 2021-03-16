var social = (function(){

	/*
	** @param mobile {boolean}
	** @description is client on mobile devie
	*/
	var mobile = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) || navigator.userAgent.match(/(Android)/g) ? true : false;

	/*
	** @param protocol {string}
	** @description differnt link protocol based on device
	*/
	var protocol = {
		twitter:{
			mobile:"twitter://post?message=",
			desktop:"http://twitter.com/intent/tweet?"
		},
		facebook:{
			mobile:"fb://publish/profile/me?text=",
			desktop:"http://facebook.com"
		},
		linkedin:{
			mobile:"linkedin://",
			desktop:"http://facebook.com"
		}				
	}	

	/*
	** @param message {string}
	** @description placeholder for postable message
	*/
	var message;

	/*
	** @param encoded {string}
	** @description uri encoded message
	*/
	var encoded; 

	/*
	** @param via {string}
	** @description add @ to post
	*/
	var via = "superangrypixel";

	/*
	** @param url {string}
	** @description adds url to post
	*/
	var url = "https://itunes.apple.com/ca/developer/eugene-andruszczenko/id1046563888";

	/*
	** @param url {array}
	** @description adds url to post
	*/
	var hashtags = ["#pixel", "#game", "#ios", "#android"];

	var phrase = "Check out Super Angry Lander Pixel";

	/*
	** @param delay {int}
	** @description delay for mobile
	*/
	var delay = 1500; 	

	function post(network, score)
	{	
		if(score != undefined){
			phrase = "I got a score of " + score + " playing Super Angry Lander Pixel";
		}
		var interval = setInterval(function(){
			if(url)
			{
				switch(network)
				{
					case "twitter":
						message = mobile ? 
							phrase + " " + url + " @" + via + " " + hashtags.join(" ").replace(/[#]/g,'%23') :
							"text=" + phrase + "&url=" + url + "&via=" + via + "&hashtags=" + hashtags.join(",").replace(/[#]/g,'') ;
					break;
				}				
				mobile ? window.location.href = protocol[network].mobile + message : window.open(protocol[network].desktop + message, "_blank");
				/*
				** @description fallback for mobile clients without app installed
				*/

				var wait = new Date();
				if(mobile)
				{
					setTimeout(function(){
						(new Date() - wait) > (delay*2) ? false : window.open(protocol[network].desktop + message, "_blank");
					},delay)
				}				
				clearInterval(interval);
			}
		},100)
	}

	return {
		post:function(network, score){post(network, score)}
	}
})();