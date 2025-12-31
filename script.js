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

function CircularEnemy(x, y, radius, orbitRadius, speed) {
	this.currentX = x
	this.currentY = y
	this.radius = radius
	this.angle = 0
	this.orbitRadius = orbitRadius
	this.speed = speed

	this.draw = function(px, py) {
		context.beginPath()
		context.arc(px, py, this.radius, 0, Math.PI * 2, false)
		context.fillStyle = "purple"
		context.fill()
		context.lineWidth = 2
		context.strokeStyle = "black"
		context.stroke()
	}

	this.move = function() {
		let x = this.currentX + Math.cos(this.angle) * this.orbitRadius
		let y = this.currentY + Math.sin(this.angle) * this.orbitRadius
		this.angle += this.speed
		this.draw(x, y)
	}

}

function RectangularEnemy(x, y, dx, dy, radius, state) {
	this.startX = x
	this.startY = y
	this.x = x
	this.y = y
	this.dx = dx
	this.dy = dy
	this.radius = radius
	this.state = state

	this.draw = function() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		context.fillStyle = "pink"
		context.fill()
		context.lineWidth = 2
		context.strokeStyle = "black"
		context.stroke()
	}
	this.move = function() {
		let length = 200
		if (this.state == "right") {
			this.x += this.dx
			if (this.x >= this.startX + length) this.state = "down"
		} else if (this.state == "down") {
			this.y += this.dy
			if (this.y >= this.startY + length) this.state = "left"
		} else if (this.state == "left") {
			this.x -= this.dx
			if (this.x <= this.startX) this.state = "up"
		} else if (this.state == "up") { 
			this.y -= this.dy
			if (this.y <= this.startY) this.state = "right"
		}
		this.draw()
	}
}

function FollowCircle(x, y, radius) {
	this.x = x
	this.y = y
	this.radius = radius 

	this.draw = function() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		context.fillStyle = "white"
		context.fill()
		context.lineWidth = 2
		context.strokeStyle = "black"
		context.stroke()
	}
}

function followPlayer(playerObject, followCircleObject) {
	let diffX = playerObject.x - followCircleObject.x
	let diffY = playerObject.y - followCircleObject.y

	let angle = Math.atan2(diffY, diffX)

	let speed = 2
	followCircleObject.x += Math.cos(angle) * speed
	followCircleObject.y += Math.sin(angle) * speed
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
let circularEnemy = new CircularEnemy(canvas.width / 2, canvas.height / 2, 20, 200, 0.05)
let rectEnemy = new RectangularEnemy(canvas.width / 2, canvas.height / 2, 5, 5, 20, "right")
let followEnemy = new FollowCircle(200, 200, 20)
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
	followEnemy.draw()
	player.update()
	followPlayer(player, followEnemy)
}
animate()
