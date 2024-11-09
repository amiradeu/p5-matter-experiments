import { Bodies, Body, Composite } from 'matter-js'

export class Box {
    constructor(world, x, y, w, h) {
        this.world = world

        this.x = x
        this.y = y
        this.width = w
        this.height = h

        this.createBody()
    }

    createBody() {
        this.body = new Bodies.rectangle(
            this.x,
            this.y,
            this.width,
            this.height
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
        let angle = this.body.angle

        sketch.translate(x, y)
        sketch.rotate(angle)

        // match with physics
        sketch.rectMode(sketch.CENTER)
        sketch.fill(255)
        sketch.rect(0, 0, this.width, this.height)

        sketch.pop()
    }
}
