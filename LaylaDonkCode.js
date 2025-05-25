const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");


var unitSize = Math.round(canvas.height/100);
var moneySize = Math.round(canvas.height/10);
var walletSize = Math.round(moneySize*1.5);
var halfx = Math.round(canvas.width/2);
var halfy = Math.round(canvas.height/2);

Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 0 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
var moneySpent = 0;

var mousex = halfx;
var mousey = halfy;

const assets = [
    { name: "money", emoji: "💩" },
    { name: "wallet-front", emoji: "🚽" },
    { name: "wallet-back", emoji: "🚽" },
    { name: "red", emoji: "🦀" },
    { name: "macbook", emoji: "🏀" },
    { name: "iphone", emoji: "🧻" },
    { name: "curling", emoji: "🥌" },
    { name: "soccer", emoji: "⚽" },
    { name: "pizza", emoji: "🍕" },
    { name: "latte", emoji: "☕" },
    { name: "plane", emoji: "✈️" },
    { name: "piggy", emoji: "🐷" },
    { name: "tennis", emoji: "🎾" },
];

function resize () {
    canvas.width = window.innerWidth*window.devicePixelRatio;
    canvas.height = window.innerHeight*window.devicePixelRatio;
    
    unitSize = Math.round(canvas.height/100);
    moneySize = Math.round(canvas.height/15);
    walletSize = Math.round(moneySize*1.5);
    halfx = Math.round(canvas.width/2);
    halfy = Math.round(canvas.height/2);
}
window.addEventListener("resize", resize);




const get_angle_helper = 180/Math.PI;
function get_angle(arg1, arg2) {
    var angleRadians = Math.atan2(arg2.y - arg1.y, arg2.x - arg1.x);
    return angleRadians*get_angle_helper+180;
}

function draw_image(x, y, width, height, image, centered) {
    if (typeof(centered) === "undefined") centered = false;
    context.font = `${height}px serif`;
    context.textAlign = centered ? "center" : "left";
    context.textBaseline = centered ? "middle" : "top";
    context.fillText(assets[image].emoji, centered ? x : x, centered ? y : y);
}

function draw_rotated_image(x, y, width, height, image, degrees) {
    context.save();
    context.translate(x, y);
    context.rotate(degrees * Math.PI / 180);
    context.font = `${height}px serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(assets[image].emoji, 0, 0);
    context.restore();
}
function draw_loading () {
    context.fillStyle = "#fff";
    context.font = canvas.width/10+"px sans-serif";
    context.fillText("loading...", canvas.width/2,canvas.height/2);
}

var loose_money = [];

loose_money.create = function (x = mousex, y = mousey, size = unitSize*5, speed = unitSize, life = 0.3, range = [-45, 220]) {
    moneySpent++;
    var direction = Math.floor(Math.random()*(360) - range[0]);
    loose_money.push({
        x: x,
        y: y,
        vx: (Math.random()*2-1)*speed,
        vy: (Math.random()*2-1)*speed,
        size: size,
        size2: size*2,
        life: life,
    });
}
loose_money.tick = function () {
    for (var i = loose_money.length-1; i >= 0; i--) {
        loose_money[i].x+=loose_money[i].vx;
        loose_money[i].y+=loose_money[i].vy;
        loose_money[i].vy += 0.2;
        loose_money[i].size-=1*loose_money[i].life;
        loose_money[i].size2-=2*loose_money[i].life;
        if (loose_money[i].x > canvas.width ||
            loose_money[i].x < -loose_money[i].size ||
            loose_money[i].y > canvas.height ||
            loose_money[i].y < -loose_money[i].size ||
            loose_money[i].size <= 0) {

            loose_money.splice(i, 1);
        } else {
            var direction = 57.2958*Math.atan2(loose_money[i].vy, loose_money[i].vx) + 90;
            draw_rotated_image(loose_money[i].x, loose_money[i].y, loose_money[i].size2, loose_money[i].size2, 0, direction);
        }
    }
}

obsticals = [];
obsticalAssets = [3,4];
obsticalIndex = [
    {
        name: "iphone",
        cost: 1000,
        accuracy: 40,
        speed: 1,
        speedVariance: 0,
        particles: 5,
        asset: 5,
        chances: 80,
    },
    {
        name: "macbook",
        cost: 5000,
        accuracy: 20,
        speed: 2,
        speedVariance: 0,
        particles: 15,
        asset: 4,
        chances: 50,
    },
    {
        name: "red",
        cost: 100000,
        accuracy: 0,
        speed: 2,
        speedVariance: 5,
        particles: 400,
        asset: 3,
        chances: 10
    },
    {
        name: "curling",
        cost: 500,
        accuracy: 0,
        speed: 3,
        speedVariance: 10,
        particles: 150,
        asset: 6,
        chances: 2
    },
    {
        name: 'soccer',
        cost: 1000,
        accuracy: 40,
        speed: 1,
        speedVariance: 0,
        particles: 15,
        asset: 7,
        chances: 15,
    },
    {
        name: 'pizza',
        cost: 12000,
        accuracy: 10,
        speed: 1,
        speedVariance: 0,
        particles: 200,
        asset: 8,
        chances: 9,
    },
    {
        name: 'latte',
        cost: 13000,
        accuracy: 20,
        speed: 2,
        speedVariance: 10,
        particles: 500,
        asset: 9,
        chances: 3,
    },
    {
        name: 'plane',
        cost: 13000,
        accuracy: 20,
        speed: 2,
        speedVariance: 10,
        particles: 500,
        asset: 10,
        chances: 3,
    },
    {
        name: 'piggy',
        cost: 123000,
        accuracy: 20,
        speed: 2,
        speedVariance: 10,
        particles: 500,
        asset: 11,
        chances: 3,
    },
    {
        name: 'tennis',
        cost: 1000,
        accuracy: 38,
        speed: 1,
        speedVariance: 3,
        particles: 15,
        asset: 12,
        chances: 15,
    },

];
var obsticalRandom = [];

for (let index = 0; index < obsticalIndex.length; index++) {
    const element = obsticalIndex[index];
    for (let i = 0; i < element.chances; i++) {
        obsticalRandom.push(index);
    }
}

obsticals.create = function (x,y, size, speed, life = 0.3, range = [-45, 220]) {
    var obstical = obsticalIndex[obsticalRandom[Math.floor(Math.random()*obsticalRandom.length)]];

    var randX = 0;
    if (Math.random() >= 0.5) randX = canvas.width;
    var randY = Math.random()*canvas.height;

    if (canvas.height > canvas.width) {
        randY = 0;
        randX = Math.random()*canvas.width;
    }

    var direction = get_angle({x: randX, y: randY}, {x: x, y: y});
    
    direction += Math.floor(Math.random()*obstical.accuracy)-obstical.accuracy/2;

    speed = speed*obstical.speed + (Math.random()*unitSize - unitSize/2);

    obsticals.push({
        x: randX,
        y: randY,
        vx: -(speed)*Math.cos((direction/180)*Math.PI),
        vy: -(speed)*Math.sin((direction/180)*Math.PI),
        size: size,
        size2: size*2,
        life: life,
        costy: obstical.asset,
        cost: obstical.cost,
        particles: obstical.particles,
    });
}
obsticals.tick = function () {
    for (var i = obsticals.length-1; i >= 0; i--) {
        obsticals[i].x+=obsticals[i].vx;
        obsticals[i].y+=obsticals[i].vy;
        if (obsticals[i].x > canvas.width ||
            obsticals[i].x < -obsticals[i].size ||
            obsticals[i].y > canvas.height ||
            obsticals[i].y < -obsticals[i].size ||
            obsticals[i].size <= 0) {

            obsticals.splice(i, 1);
        } else if (
            obsticals[i].x < mousex+unitSize*10 &&
            obsticals[i].x > mousex-unitSize*10 &&
            obsticals[i].y < mousey+unitSize*10 &&
            obsticals[i].y > mousey-unitSize*10 
            ) {
            moneySpent += obsticals[i].cost;
            for (let index = 0; index < obsticals[i].particles; index++) {
                loose_money.create(mousex, mousey, unitSize*5, unitSize*2);
            }
            obsticals.splice(i, 1);
        } else {
            draw_image(obsticals[i].x, obsticals[i].y, obsticals[i].size2, obsticals[i].size2, obsticals[i].costy, true);
        }
    }
}

var create_money = false;
var money_tick = 0;
function draw_game () {
    context.font = unitSize*5+"px monospace";
    context.fillStyle = "#fff";
    context.fillText(""+moneySpent.formatMoney()+" DONKED", 600, unitSize*15);

    draw_image(mousex,mousey,walletSize,walletSize,2,true);
    draw_image(mousex,mousey-unitSize*5,moneySize,moneySize,0,true);
    loose_money.tick();
    obsticals.tick();
    draw_image(mousex,mousey,walletSize,walletSize,1,true);

    if (create_money && money_tick === 0) {
        loose_money.create(mousex, mousey, unitSize*5, unitSize/2);
        create_money = false;
    }
    money_tick++;
    if (money_tick > 3) money_tick = 0;

    if (createObstical || Math.random() > 0.99) {
        obsticals.create(mousex, mousey, unitSize*6, unitSize);
        createObstical = false;
    }

    if (leakMoney) {
        loose_money.create(mousex, mousey, unitSize*5, unitSize);
        leakMoney = false;
    }
}

window.addEventListener("mousemove", function (e){
    mousex = e.clientX*window.devicePixelRatio;
    mousey = e.clientY*window.devicePixelRatio;
    create_money = true;
    e.preventDefault();
});
window.addEventListener("touchmove", function (e){
    mousex = e.targetTouches[e.targetTouches.length-1].clientX*window.devicePixelRatio;
    mousey = e.targetTouches[e.targetTouches.length-1].clientY*window.devicePixelRatio;
    create_money = true;

    if (e.scale != undefined && e.scale !== 1) { e.preventDefault(); }
    return false;
}, false);

var lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

var leakMoney = false;
var createObstical = false;
function draw () {
    context.clearRect(0,0,canvas.width, canvas.height);
    
    draw_game();
    window.requestAnimationFrame(draw);
}

window.addEventListener("load", function () {
    document.body.textContent = "";
    document.body.appendChild(canvas);
    resize();
    //load_assets();
    draw();
    window.scrollTo(0,1);
    window.requestAnimationFrame(function () {
        window.scrollTo(0,1);
    })

    setInterval(function () {
        leakMoney = true;
    }, 1750);
    setInterval(function () {
        createObstical = true;
    }, 1100)
})