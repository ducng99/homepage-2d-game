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

        this.InitEntityView('/assets/entities/player.json');
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

        const nextHDistance = this.HorizontalSpeed * Renderer.Instance.TimerDelta;
        const [isCollideLeft, optimalValueLeft] = this.CollisionController.IsCollidingTerrain(BoxDirection.Left, nextHDistance);
        const [isCollideRight, optimalValueRight] = this.CollisionController.IsCollidingTerrain(BoxDirection.Right, nextHDistance);
        
        if (this.HorizontalSpeed < 0 && isCollideLeft) {
            this.Position.x = optimalValueLeft;
        }
        else if (this.HorizontalSpeed > 0 && isCollideRight) {
            this.Position.x = optimalValueRight;
        }
        else {
            this.Position.MoveX(nextHDistance);
        }

        const nextVDistance = -this.VerticalSpeed * Renderer.Instance.TimerDelta;
        const [isCollideTop, optimalValueTop] = this.CollisionController.IsCollidingTerrain(BoxDirection.Top, nextVDistance);
        const [isCollideBottom, optimalValueBottom] = this.CollisionController.IsCollidingTerrain(BoxDirection.Bottom, nextVDistance);
        
        if (this.VerticalSpeed > 0 && isCollideTop) {
            this.VerticalSpeed = -1;    // If player hit a ceiling, stop the jump and start falling
            this._isOnGround = false;
            this.Position.y = optimalValueTop;
        }
        else if (this.VerticalSpeed < 0 && isCollideBottom) {
            this._isOnGround = true;
            this.Position.y = optimalValueBottom;
        }
        else {
            this.Position.MoveY(nextVDistance);
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
                    this.View.AnimationsManager.PlayAnimation('player-stand', 300);
                    break;
                case PlayerState.Running:
                    this.View.AnimationsManager.PlayAnimation('player-walk', 150);
                    break;
                case PlayerState.Jumping:
                    this.View.AnimationsManager.PlayAnimation('player-jump');
                    break;
                default:
                    this.View.AnimationsManager.StopAnimation();
                    break;
            }
        }
    }
}