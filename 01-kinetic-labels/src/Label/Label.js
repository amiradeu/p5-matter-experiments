import { Bodies, Body, Composite } from 'matter-js'
import { HexToHSL } from '../utlis'

export class Label {
    constructor(world, x, y, word, debug) {
        this.world = world
        this.x = x
        this.y = y
        this.debug = debug

        // initial state of label
        this.colorLightness = 100
        this.state = 1
        this.hoverState = 1
        this.rate = 0.2

        // split word
        const re = /([^a-zA-Z0-9])/
        const words = word.split(re)
        this.word = words[0].toUpperCase()
        this.middle = words[1]
        this.last = words[2]

        // label size
        this.width = this.word.length * 25
        this.height = 60
        this.corner = 60

        this.createBody()
    }

    init() {}

    createBody() {
        this.createFrontBody()
        this.createLastBody()
        this.createMiddleBody()

        // Add the whole body into the World
        this.id = this.body.id
        Body.setAngularVelocity(this.body, 0.1)
        Composite.add(this.world, this.body)
    }

    getBody() {
        return this.body
    }

    createFrontBody() {
        this.firstBody = Bodies.rectangle(
            this.x,
            this.y,
            this.width,
            this.height,
            {
                chamfer: { radius: this.corner * 0.5 },
            }
        )
        //console.log("firstBody", this.firstBody.position);

        this.body = Body.create({
            parts: [this.firstBody],
        })
    }

    createMiddleBody() {
        if (this.middle && this.middle !== '.' && this.middle !== ' ') {
            this.middleBody = Bodies.rectangle(
                this.x + this.width / 2 + 10,
                this.y,
                50,
                50,
                { chamfer: { radius: this.corner * 0.5 } }
            )

            this.body = Body.create({
                parts: [this.firstBody, this.lastBody, this.middleBody],
            })

            // console.log("middle", middleBody.position);
        }
    }

    createLastBody() {
        if (this.last) {
            const padding = this.last.length < 5 ? 5 : 20
            this.lastBody = Bodies.rectangle(
                this.x + this.width / 2,
                this.y + this.height / 2 + padding,
                this.last.length * 30,
                this.height,
                { chamfer: { radius: this.corner * 0.5 } }
            )

            this.body = Body.create({
                parts: [this.firstBody, this.lastBody],
            })

            //console.log("whole", this.body.position);
        }
    }

    drawShape(sketch) {
        // color change to white after some time
        this.toWhite()

        sketch.push()

        // copy the physics body
        // ! copy from firstBody
        // to make sure the drawing is correctly align
        // with the physics body
        let { x, y } = this.firstBody.position
        let angle = this.body.angle

        // apply to the elements
        sketch.translate(x, y)
        sketch.rotate(angle)

        this.drawFrontBody(sketch)
        this.drawLastBody(sketch)
        this.drawMiddleBody(sketch)
        sketch.pop()
    }

    drawFrontBody(sketch) {
        // text box
        sketch.rectMode(sketch.CENTER)
        sketch.colorMode(sketch.HSL)
        sketch.fill(
            HexToHSL(this.debug.textHighlight).hue,
            HexToHSL(this.debug.textHighlight).saturation,
            this.colorLightness
        )
        sketch.stroke(this.debug.textColor)
        sketch.strokeWeight(3)
        sketch.rect(0, 0, this.width, this.height, this.corner)

        // text
        sketch.noStroke()
        sketch.fill(this.debug.textColor)
        sketch.textSize(30)
        sketch.textAlign(sketch.CENTER, sketch.CENTER)

        sketch.text(this.word, 0, 0)
        // text(this.id, 0, -50);
    }

    drawMiddleBody(sketch) {
        if (this.middleBody) {
            sketch.rectMode(sketch.CENTER)
            sketch.fill(
                HexToHSL(this.debug.textHighlight).hue,
                HexToHSL(this.debug.textHighlight).saturation,
                this.colorLightness
            )
            sketch.stroke(this.debug.textColor)
            sketch.strokeWeight(3)
            sketch.rect(this.width / 2 + 10, 0, 50, 50, this.corner)
            sketch.noStroke()
            sketch.fill(this.debug.textColor)
            sketch.textSize(30)
            sketch.textAlign(sketch.CENTER, sketch.CENTER)
            sketch.text(this.middle, this.width / 2 + 10, 0)
        }
    }

    drawLastBody(sketch) {
        if (this.lastBody) {
            const padding = this.last.length < 5 ? 5 : 20

            sketch.rectMode(sketch.CENTER)

            let { hue, saturation, lightness } = HexToHSL(
                this.debug.textHighlight
            )
            // console.log(lightness, this.colorLightness)
            sketch.fill(
                HexToHSL(this.debug.textHighlight).hue,
                HexToHSL(this.debug.textHighlight).saturation,
                this.colorLightness
            )
            sketch.stroke(this.debug.textColor)
            sketch.strokeWeight(3)
            sketch.rect(
                this.width / 2,
                this.height / 2 + padding,
                this.last.length * 30,
                this.height,
                this.corner
            )
            sketch.noStroke()
            sketch.fill(this.debug.textColor)
            sketch.textSize(30)
            sketch.textAlign(sketch.CENTER, sketch.CENTER)
            sketch.text(
                this.last.toUpperCase(),
                this.width / 2,
                this.height / 2 + padding
            )
        }
    }

    updateState() {
        // flip between 1/-1 state
        this.state *= -1

        // update color by state
        if (this.state == -1) {
            this.colorLightness = HexToHSL(this.debug.textHighlight).lightness
            // this.colorHue = this.PINK_HUE
        } else {
            //this.colorLightness = 100
            // this.colorHue = this.YELLOW_HUE
        }

        // console.log('hover', this.state)
    }

    updateHoverState() {
        // flip between 1/-1 state
        this.hoverState += 1
        // delay state flip
        if (this.hoverState > 200) this.hoverState = -1

        // update color by state
        let { lightness } = HexToHSL(this.debug.textHighlight)
        if (this.hoverState > 1) this.colorLightness = lightness
        else this.colorLightness = 100

        // console.log('hover', this.state)
    }

    toWhite() {
        if (this.colorLightness < 101) this.colorLightness += this.rate
        // console.log(this.colorLightness)
    }
}
