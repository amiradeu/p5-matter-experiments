import { Bodies, Body, Composite } from 'matter-js'

function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

export class Arrow {
    constructor(world, x, y, size, debug) {
        this.world = world
        this.debug = debug

        this.x = x
        this.y = y
        this.size = size

        // initial angle
        this.angle = 0
        this.targetAngle = 0

        this.createBody()
    }

    createBody() {
        const bodyProperties = {
            restitution: 1.0, // bouncy
        }
        this.body = new Bodies.circle(
            this.x,
            this.y,
            this.debug.size / 2,
            bodyProperties
        )
        this.id = this.body.id

        Body.setAngularVelocity(this.body, 0.1)
        Composite.add(this.world, this.body)
    }

    getBody() {
        return this.body
    }

    drawShape(sketch) {
        sketch.push()

        let { x, y } = this.body.position

        sketch.translate(x, y)

        //
        this.angle += this.targetAngle * 0.2
        console.log('target:', this.targetAngle)
        console.log('curr angle:', this.angle)

        sketch.angleMode(sketch.DEGREES)
        sketch.rotate(this.angle)

        // match with physics
        sketch.rectMode(sketch.CENTER)
        sketch.fill(this.debug.background)
        sketch.strokeWeight(this.debug.weight)
        sketch.stroke(this.debug.outline)
        sketch.circle(0, 0, this.debug.size)

        // arrow
        // sketch.noStroke()
        sketch.fill(this.debug.color)
        sketch.textAlign(sketch.CENTER, sketch.CENTER)
        sketch.strokeWeight(1)
        sketch.textSize(this.debug.size * 0.9)
        // slight shift to center arrow
        // sketch.text('⇨', 0, -2)
        sketch.text(this.debug.symbol, this.debug.offset.x, this.debug.offset.y)

        sketch.pop()
    }

    // orient to face cursor
    updateOrientation(sketch) {
        const cursorX = sketch.mouseX
        const cursorY = sketch.mouseY
        // console.log('cursorX: ', cursorX, 'cursorY: ', cursorY)

        let { x, y } = this.body.position
        this.targetAngle = sketch.atan2(cursorY - y, cursorX - x)
        // console.log('targetAngle: ', targetAngle)

        // update angle
        // this.angle = lerp(this.angle, angle, 0.1)
        // this.angle = targetAngle
    }

    // update ball size
    recreateBody(size) {
        const scale = size / this.size
        this.size = size
        // console.log('scale', scale)
        Body.scale(this.body, scale, scale)
    }
}
