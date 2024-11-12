/**
 * Base Template v1.0
 * Last Updated 11/11/2024
 */
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

import { Smiley } from './Smiley/Smiley'
import { Walls } from './Walls/Walls'

/**
 * DEBUG
 */
// debug object
const debug = {
    background: { r: 228, g: 238, b: 245 },
    column: 3,
    row: 3,
}

// tweakpane gui
const pane = new Pane()
const f1 = pane.addFolder({
    title: 'Canvas',
})
f1.addBinding(debug, 'background')
const f2 = pane.addFolder({
    title: 'Soft Body',
})

/**
 * SIZES
 */
const sizes = {
    initialWidth: window.innerWidth,
    initialHeight: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
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
        showCollisions: true,
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
    let img
    sketch.preload = () => {
        img = sketch.loadImage('../smiley.png')
        console.log('image', img)
    }

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
        // drawCoordinates()

        // all elements
        elements.forEach((elem) => {
            elem.drawShape(sketch, img)
        })

        // static box
        // sketch.push()
        // sketch.fill(255)
        // sketch.rect(50, 50, 100, 100)
        // sketch.pop()
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
 * SMILEY
 */
// Smiley
const smiley = new Smiley(
    world,
    Common.random(sizes.width / 4, sizes.width),
    Common.random(0, sizes.height / 4),
    Math.random() * 100 + 50,
    Math.random() * 100 + 50,
    debug.column,
    debug.row
)
elements.push(smiley)

// Debugging smiley
f2.addBinding(debug, 'column', { min: 1, max: 10, step: 1 }).on(
    'change',
    (event) => {
        // on finish change
        if (event.last) {
            console.log('column change', event.value)
            smiley.updateBody(debug.row, event.value)
        }
    }
)

f2.addBinding(debug, 'row', { min: 1, max: 10, step: 1 }).on(
    'change',
    (event) => {
        // on finish change
        if (event.last) {
            console.log('row change', event.value)
            smiley.updateBody(event.value, debug.column)
        }
    }
)

// Floor
// Four-sided Walls
const walls = new Walls(world, sizes.width, sizes.height)
elements.push(walls)
