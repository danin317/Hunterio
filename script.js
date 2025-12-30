const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.backgroundColor = "#7fc457ff"

const arrowKeys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
}

window.addEventListener("keydown", (e) => {
    if (arrowKeys.hasOwnProperty(e.key)) arrowKeys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    if (arrowKeys.hasOwnProperty(e.key)) arrowKeys[e.key] = false;
});

function Player(x, y, radius, text) {
	this.x = x
	this.y = y
	this.radius = radius
	this.text = text

	this.draw = function() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		context.fillStyle = "red"
		context.fill()
		context.lineWidth = 2
		context.strokeStyle = "black"
		context.stroke()

		context.fillStyle = "black"
		context.textAlign = "center"
		context.textBaseline = "middle"
		context.font = "15px Arial"
		context.fillText(this.text, this.x, this.y)
	}

	this.move = function() {
		if (arrowKeys.ArrowUp) this.y -= 2
		if (arrowKeys.ArrowDown) this.y += 2
		if (arrowKeys.ArrowRight) this.x += 2
		if (arrowKeys.ArrowLeft) this.x -= 2
		this.draw()
	}

	this.update = function() {
		if (this.x + this.radius > canvas.width) this.x -= 10
		if (this.x - this.radius < 0) this.x += 10
		if (this.y + this.radius > canvas.height) this.y -= 10
		if (this.y - this.radius < 0) this.y += 10
		this.move()
	}
}

function Food(x, y, radius) {
	this.x = x
	this.y = y
	this.radius = radius
	
	this.draw = function() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		context.fillStyle = "yellow"
		context.fill()
		context.lineWidth = 2
		context.strokeStyle = "black"
		context.stroke()
	}
} 

function BasicEnemy(x, y, dx, dy, radius, movement) {
	this.x = x
	this.y = y
	this.dx = dx
	this.dy = dy
	this.radius = radius
	this.movement = movement

	this.draw = function() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		context.fillStyle = "blue"
		context.fill()
		context.lineWidth = 2
		context.strokeStyle = "black"
		context.stroke()
	}

	this.move = function() {
		if (this.movement == "horizontal") {
			if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx
			this.x += this.dx
		}
		if (this.movement == "vertical") {
			if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy
			this.y += this.dy
		}
		if (this.movement == "dvd") {
			if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx
			if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy
			this.x += this.dx
			this.y += this.dy
		}
		this.draw()
	}
} 

let arrayFood = []
let foodAmount = 100
function spawnFood(amount) {
	for(let i = 0; i < amount; i++) {
		let x = Math.random() * canvas.width
		let y = Math.random() * canvas.height
		let radius = Math.random() * 5 + 5
		arrayFood.push(new Food(x, y, radius))
	}
}

let player = new Player(canvas.width / 2, canvas.height / 2, 20, "1")
let basicEnemy = new BasicEnemy(100, 100, 10, 10, 20, "dvd")

spawnFood(foodAmount)

playerSize = 1
function animate() {
	requestAnimationFrame(animate)
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < arrayFood.length; i++) {
		let food = arrayFood[i]
		food.draw()

		let dx = player.x - food.x
		let dy = player.y - food.y

		let distance = Math.sqrt(dx * dx + dy * dy)

		if (player.radius + food.radius > distance) {	
			arrayFood.splice(i, 1)
			player.radius += 0.2
			playerSize += 1
			player.text = playerSize.toString()
			i--
		}
	}
	basicEnemy.move()
	player.update()
}
animate()
