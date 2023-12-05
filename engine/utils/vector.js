class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    div(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag !== 0) {
            this.div(mag);
        }
        return this;
    }

    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static sub(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    static mul(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }

    static div(vector, scalar) {
        if (scalar !== 0) {
            return new Vector(vector.x / scalar, vector.y / scalar);
        } else {
            return new Vector();
        }
    }

    static distance(vector1, vector2) {
        const dx = vector2.x - vector1.x;
        const dy = vector2.y - vector1.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
}

export default Vector;
