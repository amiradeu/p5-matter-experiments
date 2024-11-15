import { Bodies, Composite, Common } from 'matter-js'

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export class Blocks {
    constructor(world, width, height, debug) {
        this.world = world
        this.debug = debug

        // canvas dimensions
        this.canvasWidth = width
        this.canvasHeight = height

        // prevent blocks from overlapping
        this.shiftHeight = 0
        this.createBody()
    }

    createBody() {
        // store all the blocks
        this.bodies = []

        // create multiple blocks
        for (let i = 0; i < 3; i++) {
            // one body
            const body = this.createRandomBlock()
            // console.log(body)

            // add body to array
            this.bodies.push(body)
        }
        Composite.add(this.world, this.bodies)
    }

    createRandomBlock() {
        // random block dimensions
        const blockWidth = getRandomArbitrary(100, this.canvasWidth / 2)
        const blockHeight = getRandomArbitrary(20, 60)
        // console.log('blockWidth:', blockWidth, ' blockHeight:', blockHeight)

        // add distance between blocks
        this.shiftHeight += 150

        // x, y, w, h
        return Bodies.rectangle(
            getRandomArbitrary(50, this.canvasWidth),
            getRandomArbitrary(this.shiftHeight, this.shiftHeight + 100),
            blockWidth,
            blockHeight,
            {
                isStatic: true,
            }
        )
    }

    drawShape(sketch) {
        // draw all the bodies in array
        this.bodies.forEach((body) => {
            let { x, y } = body.position
            // console.log('x: ', x, 'y: ', y)
            let { min, max } = body.bounds

            sketch.push()
            sketch.translate(x, y)
            sketch.rectMode(sketch.CENTER)

            sketch.fill(this.debug.color)
            sketch.stroke(this.debug.outline)
            sketch.strokeWeight(this.debug.weight)
            // sketch.noStroke()
            sketch.rect(0, 0, max.x - min.x, max.y - min.y)

            sketch.pop()
        })
    }
}
