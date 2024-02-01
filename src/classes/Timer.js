// Timer for tracking time with methods for starting, stopping, and resetting.
export class Timer {
    constructor() {
        this.start_time = 0;
        this.end_time = 0;
        this.total_time = 0;
    }

    toString() {
        const minutes = Math.floor(this.total_time / 60000);
        const seconds = Math.floor((this.total_time % 60000) / 1000);
        const milliseconds = Math.floor((this.total_time % 1000));

        const string = `Total Time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`;

        return string;
    }

    start() {
        this.start_time = performance.now();

        return this.toString();
    }

    stop() {
        this.end_time = performance.now();
        this.total_time = this.end_time - this.start_time;

        return this.toString();
    }

    reset() {
        this.start_time = 0;
        this.end_time = 0;
        this.total_time = 0;

        return this.toString();
    }
}