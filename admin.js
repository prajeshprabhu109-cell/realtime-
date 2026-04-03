// This file handles high-privilege commands
class AdminController {
    constructor(engine, io) {
        this.engine = engine;
        this.io = io;
    }

    // Adjust global physics parameters (The "House Edge" Control)
    setGravity(value) {
        this.engine.world.gravity.y = value;
        console.log(`Admin updated gravity to: ${value}`);
    }

    // Force-terminate a round if a glitch is detected
    emergencyStop() {
        this.engine.gameState = 'emergency';
        this.io.emit('systemAlert', { message: "Round suspended for maintenance." });
    }
}