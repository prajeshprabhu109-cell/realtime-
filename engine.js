const Matter = require('matter-js');
const { Engine, World, Bodies, Body, Events } = Matter;

class KineticEngine {
    constructor(io) {
        this.io = io;
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.gameState = 'waiting'; // waiting, rolling, result

        // Create the world boundaries (The "Cage")
        const ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
        this.ball = Bodies.circle(400, 50, 20, { restitution: 0.8, label: 'GameBall' });

        World.add(this.world, [ground, this.ball]);
        this.startLoop();
    }

    startLoop() {
        // Core Heartbeat: 60 updates per second
        setInterval(() => {
            Engine.update(this.engine, 1000 / 60);

            // Broadcast the physical state to ALL connected clients
            this.io.emit('physicsUpdate', {
                ball: {
                    x: this.ball.position.x,
                    y: this.ball.position.y,
                    angle: this.ball.angle
                }
            });
        }, 1000 / 60);
    }

    applyMomentum(force) {
        // The "New Idea": Real-time player influence
        Body.applyForce(this.ball, this.ball.position, { x: force, y: 0 });
    }
}

module.exports = KineticEngine;