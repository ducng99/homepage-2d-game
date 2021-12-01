import React, { useEffect, useState } from "react"
import GameBrain from "../../models/GameBrain"

export default function DebugView() {
    const [score, setScore] = useState(0);
    
    useEffect(() => {
        GameBrain.Instance.Player.ScoreManager.Score.addListener(score => {
            setScore(score);
        });
    }, []);
    
    return (
        <div>
            Score: {score}
        </div>
    )
}