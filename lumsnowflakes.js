// lumSnowFlakes
// Lum.ru
// 25 Dec 2015
// based on http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect by thecodeplayer
function lumSnowFlakes()
	{
		function createCanvasOverlay()
		{
			myCanvas = document.createElement('canvas');
			myCanvas.setAttribute("id", "canvas");
			document.body.appendChild(myCanvas);
			myCanvas.style.position = 'fixed';
			myCanvas.style.left="0px";
			myCanvas.style.top="0px";
			myCanvas.style.zIndex="100";
			myCanvas.style.width="100%";
			myCanvas.style.height="100%";
			myCanvas.width=myCanvas.offsetWidth;
			myCanvas.height=myCanvas.offsetHeight;
			myCanvas.style.pointerEvents = "none";
		}
		createCanvasOverlay();
		//canvas init
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		
		//canvas dimensions
		var W = window.innerWidth;
		var H = window.innerHeight;
		//var W = 500;
		//var H = 500;
		canvas.width = W;
		canvas.height = H;
		
		//snowflake particles
		var mp = 25; //max particles
		var particles = [];
		for(var i = 0; i < mp; i++)
		{
			var tempx = Math.random()*W;
			var tempy = Math.random()*H;
			particles.push({
				x: tempx, //x-coordinate
				y: tempy, //y-coordinate
				r: parseInt(Math.random()*4+1), //radius
				d: Math.random()*1000, //density
				ex: tempx, //x-coordinate
				ey: tempy, //y-coordinate
				leave: false, //y-coordinate
				opacity: Math.random(), //opacity
			})
		}
		
		//Lets draw the flakes
		function draw()
		{
			ctx.fillStyle = "rgba(255, 255, 255, 1)";
			for(var i = 0; i < mp; i++)
			{
				var p = particles[i];
				ctx.beginPath();
				if (!p.leave){
					ctx.clearRect(p.ex-p.r-1, p.ey-p.r-1, p.r*2+2, p.r*2+2);
				}
				ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
				ctx.fill();
			}
			update();
		}
		
		var angle = 0;
		function update()
		{
			function leaveparticle()
			{
				var tempx = Math.random()*W;
				particles[i] = {x: tempx, y: -10, r: p.r, d: p.d, ex: tempx, ey: -10, leave: false, opacity: Math.random()};
				p.leave=true;
				ctx.fillStyle = "rgba(250, 250, 250, 1)";
				ctx.beginPath();
				ctx.arc(p.x, p.y+2, p.r+2, 0, Math.PI*2, false);
				ctx.fill();
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
			}
			
			angle += 0.01;
			for(var i = 0; i < mp; i++)
			{
				var p = particles[i];
				
				p.ex = p.x;
				p.ey = p.y;
				p.x += Math.sin(angle) * 2;
				p.y += Math.cos(angle+p.d) + 1 + p.r/2;
				
				if(p.y > H)
				{
					leaveparticle();
				}
				
				probe_pixel = ctx.getImageData(parseInt(p.x), parseInt(p.y+p.r), 1, 1).data;
				if ((probe_pixel[0] == 250) && (probe_pixel[1] == 250) && (probe_pixel[2] == 250))
				{
					leaveparticle();
				}
			}
		}
		
		function refill()
		{
			var imageData = ctx.getImageData(0, 0, W, H);
			var data = imageData.data;
			var passStep = false;
			
			for(var i = 0; i < data.length; i += 4) {
				if (!passStep)
				{
					if ((data[i]==250) && (data[i + 1]==250) && (data[i + 2]=250))
					{
						if(Math.random()>0.75)
						{
							data[i-4]=250;
							data[i-3]=250;
							data[i-2]=250;
							data[i-1]=255;
							
							data[i+W*4]=250;
							data[i+1+W*4]=250;
							data[i+2+W*4]=250;
							data[i+3+W*4]=255;
							
						}
						if(Math.random()>0.75)
						{
							passStep=true;
							data[i+4]=250;
							data[i+5]=250;
							data[i+6]=250;
							data[i+7]=255;
							
							data[i+W*4]=250;
							data[i+1+W*4]=250;
							data[i+2+W*4]=250;
							data[i+3+W*4]=255;
						}
					}
				}
				else
				{
				passStep=false;
				}
			}
			 // overwrite original image
			ctx.putImageData(imageData, 0, 0);
		}
		
		
		//animation loop
		setInterval(draw, 33);
		setInterval(refill, 500);
	}