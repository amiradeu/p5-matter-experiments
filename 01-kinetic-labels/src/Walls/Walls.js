import { Bodies, Composite } from 'matter-js'

export class Walls {
    constructor(world, width, height) {
        this.world = world

        // canvas dimensions
        this.width = width
        this.height = height
        this.thickness = 20

        this.createBody()
    }

    createBody() {
        // walls
        Composite.add(this.world, [
            // top
            Bodies.rectangle(
                this.width / 2,
                this.thickness / 2,
                this.width,
                this.thickness,
                { isStatic: true }
            ),

            // bottom
            Bodies.rectangle(
                this.width / 2,
                this.height - this.thickness / 2,
                this.width,
                this.thickness,
                { isStatic: true }
            ),

            // left
            Bodies.rectangle(
                this.thickness / 2,
                this.height / 2,
                this.thickness,
                this.height,
                { isStatic: true }
            ),

            // right
            Bodies.rectangle(
                this.width - this.thickness / 2,
                this.height / 2,
                this.thickness,
                this.height,
                { isStatic: true }
            ),
        ])
    }

    drawShape(sketch) {
        sketch.push()

        sketch.rectMode(sketch.CENTER)
        sketch.fill(255)
        sketch.strokeWeight(1)

        // top
        sketch.rect(
            this.width / 2,
            this.thickness / 2,
            this.width,
            this.thickness
        )

        // bottom
        sketch.rect(
            this.width / 2,
            this.height - this.thickness / 2,
            this.width,
            this.thickness
        )

        // left
        sketch.rect(
            this.thickness / 2,
            this.height / 2,
            this.thickness,
            this.height
        )

        // right
        sketch.rect(
            this.width - this.thickness / 2,
            this.height / 2,
            this.thickness,
            this.height
        )

        sketch.pop()
    }
}
