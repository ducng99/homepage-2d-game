import Movable from "../models/extensions/Movable";
import Renderer from "../views/Renderer";

export default class MoveController {
    private entity: Movable

    /**
     * How fast speed start until reaches max.
     * The higher the slower. 1 is instant
    */
    private _easeInSpeed = 3;
    get EaseInSpeed() { return this._easeInSpeed }
    set EaseInSpeed(value) {
        if (value >= 1) this._easeInSpeed = value;
    }
    /** 
     * How fast speed slow down until reaches min.
     * The higher the slower. 1 is instant
    */
    private _easeOutSpeed = 3;
    get EaseOutSpeed() { return this._easeOutSpeed }
    set EaseOutSpeed(value) {
        if (value >= 1) this._easeOutSpeed = value;
    }

    constructor(ent: Movable) {
        this.entity = ent;
    }

    MoveLeft() {
        if (this.entity.HorizontalSpeed > 0) this.entity.HorizontalSpeed = 0;

        let gradSpeed = this.entity.HorizontalSpeed / this.EaseInSpeed;
        gradSpeed = (gradSpeed === 0 ? -1 : gradSpeed) * Renderer.Instance.TimerDelta;
        if (gradSpeed < -this.entity.MaxHorizontalSpeed) {
            gradSpeed = -this.entity.MaxHorizontalSpeed;
        }

        this.entity.HorizontalSpeed += gradSpeed;
    }

    MoveRight() {
        if (this.entity.HorizontalSpeed < 0) this.entity.HorizontalSpeed = 0;

        let gradSpeed = this.entity.HorizontalSpeed / this.EaseInSpeed;
        gradSpeed = (gradSpeed === 0 ? 1 : gradSpeed) * Renderer.Instance.TimerDelta;
        if (gradSpeed > this.entity.MaxHorizontalSpeed) {
            gradSpeed = this.entity.MaxHorizontalSpeed;
        }

        this.entity.HorizontalSpeed += gradSpeed;
    }

    MoveUp() {
        if (this.entity.VerticalSpeed < 0) this.entity.VerticalSpeed = 0;

        let gradSpeed = this.entity.VerticalSpeed / this.EaseInSpeed;
        gradSpeed = (gradSpeed === 0 ? 1 : gradSpeed) * Renderer.Instance.TimerDelta;
        if (gradSpeed > this.entity.MaxUpSpeed) {
            gradSpeed = this.entity.MaxUpSpeed;
        }

        this.entity.VerticalSpeed += gradSpeed;
    }

    MoveDown() {
        if (this.entity.VerticalSpeed > 0) this.entity.VerticalSpeed = 0;

        let gradSpeed = this.entity.VerticalSpeed / this.EaseInSpeed;
        gradSpeed = (gradSpeed === 0 ? -1 : gradSpeed) * Renderer.Instance.TimerDelta;
        if (gradSpeed < this.entity.MaxDownSpeed) {
            gradSpeed = this.entity.MaxDownSpeed;
        }

        this.entity.VerticalSpeed += gradSpeed;
    }

    StopHorizontal() {
        if (this.entity.HorizontalSpeed <= 0.1 && this.entity.HorizontalSpeed >= -0.1) {
            this.entity.HorizontalSpeed = 0;
        }
        else if (this.entity.HorizontalSpeed > 0.1 || this.entity.HorizontalSpeed < -0.1) {
            const gradSpeed = this.entity.HorizontalSpeed / this.EaseOutSpeed;
            this.entity.HorizontalSpeed -= gradSpeed * Renderer.Instance.TimerDelta;
        }
    }

    StopVertical() {
        if (this.entity.VerticalSpeed <= 0.1 && this.entity.VerticalSpeed >= -0.1) {
            this.entity.VerticalSpeed = 0;
        }
        else if (this.entity.VerticalSpeed > 0.1 || this.entity.VerticalSpeed < -0.1) {
            const gradSpeed = this.entity.VerticalSpeed / this.EaseOutSpeed;
            this.entity.VerticalSpeed -= gradSpeed * Renderer.Instance.TimerDelta;
        }
    }
}