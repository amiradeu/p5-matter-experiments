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
    Query,
} from 'matter-js'
import p5 from 'p5'

import { Walls } from './Walls/Walls'
import { Label } from './Label/Label'

/**
 * DEBUG
 */
// debug object
const debug = {
    background: '#e4eef5',
    textColor: '#0f0f0f',
    textHighlight: '#f6ff00',
}

// tweakpane gui
const pane = new Pane()
const f1 = pane.addFolder({
    title: 'Canvas',
})
f1.addBinding(debug, 'background')
const f2 = pane.addFolder({
    title: 'Text',
})
f2.addBinding(debug, 'textColor')
f2.addBinding(debug, 'textHighlight')

/**
 * DATA
 */
const SKILLS = [
    'Javascript',
    'React.js',
    'Vue',
    'Next.js',
    'Three.js',
    'r3f',
    'GLSL',
    'CSS',
    'SCSS',
    'styled-component',
    'gsap',
    'Framer Motion',
    'HTML',
    'git',
    'p5.js',
    'matter.js',
    'blender',
    'Figma',
    'vite',
]

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

// set x-axis gravity to left
engine.gravity.x = -1

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

// let time = 0
// const tick = () => {
//     time += 0.01

//     // changing gravity over time
//     // engine.gravity.x = Math.sin(time)
//     // engine.gravity.y = Math.cos(time)

//     window.requestAnimationFrame(tick)
// }
// tick()
/**
 * P5 DRAWING
 * BASE
 */
let labels = []
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
        sketch.background(debug.background)

        // scaling coordinate in canvas
        sketch.scale(sizes.scaleX, sizes.scaleX)

        // all elements
        drawAllElements()

        // static box
        // sketch.push()
        // sketch.fill(debug.textHighlight)
        // sketch.rect(50, 50, 100, 100)
        // sketch.pop()
    }

    sketch.windowResized = () => {
        // resize canvas
        sketch.resizeCanvas(sizes.width, sizes.height)

        // redraw elements based on physics changes
        drawAllElements()
    }

    sketch.mouseMoved = () => {
        // mouse vector positions
        const mouseXY = { x: sketch.mouseX, y: sketch.mouseY }
        // store the label physics body
        const bodies = []
        // get each label's body
        labels.forEach((label, i) => {
            //console.log('label exist', i, label.getBody().body.position)
            bodies.push(label.getBody())
        })
        // check for existence
        if (labels) {
            // perform collision test
            // does the mouse touch the bodies
            const hoveredShapes = Query.point(bodies, mouseXY)
            // update states of colliding bodies
            hoveredShapes.forEach((shape) => {
                // console.log('hover', shape.id)
                // color the label with this id only
                // by changing it's state
                const activeLabel = labels.find((label) => label.id == shape.id)
                activeLabel.updateHoverState()
            })
        }
    }

    function drawAllElements() {
        elements.forEach((elem) => {
            elem.drawShape(sketch)
        })

        labels.forEach((elem) => {
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
 * LABELS
 */
// Label
SKILLS.forEach((skill, i) => {
    const label = new Label(
        world,
        Common.random(80, sizes.width / 2),
        Common.random(55, sizes.height / 2),
        skill,
        debug
    )
    labels.push(label)
})

// Four-sided Walls
const walls = new Walls(world, sizes.width, sizes.height)
elements.push(walls)
