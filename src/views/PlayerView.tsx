import Player from "../models/Player";
import PlayerSVG from '../../assets/game-svgs/Player.svg'
import { Direction } from "../models/Movable";

interface IProps {
    player: Player
}

export default function PlayerView(props: IProps) {
    const style: React.CSSProperties = {
        position: 'absolute',
        width: '4rem',
        height: '8rem',
        left: props.player.Position.x,
        top: props.player.Position.y,
        transform: `scaleX(${props.player.Direction === Direction.Left ? -1 : 1})`
    }

    return (
        <img src={PlayerSVG} style={style} />
    )
}