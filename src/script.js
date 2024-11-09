import { Pane } from 'tweakpane'
import {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Common,
    Mouse,
    MouseConstraint,
} from 'matter-js'
import p5 from 'p5'

import { Box } from './Box/Box'

/**
 * DEBUG
 */
// debug object
const debug = {
    background: { r: 228, g: 238, b: 245 },
}

// tweakpane gui
const pane = new Pane()
pane.addBinding(debug, 'background')

/**
 * SIZES
 */
const sizes = {
    initialWidth: 800,
    initialHeight: 500,
    width: 800,
    height: 500,
    scaleX: 1,
}

window.addEventListener('resize', () => {
    // resize p5 canvas with matter canvas
    let { clientWidth, clientHeight } = document.querySelector(
        '.matter-canvas-wrapper canvas'
    )

    // Update sizes
    sizes.width = clientWidth
    sizes.height = clientHeight

    // Calculate scaling factor
    sizes.scaleX = sizes.width / sizes.initialWidth
    // console.log('W: ', sizes.initialWidth, '->', sizes.width)
    // console.log('scalex: ', sizes.scaleX)
})

/**
 * Matter Physics
 * BASE
 */
// ENGINE
const engine = Engine.create()
const world = engine.world

// RENDER
const render = Render.create({
    element: document.querySelector('.matter-canvas-wrapper'),
    engine: engine,
    options: {
        width: sizes.width,
        height: sizes.height,
        showAngleIndicator: true,
        wireframes: false,
        background: 'transparent',
    },
})

// run the renderer
Render.run(render)

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: sizes.width, y: sizes.height },
})

// create runner
const runner = Runner.create()

// run the engine
Runner.run(runner, engine)

// MOUSE
// add mouse control
const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false,
        },
    },
})
Composite.add(world, mouseConstraint)

/**
 * P5 DRAWING
 * BASE
 */
let elements = []
const s = (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(
            sizes.width,
            sizes.height,
            document.querySelector('.p5-canvas')
        )
    }

    sketch.draw = () => {
        // background
        const { r, g, b } = debug.background
        sketch.background(r, g, b)

        // scaling coordinate in canvas
        sketch.scale(sizes.scaleX, sizes.scaleX)

        // x-coordinates & y-coordinates
        drawCoordinates()

        // all elements
        elements.forEach((elem) => {
            elem.drawShape(sketch)
        })

        // static box
        sketch.push()
        sketch.fill(255)
        sketch.rect(50, 50, 100, 100)
        sketch.pop()
    }

    sketch.windowResized = () => {
        // resize canvas
        sketch.resizeCanvas(sizes.width, sizes.height)

        // redraw elements based on physics changes
        elements.forEach((elem) => {
            elem.drawShape(sketch)
        })
    }

    function drawCoordinates() {
        sketch.textSize(10)

        // coordinates x-axis
        let i = 0
        while (i < sizes.initialWidth) {
            sketch.text(i, i, 10)
            i += 50
        }
        // coordinates y-axis
        i = 0
        while (i < sizes.initialHeight) {
            sketch.text(i, 0, i)
            i += 50
        }
    }
}

let myp5 = new p5(s)

/**
 * TEST OBJECTS
 */
// Boxes
for (let i = 0; i < 10; i++) {
    const box = new Box(
        world,
        Common.random(sizes.width / 4, sizes.width),
        Common.random(0, sizes.height / 4),
        Math.random() * 100 + 50,
        Math.random() * 100 + 50
    )
    elements.push(box)
}

// Floor
const ground = Bodies.rectangle(
    sizes.width / 2,
    sizes.height,
    sizes.width,
    50,
    {
        isStatic: true,
    }
)
Composite.add(world, [ground])
