if (!localStorage.getItem("highscore")) localStorage.setItem("highscore", "0");
let score = Number(localStorage.getItem("highscore"));

layers([
	"bg",
	"fg",
	"ol", // overlay
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


add([
	sprite("overlay"),
	layer("ol"),
	pos(vec2(width() / 2, 25)),
	scale(3.5 * width() / height(), width() / height())
]);

add([
	sprite("overlay"),
	layer("ol"),
	pos(vec2(width() / 2, height() - 15)),
	scale(5 * width() / height(), width() / height())
]);


add([
	text("COOKIE VS OREO", width() / height() * 10),
	color(0.65, 0.35, 0.16),
	pos(vec2(width() / 2 + 1, 21)),
	layer("ui")
]);

add([
	text("COOKIE VS OREO", width() / height() * 10),
	color(0.65, 0.35, 0.16),
	pos(vec2(width() / 2 + 2, 22)),
	layer("ui")
]);

add([
	text("COOKIE VS OREO", width() / height() * 10),
	color(0.45, 0.2, 0.01),
	pos(vec2(width() / 2, 20)),
	layer("ui")
]);


add([
	text(`HIGH SCORE: ${score.toLocaleString()}`, width() / height() * 8),
	color(0.2, 0.4, 0.3),
	pos(vec2(width() / 2 + 1, 23 + width() / height() * 12)),
	layer("ui")
]);

add([
	text(`HIGH SCORE: ${score.toLocaleString()}`, width() / height() * 8),
	color(0.2, 0.4, 0.3),
	pos(vec2(width() / 2 + 2, 24 + width() / height() * 12)),
	layer("ui")
]);

add([
	text(`HIGH SCORE: ${score.toLocaleString()}`, width() / height() * 8),
	color(0.1, 0.3, 0.2),
	pos(vec2(width() / 2, 22 + width() / height() * 12)),
	layer("ui")
]);


const spin = add([
	text("PRESS SPACE TO START", width() / height() * 15),
	color(0.2, 0.3, 0.2),
	pos(vec2(width() / 2, height() / 2)),
	layer("ui")
]);

spin.action(() => {
	spin.textSize = Math.sin(time() * 2) * 3 + width() / height() * 15;
});


add([
	text("PRESS H FOR HELP", width() / height() * 13),
	color(1, 0.6, 0.11),
	pos(vec2(width() / 2 + 1, height() - width() / height() * 15 + 1)),
	layer("ui")
]);

add([
	text("PRESS H FOR HELP", width() / height() * 13),
	color(1, 0.6, 0.11),
	pos(vec2(width() / 2 + 2, height() - width() / height() * 15 + 2)),
	layer("ui")
]);

add([
	text("PRESS H FOR HELP", width() / height() * 13),
	color(1, 0.5, 0.01),
	pos(vec2(width() / 2, height() - width() / height() * 15)),
	layer("ui")
]);


add([
	sprite("cookie"),
	pos(vec2(80, 80)),
	layer("fg")
]);

add([
	sprite("gun"),
	rotate(-Math.PI / 4),
	scale(2),
	pos(vec2(110, 110)),
	layer("fg")
]);

add([
	sprite("bullet"),
	rotate(-Math.PI / 4),
	scale(2),
	pos(vec2(150, 150)),
	layer("fg")
]);

add([
	sprite("oreo"),
	pos(vec2(300, 300)),
	layer("fg")
]);

add([
	sprite("oreo"),
	pos(vec2(400, 100)),
	layer("fg")
]);

add([
	sprite("explosion"),
	pos(vec2(60, 300)),
	layer("fg")
]);

for (let i = 0; i < width(); i += 150) {
	add([
		sprite("oreo"),
		pos(vec2(rand(60, width() - 60), rand(60, height() - 60))),
		layer("fg")
	]);

	if (chance(0.25)) add([
		sprite("explosion"),
		pos(vec2(rand(60, width() - 60), rand(60, height() - 60))),
		layer("fg")
	]);
}


keyPress("space", () => transition("game"));
keyPress("h", () => transition("help", vec2(width() / 2, height() - 5)));




// internals
let transitioned = false;
function transition(scene, v = vec2(width() / 2, height() / 2)) {
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