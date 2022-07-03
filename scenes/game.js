const BULLET_SPEED = 480;
const SPEED = 100;
const ENEMY_SPEED = 50;
const MEDKIT_AMT = 2;
const MAX_ENEMY_COUNT = 75;

let score = 0;
let keys = {};
let rotation = 0;
let reload = 0;
let enemyCount = 0;
let stillRunning = true;
let powerups = {
	medkit: 0,
	bomb: 0
};

layers([
	"bg",
	"explode",
	"fg",
	"gun",
	"ui",
	"trans"
]);


// background
add([
	sprite("background"),
	origin("topleft"),
	scale(width() / 100, height() / 100),
	layer("bg")
]);

const scoreText = add([
	text("SCORE: 0", 10),
	pos(vec2(5, 5)),
	color(0, 0, 0),
	origin("topleft"),
	layer("ui")
])


// player
const cookie = add([
	sprite("cookie"),
	pos(width() / 2, height() / 2),
	rotate(0),
	layer("fg"),
	healthBar(10),
	area(vec2(-20, -20), vec2(20, 20)),
	"player"
]);

drawHealth(cookie);

cookie.action(() => {
	rotation = cookie.angle = -mousePos().angle(cookie.pos);
	if (reload > 0) reload--;
});

cookie.action(() => {
	if (keys["left"]) cookie.move(vec2(-SPEED, 0));
	if (keys["right"]) cookie.move(vec2(SPEED, 0));
	if (keys["up"]) cookie.move(vec2(0, -SPEED));
	if (keys["down"]) cookie.move(vec2(0, SPEED));

	cookie.pos.x = cookie.pos.x < cookie.width / 2 ? cookie.width / 2 : cookie.pos.x > width() - cookie.width / 2 ? width() - cookie.width / 2 : cookie.pos.x;
	cookie.pos.y = cookie.pos.y < cookie.height / 2 ? cookie.height / 2 : cookie.pos.y > height() - cookie.height / 2 ? height() - cookie.height / 2 : cookie.pos.y;
});


// gun
const gun = add([
	sprite("gun"),
	scale(2),
	pos(0, 0),
	layer("gun")
]);

gun.action(() => {
	gun.angle = cookie.angle;
	gun.pos = cookie.pos.add(vec2(cookie.width * Math.cos(-cookie.angle), cookie.height * Math.sin(-cookie.angle)));
});


// bullets
function addBullet(position, angle) {
	add([
		sprite("bullet"),
		pos(position.add(vec2(
			cookie.width * Math.cos(-angle),
			cookie.height * Math.sin(-angle)
		))),
		layer("fg"),
		rotate(angle),
		{ life: 3 },
		"bullet"
	]);
}

action("bullet", b => {
	b.move(vec2(Math.cos(-b.angle), Math.sin(-b.angle)).scale(BULLET_SPEED));

	if (
		b.pos.x > width() + b.width || b.pos.x < -b.width ||
		b.pos.y > height() + b.height || b.pos.y < -b.height
	) destroy(b);
});


// enemy
function addEnemy(isGod = false) {
	if (!stillRunning) return;
	if (enemyCount > MAX_ENEMY_COUNT) return;

	let instance;
	/**
	 * 0-250     | normal
	 * 250-1000  | velvet
	 * 1000-1750 | velvet+mutate
	 * 1750-2000 | velvet+super
	 * 2000+     | velvet+super+god
	 */
	if (score < 250) {
		instance = add([
			sprite("oreo"),
			pos(vec2(-100, -100)),
			layer("fg"),
			healthBar(Math.floor(rand(1, 12))),
			area(vec2(-12, -25), vec2(12, 8)),
			"enemy"
		]);
	} else if (score < 1000) {
		instance = add([
			sprite("oreo2"),
			pos(vec2(-100, -100)),
			layer("fg"),
			healthBar(Math.floor(rand(4, 15))),
			area(vec2(-12, -25), vec2(12, 8)),
			"enemy"
		]);
	} else if (score < 1750) {
		if (chance(0.5))
			instance = add([
				sprite("oreo2"),
				pos(vec2(-100, -100)),
				layer("fg"),
				healthBar(Math.floor(rand(4, 15))),
				area(vec2(-12, -25), vec2(12, 8)),
				"enemy"
			]);
		else
			instance = add([
				sprite("oreo3"),
				pos(vec2(-100, -100)),
				layer("fg"),
				healthBar(Math.floor(rand(8, 19))),
				area(vec2(-12, -25), vec2(12, 10)),
				"enemy"
			]);
	} else if (score < 2000) {
		if (chance(0.5))
			instance = add([
				sprite("oreo2"),
				pos(vec2(-100, -100)),
				layer("fg"),
				healthBar(Math.floor(rand(12, 25))),
				area(vec2(-12, -25), vec2(12, 8)),
				"enemy"
			]);
		else
			instance = add([
				sprite("oreo4"),
				pos(vec2(-100, -100)),
				layer("fg"),
				healthBar(Math.floor(rand(18, 33))),
				area(vec2(-16, -27), vec2(14, 12)),
				"enemy"
			]);
	} else {
		if (chance(0.5) && !isGod) {
			instance = add([
				sprite("oreo5"),
				pos(vec2(-100, -100)),
				layer("fg"),
				healthBar(Math.floor(rand(28, 43))),
				"enemy"
			]);
			// god mode adds a few minions
			for (let _ = 0; _ < rand(2, 5); _++) addEnemy(true);
		} else {
			if (chance(0.5))
				instance = add([
					sprite("oreo4"),
					pos(vec2(-100, -100)),
					layer("fg"),
					healthBar(Math.floor(rand(18, 33))),
					area(vec2(-16, -27), vec2(14, 12)),
					"enemy"
				]);
			else
				instance = add([
					sprite("oreo2"),
					pos(vec2(-100, -100)),
					layer("fg"),
					healthBar(Math.floor(rand(12, 25))),
					area(vec2(-12, -25), vec2(12, 8)),
					"enemy"
				]);
		}
	}

	instance.speed = rand(-10, 10);

	do {
		instance.pos = vec2(rand(0, width()), rand(0, height()));
	} while (instance.pos.dist(cookie.pos) < 100);

	drawHealth(instance);
	enemyCount++;

	instance.on("destroy", () => {
		enemyCount--;
		destroy(instance.bar);
		destroy(instance.fill);
	});
}

loop(0.75, addEnemy);

action("enemy", e => {
	if (!stillRunning) destroy(e);
	if (!e.pos || !e.move) return;
	e.move(cookie.pos.sub(e.pos).unit().scale(ENEMY_SPEED + e.speed));

	e.pos.x = e.pos.x < e.width / 2 ? e.width / 2 : e.pos.x > width() - e.width / 2 ? width() - e.width / 2 : e.pos.x;
	e.pos.y = e.pos.y < e.height / 2 ? e.height / 2 : e.pos.y > height() - e.height / 2 ? height() - e.height / 2 : e.pos.y;
});

collides("bullet", "enemy", (b, e) => {
	b.life--;
	if (b.life <= 0) destroy(b);
	e.health--;

	if (e.health <= 0) {
		score += e.maxHealth;
		updateScore();

		play("pop", {
			volume: 2
		});

		add([
			sprite("explosion"),
			layer("explode"),
			pos(e.pos),
			color(1, 1, 1),
			{ time: 0 },
			"explode"
		]);

		destroy(e);
	}
});

collides("player", "enemy", (p, e) => {
	p.health--;
	if (p.health <= 0) {
		play("die");
		transition("lose", score, p.pos);
		destroy(p);
	}

	score += e.health;
	updateScore();

	play("hit");

	destroy(e);
});

action("explode", t => {
	t.time += dt() / 2;
	t.color.a = 1 - t.time;
	if (t.time > 1) destroy(t);
});


// medkit
function addMedkit() {
	if (powerups.medkit > 0) return;
	powerups.medkit++;

	let instance = add([
		sprite("medkit"),
		pos(vec2(-100, -100)),
		layer("fg"),
		{ health: 10 },
		"medkit"
	]);

	instance.on("destroy", () => powerups.medkit--);

	do {
		instance.pos = vec2(rand(0, width()), rand(0, height()));
	} while (instance.pos.dist(cookie.pos) < 100);
}

action("medkit", m => {
	m.health -= dt();
	if (m.health <= 0) destroy(m);
});

collides("player", "medkit", (p, m) => {
	p.health = p.health + MEDKIT_AMT > p.maxHealth ? p.maxHealth : p.health + MEDKIT_AMT;
	play("powerup");
	destroy(m);
});

loop(20, () => {
	if (cookie.health < cookie.maxHealth) addMedkit();
});


// bomb
function addBomb() {
	if (powerups.bomb > 0) return;
	powerups.bomb++;

	let instance = add([
		sprite("bomb"),
		pos(vec2(-100, -100)),
		scale(3),
		layer("fg"),
		{ health: 10 },
		"bomb"
	]);

	instance.on("destroy", () => powerups.bomb--);

	do {
		instance.pos = vec2(rand(0, width()), rand(0, height()));
	} while (instance.pos.dist(cookie.pos) < 100);
}

action("bomb", b => {
	b.health -= dt();
	if (b.health <= 0) destroy(b);
});

collides("player", "bomb", (p, m) => {
	play("explosion");

	every("enemy", e => {
		if (e.pos.dist(m.pos) < 150) {
			score += e.maxHealth;
			updateScore();
			destroy(e);
		}
	});

	add([
		sprite("explosion"),
		layer("explode"),
		pos(m.pos),
		scale(10, 10),
		color(1, 1, 1),
		{ time: 0 },
		"explode"
	]);

	destroy(m);
});

loop(30, () => {
	if (enemyCount > MAX_ENEMY_COUNT / 3) addBomb();
});




// internals
function healthBar(maxHealth) {
	let bar = add([
		sprite("healthbar"),
		pos(vec2(-100, -100)),
		origin("topleft"),
		layer("ui"),
	]);

	let fill = add([
		sprite("healthset"),
		pos(vec2(-100, -100)),
		scale(1, 1),
		origin("topleft"),
		layer("ui"),
	]);

	return { health: maxHealth, maxHealth, bar, fill };
}

function drawHealth(obj) {
	obj.action(() => {
		obj.bar.pos = obj.pos.sub(vec2(25, 30));
		obj.fill.pos = obj.pos.sub(vec2(25, 30));
		obj.fill.scale.x = obj.health / obj.maxHealth;
	});
}

function updateScore() {
	scoreText.text = `SCORE: ${score.toLocaleString()}`;
}

keyDown("w", () => keys["up"] = true);
keyDown("a", () => keys["left"] = true);
keyDown("s", () => keys["down"] = true);
keyDown("d", () => keys["right"] = true);
keyDown("up", () => keys["up"] = true);
keyDown("left", () => keys["left"] = true);
keyDown("down", () => keys["down"] = true);
keyDown("right", () => keys["right"] = true);

keyRelease("w", () => keys["up"] = false);
keyRelease("a", () => keys["left"] = false);
keyRelease("s", () => keys["down"] = false);
keyRelease("d", () => keys["right"] = false);
keyRelease("up", () => keys["up"] = false);
keyRelease("left", () => keys["left"] = false);
keyRelease("down", () => keys["down"] = false);
keyRelease("right", () => keys["right"] = false);

mouseDown(() => {
	if (!reload) {
		addBullet(cookie.pos, rotation);
		play("shoot", {
			volume: 0.5
		});
		reload = 10;
	}
});

keyDown("space", () => {
	if (!reload) {
		addBullet(cookie.pos, rotation);
		play("shoot", {
			volume: 0.5
		});
		reload = 10;
	}
});

let transitioned = false;
function transition(scene, a, v) {
	if (transitioned) return;
	transitioned = true;

	const instance = add([
		sprite("transition"),
		scale(1),
		pos(v),
		layer("trans")
	]);

	instance.action(() => {
		let s = instance.scale;
		s.x += width() / height() * 150 * dt();
		s.y += width() / height() * 150 * dt();
		if (instance.width * s.x > width() * 2 && instance.height * s.y > height() * 2) go(scene, a);
	});
}


// music
play("backgroundmusic");
loop(94, () => play("backgroundmusic"));