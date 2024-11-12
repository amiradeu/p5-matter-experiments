import { Bodies, Body, Common, Composite, Composites } from 'matter-js'

export class Smiley {
    constructor(world, x, y, w, h, c, r) {
        this.world = world

        this.x = x
        this.y = y
        this.width = w
        this.height = h

        this.column = c
        this.row = r

        this.createBody()
    }

    createBody() {
        this.particleOptions = {
            inertia: Infinity,
            friction: 0.05,
            frictionStatic: 0.1,
            frictionAir: 0.05,
            // restitution: 1.9,
            // render: {
            //     visible: true,
            //     sprite: {
            //         texture: 'https://i.ibb.co/X4tm54x/smiley.png',
            //         yScale: 0.5,
            //         xScale: 0.5,
            //     },
            // },
        }
        const particleOptions = this.particleOptions
        this.constraintOptions = Common.extend({
            stiffness: 0.5,
            render: {
                //visible: false,
                type: 'line',
                anchors: false,
            },
        })

        this.columnGap = 2
        this.rowGap = 2
        const crossBrace = false
        this.radius = 32

        console.log('column', this.column)
        this.bodyGroup = Composites.stack(
            250,
            100,
            this.column,
            this.row,
            this.columnGap,
            this.rowGap,
            function (x, y) {
                return Bodies.circle(x, y, 32, particleOptions)
            }
        )

        Composites.mesh(
            this.bodyGroup,
            this.column,
            this.row,
            crossBrace,
            this.constraintOptions
        )

        console.log(this.bodyGroup)
        console.log(this.bodyGroup.bodies)

        this.id = this.bodyGroup.id

        // BodyGroup.setAngularVelocity(this.bodyGroup, Common.random(0, 1))
        Composite.add(this.world, this.bodyGroup)
    }

    updateBody(row, column) {
        Composite.remove(this.world, this.bodyGroup)

        const crossBrace = false

        const particleOptions = this.particleOptions

        this.bodyGroup = Composites.stack(
            250,
            100,
            column,
            row,
            this.columnGap,
            this.rowGap,
            function (x, y) {
                return Bodies.circle(x, y, 32, particleOptions)
            }
        )

        Composites.mesh(
            this.bodyGroup,
            column,
            row,
            crossBrace,
            this.constraintOptions
        )

        this.id = this.bodyGroup.id

        Composite.add(this.world, this.bodyGroup)
    }

    getBody() {
        return this.body
    }

    drawShape(sketch, img) {
        this.bodyGroup.bodies.forEach((body) => {
            sketch.push()
            let { x, y } = body.position
            let angle = body.angle

            sketch.translate(x, y)
            sketch.rotate(angle)

            // circle
            sketch.fill(255)
            sketch.stroke('#0f0f0f')
            sketch.strokeWeight(3)
            sketch.circle(0, 0, this.radius * 2)

            // image
            sketch.image(
                img,
                -this.radius,
                -this.radius,
                this.radius * 2,
                this.radius * 2
            )

            sketch.pop()
        })
    }
}
