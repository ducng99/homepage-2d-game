import { BoxDirection } from '../controllers/CollisionController'
import Movable, { HorizontalDirection } from './extensions/Movable'
import Collidable from './extensions/Collidable'
import { Mixin } from 'ts-mixer'
import Renderer from '../views/Renderer'
import PlayerMoveController from '../controllers/PlayerMoveController'

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Mixin(Movable, Collidable) {
    State: PlayerState;

    constructor() {
        super();
        this.State = PlayerState.Standing;
        this.MaxHorizontalSpeed = 4;
        this.MaxUpSpeed = 30;
        this.Position.x = 100;
        this.MoveController = new PlayerMoveController(this);

        this.InitEntityView();
    }

    Update() {
        // Update player view to flip to the right direction and update it
        if (this.View) {
            this.View.FlipX.Value = this.Direction === HorizontalDirection.Left;

            this.View.Update();
        }

        // Check collision and move the player
        this.UpdatePosition();

        // Update player state
        this.UpdateState();

        // Update animations
        this.UpdateAnimation();
    }

    private UpdatePosition() {
        let tmpInfo = {
            nextDistance: 0,
            optimal: 0
        };

        tmpInfo.nextDistance = this.HorizontalSpeed * Renderer.Instance.TimerDelta;
        if ((this.HorizontalSpeed < 0 && this.CollisionController.IsCollidingTerrain(BoxDirection.Left, tmpInfo)) || (this.HorizontalSpeed > 0 && this.CollisionController.IsCollidingTerrain(BoxDirection.Right, tmpInfo))) {
            this.Position.x = tmpInfo.optimal;
        }
        else {
            this.Position.MoveX(tmpInfo.nextDistance);
        }

        tmpInfo.nextDistance = -this.VerticalSpeed * Renderer.Instance.TimerDelta;
        if ((this.VerticalSpeed < 0 && this.CollisionController.IsCollidingTerrain(BoxDirection.Bottom, tmpInfo)) || (this.VerticalSpeed > 0 && this.CollisionController.IsCollidingTerrain(BoxDirection.Top, tmpInfo))) {
            if (this.VerticalSpeed < 0) {
                this._isOnGround = true;
            }
            else {
                this.VerticalSpeed = 0;
                this._isOnGround = false;
            }
            this.Position.y = tmpInfo.optimal;
        }
        else {
            this.Position.MoveY(tmpInfo.nextDistance);
            this._isOnGround = false;
        }
    }

    private UpdateState() {
        if (!this.IsOnGround) {
            this.State = PlayerState.Jumping;
        }
        else if (this.HorizontalSpeed === 0) {
            this.State = PlayerState.Standing;
        }
        else {
            this.State = PlayerState.Running;

        }
    }

    private UpdateAnimation() {
        if (this.View && this.View.AnimationsManager) {
            switch (this.State) {
                case PlayerState.Standing:
                    this.View.AnimationsManager.StopAnimation();
                    break;
                case PlayerState.Running:
                    this.View.AnimationsManager.PlayAnimation('player-walk');
                    break;
                case PlayerState.Jumping:
                    this.View.AnimationsManager.PlayAnimation('player-jump');
                    break;
            }
        }
    }
}