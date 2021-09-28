import Player from "../models/Player";
import PlayerSVG from '../../assets/game-svgs/Player.svg'

interface IProps {
    player: Player
}

export default function PlayerView(props: IProps) {
    return (
        <img src={PlayerSVG} style={{ position: 'absolute', left: props.player.Position.x, top: props.player.Position.y }} />
    )
}