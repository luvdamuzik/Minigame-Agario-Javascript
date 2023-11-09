const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const start_button = document.querySelector('#start_button');
const end_screen = document.querySelector('#end_screen');
const end_screen_title = document.querySelector('#end_screen_title');
const main_menu = document.querySelector('#main_menu');
const new_game = document.querySelector('#new_game');
const tezina = document.querySelector('#tezina');
const laksi = document.querySelector('#laksi');
const srednji = document.querySelector('#srednji');
const teski = document.querySelector('#teski');
const vrati_na_main = document.querySelector('#vrati_na_main');


canvas.width = innerWidth;
canvas.height = innerHeight;

const game_width = canvas.width;
const game_height = canvas.height;

let nivo;
laski.addEventListener("click",(event)=>{
	nivo = 0;
	console.info(nivoi[nivo]);
	init();
	animate();
	spawn_ostali();
	spawn_specijalni();
	main_menu.style.display = 'none';
})
srednji.addEventListener("click",(event)=>{
	nivo = 1;
	console.info(nivoi[nivo]);
	init();
	animate();
	spawn_ostali();
	spawn_specijalni();
	main_menu.style.display = 'none';
})
teski.addEventListener("click",(event)=>{
	nivo = 2;
	console.info(nivoi[nivo]);
	init();
	animate();
	spawn_ostali();
	spawn_specijalni();
	main_menu.style.display = 'none';
})

//prva je brzina glavnog,druga brzina ostalih,treca je frikvencija ostalih
const nivoi = [
[3,1,1000],[3,3,500],[4,5,200]
];

class Glavni{
	constructor(x,y,radius,color){
		this.x = x;
		this.y = y;

		this.radius = radius;
		this.color = color;

		this.moving = false;
	}

	draw(){
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update(){
		const x = mouseX-this.x;
		const y = mouseY-this.y;
		const angle = Math.atan2(y,x);
		const velocityX = Math.cos(angle)*nivoi[nivo][0];
		const velocityY = Math.sin(angle)*nivoi[nivo][0];
		const distance = Math.sqrt(x*x + y*y);
		if(distance>1){
			this.x = this.x + velocityX;
			this.y = this.y + velocityY;
		}	
	}
}

class Ostali{
	constructor(x,y,radius,color){
		this.x = x;
		this.y = y;

		this.radius = radius;
		this.color = color;

		let moveX = game_width*Math.random()-this.x;
		let moveY = game_height*Math.random()-this.y;
		let angle = Math.atan2(moveY,moveX);
		this.velocityX = Math.cos(angle)*nivoi[nivo][1];
		this.velocityY = Math.sin(angle)*nivoi[nivo][1];
	}

	draw(){
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update(){
		this.x = this.x + this.velocityX;
		this.y = this.y + this.velocityY;	
	}
}

class Specijalni{
	constructor(x,y,radius,color){
		this.x = x;
		this.y = y;

		this.radius = radius;
		this.color = color;
		this.power_up = Math.floor(Math.random() * (4 - 1 + 1) + 1);

		const moveX = game_width*Math.random()-this.x;
		const moveY = game_height*Math.random()-this.y;
		const angle = Math.atan2(moveY,moveX);
		this.velocityX = Math.cos(angle);
		this.velocityY = Math.sin(angle);
	}

	draw(){
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update(){
		this.x = this.x + this.velocityX;
		this.y = this.y + this.velocityY;	
	}
}

let glavni = new Glavni(game_width/2,game_height/2,30,'blue');
let ostale = [];
let specijalne = [];
var mouseX,mouseY;

function init(){
	glavni = new Glavni(game_width/2,game_height/2,30,'blue');
	mouseX = game_width/2;
	mouseY = game_height/2;
	ostale = [];
	specijalne = [];
}

let spawn_ostali_id;
let spawn_specijalni_id;

function spawn_ostali(){
	spawn_ostali_id=setInterval(()=>{
		if(glavni.moving){
			const radius = Math.random()*((glavni.radius+10)-(glavni.radius-10)) + glavni.radius-10;
			let x,y;
			if(Math.random()<0.5){
				x = Math.random()<0.5 ? 0-radius : game_width+radius;
				y = Math.random() * game_height;
			}else{
				x = Math.random() * game_width;
				y = Math.random()<0.5 ? 0-radius : game_height+radius;
			}
			ostale.push(new Ostali(x,y,radius,'black'));
			console.info(ostale.length);
		}
	},nivoi[nivo][2])
}

function spawn_specijalni(){
	spawn_specijalni_id=setInterval(()=>{
		if(glavni.moving){
			const radius = 15;
			let x,y;
			if(Math.random()<0.5){
				x = Math.random()<0.5 ? 0-radius : game_width+radius;
				y = Math.random() * game_height;
			}else{
				x = Math.random() * game_width;
				y = Math.random()<0.5 ? 0-radius : game_height+radius;
			}
			specijalne.push(new Specijalni(x,y,radius,'red'));
		}
	},10000)
}

let animationID;
function animate(){
	animationID = requestAnimationFrame(animate);
	ctx.fillStyle = 'rgba(255,255,255)'
	ctx.fillRect(0,0,canvas.width,canvas.height);
	glavni.update();
	glavni.draw();

	ostale.forEach((ostali,index)=>{
		ostali.draw();
		ostali.update();
		const duzina = Math.hypot(glavni.x - ostali.x,glavni.y - ostali.y);
		if(duzina - glavni.radius - ostali.radius <1 && glavni.radius>ostali.radius){
			glavni.radius += ostali.radius*5/100;
			setTimeout(()=>{
				ostale.splice(index,1);
			},0)
		}
		if(duzina - glavni.radius - ostali.radius <1 && glavni.radius<ostali.radius){
			cancelAnimationFrame(animationID);
			glavni.moving = false;
			clearInterval(spawn_ostali_id);
			clearInterval(spawn_specijalni_id);
			end_screen.style.display = 'flex';
			end_screen_title.innerHTML = "Izgubili ste";
		}
		if(ostali.x + ostali.radius < 0 || 
			ostali.x - ostali.radius > game_width ||
			ostali.y + ostali.radius < 0 || 
			ostali.y - ostali.radius > game_height
			){
			setTimeout(()=>{
				ostale.splice(index,1);
			},0)
		}
	})
	specijalne.forEach((specijalni,index)=>{
		specijalni.draw();
		specijalni.update();
		const duzina = Math.hypot(glavni.x - specijalni.x,glavni.y - specijalni.y);
		if(duzina - glavni.radius - specijalni.radius <1){
			if(specijalni.power_up === 1){
				let vrijeme = Math.round(Math.floor(Math.random() * (5000 - 1000 + 1000) + 1000)/1000)*1000;
				ostale.forEach((ostali,index)=>{
					ostali.velocityY *= 2;
					ostali.velocityX *= 2;
					setTimeout(()=>{
						ostali.velocityY /= 2;
						ostali.velocityX /= 2;
					},vrijeme)
				})
			}else if(specijalni.power_up === 2){
				glavni.radius *= 2;
			}else if(specijalni.power_up === 3){
				glavni.radius = Math.floor(glavni.radius/2);
			}else if(specijalni.power_up === 4){
				ostale.forEach((ostali,index)=>{
					ostali.moveX = game_width*Math.random()-ostali.x;
					ostali.moveY = game_height*Math.random()-ostali.y;
					ostali.angle = Math.atan2(ostali.moveY,ostali.moveX);
					ostali.velocityX = Math.cos(ostali.angle);
					ostali.velocityY = Math.sin(ostali.angle);
				})
			}
			setTimeout(()=>{
				specijalne.splice(index,1);
			},0)
		}
		if(specijalni.x + specijalni.radius < 0 || 
			specijalni.x - specijalni.radius > game_width ||
			specijalni.y + specijalni.radius < 0 || 
			specijalni.y - specijalni.radius > game_height
			){
			setTimeout(()=>{
				specijalne.splice(index,1);
			},0)
		}
	})
	if(glavni.radius > 200) {
		cancelAnimationFrame(animationID);
			glavni.moving = false;
			clearInterval(spawn_ostali_id);
			clearInterval(spawn_specijalni_id);
			end_screen.style.display = 'flex';
			end_screen_title.innerHTML = "Pobjedili ste";
	}
}


canvas.addEventListener("mousemove",(event)=>{
		mouseX=event.clientX;
		mouseY=event.clientY;
		glavni.moving = true;
});

start_button.addEventListener("click",(event)=>{
	init();
	animate();
	spawn_ostali();
	spawn_specijalni();
	end_screen.style.display = 'none';
	main_menu.style.display = 'none';

});

vrati_na_main.addEventListener("click",(event)=>{
	end_screen.style.display = 'none';
	main_menu.style.display = 'flex';
	tezina.style.display = 'none';
})

new_game.addEventListener("click",(event)=>{
	tezina.style.display = 'block';
})

function togglePopup(broj){
	document.getElementById("popup-"+ broj).classList.toggle("active");
}
