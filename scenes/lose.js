if (!localStorage.getItem("highscore")) localStorage.setItem("highscore", "0");
let highScore = Number(localStorage.getItem("highscore"));


layers([
	"bg",
	"ol",
	"ui",
	"trans"
]);

// background
add([
	sprite("background2"),
	origin("topleft"),
	scale(width() / 100, height() / 100),
	layer("bg")
]);


add([
	text("YOU DIED!", width() / height() * 13),
	color(1, 0.6, 0.6),
	pos(vec2(width() / 2 + 1, 21)),
	layer("ol")
]);

add([
	text("YOU DIED!", width() / height() * 13),
	color(1, 0.6, 0.6),
	pos(vec2(width() / 2 + 2, 22)),
	layer("ol")
]);

add([
	text("YOU DIED!", width() / height() * 13),
	color(0.99, 0.01, 0.03),
	pos(vec2(width() / 2, 20)),
	layer("ui")
]);

add([
	text(`SCORE: ${args.toLocaleString()}`, width() / height() * 8),
	color(0.1, 0.6, 0.23),
	pos(vec2(width() / 2 + 1, 51)),
	layer("ol")
]);

add([
	text(`SCORE: ${args.toLocaleString()}`, width() / height() * 8),
	color(0.1, 0.6, 0.23),
	pos(vec2(width() / 2 + 2, 52)),
	layer("ol")
]);

add([
	text(`SCORE: ${args.toLocaleString()}`, width() / height() * 8),
	color(0, 0.5, 0.13),
	pos(vec2(width() / 2, 50)),
	layer("ui")
]);

if (args > highScore || true) {
	localStorage.setItem("highscore", args.toString());

	add([
		text(`NEW HIGH SCORE!`, width() / height() * 8),
		color(0.2, 0.4, 0.3),
		pos(vec2(width() / 2 + 1, height() / 4 + 1)),
		layer("ol")
	]);

	add([
		text(`NEW HIGH SCORE!`, width() / height() * 8),
		color(0.2, 0.4, 0.3),
		pos(vec2(width() / 2 + 2, height() / 4 + 2)),
		layer("ol")
	]);

	add([
		text(`NEW HIGH SCORE!`, width() / height() * 8),
		color(0.1, 0.3, 0.2),
		pos(vec2(width() / 2, height() / 4)),
		layer("ui")
	]);
}

const spin = add([
	text("PRESS SPACE TO RESTART", width() / height() * 13),
	color(0, 0.01, 1),
	pos(vec2(width() / 2, height() / 2)),
	layer("ui")
]);

spin.action(() => {
	spin.textSize = Math.sin(time() * 2) * 3 + width() / height() * 15;
});



keyPress("space", () => transition("start"));




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