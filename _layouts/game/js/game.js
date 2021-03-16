/*
** @author Eugene Andruszczenko
** @version 0.1
** @date September 18th, 2015
** @description 
** game.js is a a full canvas timber game
*/
var game = (function(){
	/*
	** @param canvas {object}
	*/	
	var canvas = document.getElementById("game");

	/*
	** @param ctx {context}
	*/		
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;

	/*
	** @param width {int}
	** @param height {int}
	*/		
	var width = 568;
	var height = 320;

	/*
	** @param px {int}
	** @param py {int}
	*/		
	var px = 0;
	var py = 0;	
	
	/*
	** @param scale {array}
	*/			
	var scale = [
		(window.innerWidth/width),
		(window.innerHeight/height)
	];

	scale = [1,1];

	/*
	** @desc autoscale
	*/	
	ctx.canvas.width = width*scale[0];
	ctx.canvas.height = height*scale[1];	
	ctx.scale(scale[0], scale[1]);	

	/*
	** @param image {image}
	*/
	var image = new Image();

	/*
	** @method asset
	** @param src {string}
	** @description source to load
	** @return image obje
	*/	
	function asset(src)
	{
		image = new Image();
		image.src = "game/img/" + src;
		return image;
	}

	/*
	** @param assets {object}
	*/
	var assets = {
		intro:asset("intro.png"),
		instructions:asset("instructions.png"),
		gameover:asset("gameover.png"),
		ad:asset("ad.png"),
		bgsound_on:asset("note.png"),
		bgsound_off:asset("note_off.png"),
		sprite:asset("sprite.png"),
		land:asset("land.png"),
		arrow:asset("arrow.png"),
		bg:{
			sky:asset("bg_sky.png"),
			ground:asset("bg_ground.png"),
			rocksfg:asset("bg_rocks_fg.png"),
			rocksbg:asset("bg_rocks_bg.png"),
			cloudsfg:asset("bg_clouds_fg.png"),
			cloudsbg:asset("bg_clouds_bg.png"),			
			bushfg:asset("bg_bush.png"),
			bushbg:asset("bg_bush_bg.png"),
		}
	};

	/*
	** @param bit {object}
	** @description 8 bit font used in application
	*/
	const bit = {
		small:'16px "bit"',
		medium:'24px "bit"',
		large:'48px "bit"',
		huge:'96px "bit"'
	}

	/*
	** @param colors {object}
	** @description color collection used in app in rgba format
	*/
	const colors = {
		black:"rgba(0,0,0,1)",
		background:"rgba(239,239,239,1)",
		white:"rgba(255,255,255,1)",
	}	

	/*
	** @description sounds
	*/
	const click = new Audio("game/music/click.wav");
	const crash = new Audio("game/music/over.mp3");	
	const next = new Audio("game/music/next.mp3");	
	const music = new Audio("game/music/music.wav");
	const splash = new Audio("game/music/splash.mp3");
	const drop = new Audio("game/music/drop.wav");
	let bgsound = true;		

	/*
	** @param fps {int}
	*/
	const fps = 60;

	/*
	** @param toggle {boolean}
	*/
	var toggle = false;

	/*
	** @param ready {boolean}
	*/
	var ready = false;	

	/*
	** @param pause {boolean}
	*/
	var pause = false;

	/*
	** @param games {int}
	*/
	var games_played = 0;

	/*
	** @param shoads {int}
	*/
	var show_ad_after_games = 3;	

	/*
	** @param rated {boolean}
	*/
	var rated = false;

	/*
	** @param state {string}
	*/
	var state = "intro";

	/*
	** @ params sx sy 
	** @description twitter coord
	 */
	var sx = 190;
	var sy = 200;

	/*
	** @param pressed {boolean}
	*/
	var pressed = false;	

	/*
	** @method init
	** @description 
	*/
	function init()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.backgroundColor = colors.background;

		window.navigator.userAgent.indexOf("Firefox") != -1 || window.navigator.userAgent.indexOf("Chrome") != -1? 
		canvas.addEventListener('mousedown', game.controls, false) :
		canvas.addEventListener('touchstart', game.controls, false);

		window.navigator.userAgent.indexOf("Firefox") != -1 || window.navigator.userAgent.indexOf("Chrome") != -1? 
		canvas.addEventListener('mouseup', game.controls, false) :
		canvas.addEventListener('touchend', game.controls, false);	

		window.navigator.userAgent.indexOf("Firefox") != -1 || window.navigator.userAgent.indexOf("Chrome") != -1? 
		canvas.addEventListener('mousemove', game.controls, false) :
		canvas.addEventListener('touchmove', game.controls, false);			


		score.init("BOTTOM_RIGHT");
		lava.init();		
		land.init();
		sling.init();

    setTimeout(() => {
			ready = true;
		},250);
	}

	/*
	** @method draw
	** @description this is the core of the loop
	*/
	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.backgroundColor = colors.background;
		ctx.drawImage(assets.bg.sky, 0, 0, 1704, 320);
		ctx.drawImage(assets.bg.ground, (land.map[0].x/5)-100, 0, 1704, 320);	
		ctx.drawImage(assets.bg.bushbg, (land.map[0].x/25)-100, 0, 1704, 320);	
		ctx.drawImage(assets.bg.rocksbg, (land.map[0].x/20)-100, 0, 1704, 320);		
		ctx.drawImage(assets.bg.bushfg, (land.map[0].x/15)-100, 0, 1704, 320);				
		ctx.drawImage(assets.bg.rocksfg, (land.map[0].x/10)-100, 0, 1704, 320);					
		ctx.drawImage(assets.bg.cloudsbg, (land.map[0].x/12)-100, 0, 1704, 320);	
		ctx.drawImage(assets.bg.cloudsfg, (land.map[0].x/7)-100, 0, 1704, 320);					

		lava.update(0.5);
		switch(state)
		{
			case "intro":
			case "instructions":
			case "ad":
				ctx.drawImage(assets[state], 0, 0, width, height);
			break;
			case "play":	
				land.update();
				sling.draw();			
				score.draw();
			break;
			case "gameover":
				ctx.drawImage(assets[state], 0, 0, width, height);
				gameover();
			break;
		}	

		/*
		** @description sound and music loop
		*/
		if(music.currentTime >= music.duration)
		{
			music.currentTime = 0;
			music.play();
		}	
		sound();

	}

	/*
	**
	*/
	var land = {
		sprite:{x:0,y:0},
		count:100,
		map:[],
		target:1,
		success:false,
		animtaion:{},
		x:0,
		init:function()
		{
			land.x = 0;
			land.map = [];
			land.success = false;	
			land.target = 1;	

			for(var n = 0; n < land.count; n++)
			{
				var rx = Math.abs(Math.floor(Math.random()*(width - (sling.limit.r*2) - sling.x - 100))+sling.limit.r);
				land.x += rx;		
				var ry = Math.floor(Math.random() * (height-165)+100);
				land.map.push(
					{
						x: land.x,
						y: height+100,
						dy: ry,
						sprite: {
							x: Math.floor((Math.random() * 8)),
							y: Math.floor((Math.random() * 5))
						}
					}
				)
			}	
			land.map[0].y = sling.y;	
			land.map[0].x = sling.x-32;
		},
		draw:function()
		{
			for(var n = 0; n < land.count; n++)
			{
				ctx.drawImage(
					assets.land, 
					land.map[n].sprite.x*92, 
					land.map[n].sprite.y*92, 
					92, 
					92, 
					land.map[n].x, 
					land.map[n].y, 
					65, 
					65
				);				
			}

			if(land.map[land.target].x > width - 65){land.map[land.target].x = width - 130;}
			if(land.map[land.target].y == height + 100){lava.drop(land.map[land.target].x+32,-((height-land.map[land.target].dy)*1.5))}
			if(land.map[land.target].y > land.map[land.target].dy)			
			{
				land.map[land.target].y-=(land.map[land.target].y-land.map[land.target].dy)/5;
			}
		},
		update:function()
		{
			var px = Math.round(player.x);
			var py = Math.round(player.y);
			var lx = Math.round(land.map[land.target].x-5);
			var ly = Math.round(land.map[land.target].y-10);
			var dx = Math.round(lx + 75);
			var dy = Math.round(ly + 40);
			
			/*
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.beginPath();
			ctx.fillRect(lx,ly,dx-lx,dy-ly);
			ctx.fill();	
			ctx.closePath();			
			*/

			if(px > lx && px < dx)
			{
				if(py > ly && py < dy)
				{
					land.success = true;
				}
			}

			land.draw();
		},
		next:function()
		{
			var dx = (sling.x-32);
			var step = (land.map[land.target].x-dx)/100;
			land.animation = setInterval(function(){
				player.x = land.map[land.target].x + 32;
				player.y = land.map[land.target].y;				
				if(land.map[land.target].x > dx)
				{
					for(var n = 0; n < land.count; n++)
					{
						land.map[n].x-=step;
					}
				}
				else
				{
					land.target++;			
					land.success = false;
					clearInterval(land.animation)
				}
			},1);
		}
	}

	/*
	**
	*/
	var player = {
		x:0,
		y:0,
		w:25,
		h:33,
		state:0,
		draw:function()
		{
			ctx.drawImage(
				assets.sprite, 
				player.state*260, 
				0, 
				260, 
				340, 
				player.x-(player.w/2), 
				player.y-(player.h/2), 
				player.w, 
				player.h
			);
		}
	}


	/*
	**
	*/
	var sling = {
		x:65,
		y:height-75,
		marker:{},
		player:{
			x:0,
			y:0,
			w:25,
			h:33,
			state:0
		},
		limit:{
			r:75
		},
		in:1,
		points:[],
		ready:false,
		init:function()
		{
			sling.marker = {
				r:1,
				x:sling.x,
				y:sling.y
			};

			player.x = sling.x;
			player.y = sling.y;	
			sling.ready = true;		
			player.draw();
		},
		draw:function()
		{
			/*
			** @description outer limit
			*/
		
			/*
			ctx.fillStyle = "rgba(0,0,0,0.1)";
			ctx.beginPath();				
			ctx.arc(sling.x, sling.y, (sling.limit.r/2), 0, Math.PI*2, true);
			ctx.fill();	
			ctx.closePath();
			*/

			/*
			** @description
			*/
			var mx = sling.marker.x;
			var my = sling.marker.y;
			var dx = (mx - sling.x);
			var dy = (my - sling.y);
			var dist = Math.round(Math.sqrt(dx*dx + dy*dy));

			/*
			ctx.beginPath();
			ctx.moveTo(sling.x, sling.y);
			ctx.lineTo(mx,my);
			ctx.stroke();		
			*/


			var ox = sling.x-dx;
			var oy = sling.y-dy;				

			if(dist > sling.limit.r)
			{
				var scale = -sling.limit.r/dist;
				var ox = dx * scale + sling.x;
				var oy = dy * scale + sling.y;					
			}

			/*
			** points 
			*/
			sling.power = dist > 50 ? 100 : dist*2;
			var x1 = ox;
			var x2 = Math.round((x1 - sling.x)*(Math.sqrt(sling.power))*2)+sling.x;
			var y1 = oy;
			var y2 = Math.round((y1 - sling.y)*(Math.sqrt(sling.power))*0.75)+sling.y;
			var dy2 = Math.round((y1 - sling.y)*(Math.sqrt(sling.power))*1.25)+sling.y;
			var y3 = height;
			sling.points = [
				{x:x1, y:y1},
				{x:x1, y:y2},
				{x:x2, y:y2},
				{x:x2, y:y3}
			];
					
			if(sling.in < 1){sling.particle();}
			if(player.state == 4){player.y = lava.springs[lava.seed].y + lava.springs[lava.seed].p;}

			if(sling.in >= 1 && pressed)
			{
				/*
				** hint
				*/
				ctx.beginPath();
				var alpha = ((50-(land.target * 10))/100)/2;
				if(alpha < 0){alpha = 0;}
				ctx.strokeStyle = "rgba(255,255,255," + alpha + ")";
				ctx.lineWidth = 10;			
				ctx.moveTo(x1,y1);
				ctx.bezierCurveTo(sling.points[0].x,sling.points[0].y,sling.points[0].x+((sling.points[2].x-sling.points[1].x)/2),(dy2),sling.points[3].x,sling.points[3].y);
				ctx.stroke();					
				/*
				**
				*/
				var p1 = {x: sling.x,y: sling.y};
				var p2 = {x: ox,y: oy};
				// angle in radians
				var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);

				// angle in degrees
				var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

				ctx.save();
				ctx.translate(sling.x, sling.y);
				ctx.rotate(angleRadians);
				var sx = 600-(sling.power*2);
				var sy = 0;
				var sw = 600-(sling.power*2);
				var sh = 110;
				var dx = (sling.power)-(600/4);
				var dy = -(110/4)/2;
				var dw = 600/4;
				var dh = 110/4;

				ctx.fillStyle = "rgba(0,0,0,1)";
				ctx.beginPath();
				ctx.moveTo(0, dy);
				ctx.lineTo(dw, dy);
				ctx.lineTo(dw, dy+dh);
				ctx.lineTo(0, dy+dh);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(assets.arrow, dx, dy, dw, dh);												
				ctx.restore();				
			}

			player.draw();			
		},
		particle:function()
		{
			sling.in+=0.025;
			var xy = getXY
			(
				{x:sling.points[0].x,y:sling.points[0].y},
				{x:sling.points[1].x+((sling.points[2].x-sling.points[1].x)/2),y:sling.points[1].y},
				{x:sling.points[1].x+((sling.points[2].x-sling.points[1].x)/2),y:sling.points[2].y},
				{x:sling.points[3].x,y:sling.points[3].y},
				sling.in
			);
			var px = xy.x;
			var py = xy.y;
			player.x = px;
			player.y = py;
			land.map[land.target-1].y+=(height-land.map[land.target-1].y)/10;
			if(sling.in > 1 || py > (height - 25) || land.success)
			{
				sling.in = 1;
				if(land.success)
				{
					player.state = 0;
					sling.y = land.map[land.target].y;
					sling.ready = true;
					land.next();

					drop.pause();
					drop.currentTime = 0;
					drop.play();						
				}
				else{
					lava.drop(px,sling.power*5)
					player.state = 4;					
					setTimeout(function(){
						sling.y = Math.floor(Math.random() * (height-165)+100);
						land.init();
						player.state = 0;	
						player.x = sling.x;
						player.y = sling.y;
						sling.ready = true;
						state = "gameover";

						crash.pause();
						crash.currentTime = 0;
						crash.play();							
					},2000)							
				}		
			}
			score.update(1);

		},
		shoot:function()
		{
			sling.in = 0;
			sling.ready = false;
		},
		update:function(x, y)
		{
			sling.marker.x = x;
			sling.marker.y = y;
		}
	}

	/*
	**
	*/
	var lava = {
		count:71,
		springs:[],
		d:0.005,
		t:0.05,
		y:0,
		dy:0,
		hit:false,
		seed:0,
		init:function()
		{
			lava.y = height-35;
			for(var n = 0; n < lava.count; n++)
			{
				lava.springs.push({
					x:((width/lava.count)*n),
					y:lava.y,
					w:(((width/lava.count)*scale[0])*2),
					p:0,
					v:0,
					step:0,
					update:function(d, t){
						this.v += (-(t * this.p) - (d * this.v));
            this.p += this.v;

            if(lava.y != this.y && this.step < 20)
            {
            	lava.y < this.y ? this.y-=lava.dy : this.y+=lava.dy;
            	this.step++;
            }

            if(this.step == 20)
            {
            	this.y = lava.y;
            	this.step = 0;
            }
					}
				});
			}
		},
		draw:function()
		{
			for(var n = 0; n < lava.count; n++)
			{
				var p = lava.springs[n];
				if(n%2==0)
				{
					
					ctx.beginPath();
				
					ctx.fillStyle = "rgba(255,53,0,0.75)";
					ctx.fillRect((p.x),p.y+p.p,p.w,height);					

					ctx.fillStyle = "rgba(0,0,0,0.05)";
					ctx.fillRect((p.x),p.y+p.p,p.w,20);

					ctx.fillStyle = "rgba(0,0,0,0.05)";
					ctx.fillRect((p.x),p.y+p.p,p.w,10);

					ctx.fillStyle = "rgba(0,0,0,0.05)";
					ctx.fillRect((p.x),p.y+p.p,p.w,5);

					ctx.fill();	
					ctx.closePath();
					
					//ctx.drawImage(assets.lava, p.x, p.y+p.p, p.w, height);
				}
			}			
		},
		update:function(spread)
		{
			for(var n = 0; n < lava.count; n++)
			{
				lava.springs[n].update(lava.d, lava.t);
			}			

			var left = [];
			var right = [];

			for (var t = 0; t < 8; t++)
			{
				for(var i = 0; i < lava.count; i++)
				{
					if(i > 0)
					{
						left[i] = spread * (lava.springs[i].p - lava.springs[i - 1].p);
          	lava.springs[i - 1].v += left[i];
					}
					if(i < lava.count - 1)
					{
						right[i] = spread * (lava.springs[i].p - lava.springs[i + 1].p);
          	lava.springs[i + 1].v += right[i]; 
					}
				}

				for(var i = 0; i < lava.count; i++)
				{
					if(i > 0)
					{
          	lava.springs[i - 1].p += left[i];
					}
					if(i < lava.count - 1)
					{
          	lava.springs[i + 1].p += right[i]; 
					}
				}			
			}		

			lava.draw();
		},
		reset:function()
		{
			lava.hit = false;
			var dy = Math.floor(Math.random()*height/2)+(height/4);
			lava.dy = Math.floor(Math.abs(lava.y - dy))/20;				
			lava.y = dy;

			return dy;
		},
		drop:function(x, m)
		{
			var seed = Math.floor(x/(width/lava.count));
			if(seed%2 != 0){seed+=1;}
			if(seed > 70){seed = 70;}
			if(seed < 0){seed = 0;}
			var mass = !m ? 10 : m;
			lava.seed = seed;
			game.lava.springs[seed].p = mass;

			splash.pause();
			splash.currentTime = 0;
			splash.play();				
		}
	}	

	/*
	** @method gameover
	** @description 
	*/
	function gameover()
	{
		var y = 145;
		ctx.fillStyle = colors.white;
		ctx.font = bit.medium;
		ctx.textAlign = "left";
		ctx.fillText("last score", 30, y);	
		ctx.textAlign = "right";
		ctx.fillText("best score", width-30, y);				
		y+=30;
		ctx.font = bit.large;
		ctx.textAlign = "left";
		ctx.fillText(score.current, 30, y);	
		ctx.textAlign = "right";
		ctx.fillText(score.best, width-30, y);		

		/*
		** @description draw twitter share
		*/
		//share();		
	}	

	/*
	** @method share
	** @description 
	*/
	function share()
	{
			var st = "tweet score";

			ctx.fillStyle = colors.white;
			ctx.beginPath();
			ctx.fillRect(sx,sy,24,24);
			ctx.fill();	
			ctx.closePath();

			ctx.fillStyle = colors.white;
			ctx.beginPath();
			ctx.fillRect(sx + 6,sy + 7,6,12);
			ctx.fillRect(sx + 7,sy + 5,4,14);
			ctx.fillRect(sx + 10,sy + 8,6,11);
			ctx.fillRect(sx + 6,sy + 9,12,4);		
			ctx.fillRect(sx + 6,sy + 14,12,4);
			ctx.fill();	
			ctx.closePath();

			ctx.fillStyle = colors.black;
			ctx.beginPath();
			ctx.fillRect(sx + 7,sy + 6,4,11);
			ctx.fillRect(sx + 7,sy + 9,10,4);
			ctx.fillRect(sx + 7,sy + 14,10,4);
			ctx.fill();	
			ctx.closePath();	

			ctx.textAlign = "left";
			ctx.fillStyle = colors.white;
			ctx.font = bit.medium;
			ctx.fillText(st, sx + 35, sy + 20);		
	}		

	/*
	** @method sound
	** @description 
	*/
	function sound()
	{
		var src = bgsound ? assets.bgsound_on : assets.bgsound_off ;
		ctx.drawImage(src, width - 20, 5, 14, 20);
	}	

	/*
	** @method score
	** @description 
	*/
	var score = {
		current:0,
		best:0,
		size:"medium",
		position:[],
		cardinals:{
			TOP_LEFT:[10,20, "left"],
			TOP_RIGHT:[width-10, 20, "right"],
			BOTTOM_LEFT:[10,height-10, "left"],
			BOTTOM_RIGHT:[width-10, height-10, "right"]		
		},
		init:function(pos)
		{
			score.position = score.cardinals[pos];
			score.current = 0;
		},
		draw:function()
		{
			ctx.textAlign = score.position[2];
			ctx.font = bit[score.size];
			ctx.fillStyle = colors.white;
			ctx.fillText(score.current, score.position[0], score.position[1]);			
		},
		update:function(p)
		{			
			score.current += p;
			if(score.current > score.best)
			{
				score.best = score.current;
			}
			score.draw();
		}
	}	

	/*
	** @method controls
	** @param evt {event}
	** @description this is the 
	*/	
	function controls(evt)
	{
		px = evt.pageX - evt.target.offsetLeft;
		py = evt.pageY - evt.target.offsetTop;
		switch(evt.type)
		{
			case "mouseup":
			case "touchend":	
				switch(state)
				{
					case "play":
						if(pressed && sling.ready)
						{
							pressed = false;
							//sling.update(sling.x,sling.y);
							player.state = 2;
							sling.shoot();	
						}		
					break;
				}
			break;	
			case "mousedown":
			case "touchstart":
				switch(state)
				{
					case "play":
						if(sling.ready)
						{
							player.x = sling.x;
							player.y = sling.y;
							var dx = px/scale[0] - sling.x;
							var dy = py/scale[1] - sling.y;
							var dist = Math.sqrt(dx*dx + dy*dy);
							if (dist < sling.limit.r) {
								pressed = true;
								player.state = 1;
							}
						}					
					break;
				}
				/*
				** sound control
				*/
				if(px/scale[0] > (width-20) && px/scale[0] < width)
				{
					if(py/scale[1] > 5 && py/scale[1] < 45)
					{
						bgsound = !bgsound;
						bgsound ? music.play() : music.pause();
						return false;
					}
				}				

				/*
				** click sound
				*/
				switch(state)
				{
					case "intro":
					case "instructions":
					case "gameover":
					case "ad":
						music.play();
						click.pause();
						click.currentTime = 0;
						click.play();	
					break;	
				}			

				/*
				** game state
				*/
				switch(state)
				{
					case "intro":
						state = "instructions";
					break;
					case "instructions":
						state = "play";
					break;					
					case "play":	
						//state = "gameover";
					break;
					case "gameover":
						/*
						** @description twitter post
						*/
						/*
						if(px/scale[0] > sx && px/scale[0] < (sx+173))
						{
							if(py/scale[1] > sy-10 && py/scale[1] < sy+44)
							{
								social.post('twitter', score.current);
								return false;
							}
						}	
						*/
						/*
						** @description serve ad
						*/											
						if(games_played == show_ad_after_games)
						{
							state = "ad";							
							if(!rated)
							{
            		if(typeof AppRate != "undefined"){AppRate.promptForRating(true);}
            		rated = true;								
							}
							ads.banner();
						}
						/*
						** @description continue playing
						*/						
						else
						{
							score.current = 0;
							state = "play";
						}
						/*
						** @description incriment games played
						*/						
						games_played++;
					break;
					case "ad":
						/*
						** @description destroy banner
						*/
						ads.destroy();
						/*
						** @description reset game stuff
						*/
						score.current = 0;
						games_played = 0;						
						state = "play";
					break;				
				}
			break;
			case "mousemove":
			case "touchmove":
				/*
				** game state
				*/
				switch(state)
				{
					case "play":
						if(pressed)
						{		
							//sling.update(px/scale[0],py/scale[1]);
							sling.update(px,py);
						}					
					break;
				}			
			break;			
		}	
	}	

	/*
	** @method loop {iife}
	** @description this is the 
	*/	
	(function loop(){
		toggle = toggle ? false : true;
		if(toggle)
		{
			requestAnimationFrame(loop);
			return;
		}
		if(ready && !pause){draw();}
		requestAnimationFrame(loop);
	})();

	return {
		init:function(){init();},
		controls:function(evt){controls(evt);},
		lava:lava
	}	
})();

// cubic bezier percent is 0-1
function getXY(startPt, controlPt1, controlPt2, endPt, percent) {
    var x = Cubic(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    var y = Cubic(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({
        x: x,
        y: y
    });
}

// cubic helper formula at percent distance
function Cubic(pct, a, b, c, d) {
    var t2 = pct * pct;
    var t3 = t2 * pct;
    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
}

/*
** @description this is for debugging in the browser
*/
if(
	window.navigator.userAgent.indexOf("Firefox") != -1 || 
	window.navigator.userAgent.indexOf("Chrome") != -1
)
{
	game.init();
}