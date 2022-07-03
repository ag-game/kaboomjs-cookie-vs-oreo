const TOP_HEIGHT = 3;

layers([
	"bg",
	"ol",
	"fg",
	"trans"
]);


add([
	sprite("background2"),
	origin("topleft"),
	scale(width() / 100, height() / 100),
	layer("bg")
]);


add([
	sprite("overlay"),
	layer("ol"),
	pos(vec2(width() / 2, height() - 20)),
	scale(7 * width() / height(), width() / height())
]);


const txt = `USE ARROW KEYS/WASD TO MOVE.
DON'T TOUCH THE OREOS.
CLICK/SPACE TO SHOOT.
UNLOCK MORE OREOS BY GETTING MORE SCORE.`.split("\n");

for (let i = 0; i < txt.length; i++) {
	const t = txt[i];
	add([
		text(t, width() / height() * 8),
		pos(vec2(width() / 2, 27 * i + 20)),
		layer("fg"),
		color(0.4, 0.1, 0.5)
	]);
}

add([
	text("PRESS SPACE TO START", 20),
	pos(vec2(width() / 2 + 1, height() - 29)),
	layer("fg"),
	color(0.3, 0.3, 0.3)
]);

add([
	text("PRESS SPACE TO START", 20),
	pos(vec2(width() / 2 + 2, height() - 28)),
	layer("fg"),
	color(0.3, 0.3, 0.3)
]);

add([
	text("PRESS SPACE TO START", 20),
	pos(vec2(width() / 2, height() - 30)),
	layer("fg"),
	color(0)
]);

keyPress("space", () => transition("game", vec2(width() / 2, height() - 5)));




// internals
let transitioned = false;
function transition(scene, v) {
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
		if (instance.width * s.x > width() * 2 && instance.height * s.y > height() * 2) go(scene);
	});
}