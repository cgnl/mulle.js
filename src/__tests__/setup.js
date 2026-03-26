/**
 * Jest test setup - Mock browser globals and Phaser
 */

// Mock Phaser.Point
global.Phaser = {
  Point: class Point {
    constructor(x = 0, y = 0) {
      this.x = x
      this.y = y
    }
  },
  Math: {
    angleBetween: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)
  }
}

// Mock console.log for cleaner test output (optional)
// global.console.log = jest.fn()
