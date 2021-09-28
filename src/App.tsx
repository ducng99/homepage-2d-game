import React, { useEffect, useState } from 'react'
import './App.css'
import GameBrain from './models/GameBrain'
import PlayerView from './views/PlayerView'
import InputHandler from './InputHandler'

function App() {
    const [_, updateTick] = useState(0);
    const ForceUpdate = () => updateTick(t => t + 1)

    useEffect(() => {
        GameBrain.Instance.UpdateView = ForceUpdate;
        
        document.body.addEventListener('keydown', handleOnKeyDown);
        document.body.addEventListener('keyup', handleOnKeyUp);

        return () => {
            document.body.removeEventListener('keydown', handleOnKeyDown);
            document.body.removeEventListener('keyup', handleOnKeyUp);
        }
    }, [])

    function handleOnKeyDown(event: KeyboardEvent) {
        InputHandler.Instance.OnKeyDown(event.key);
    }

    function handleOnKeyUp(event: KeyboardEvent) {
        InputHandler.Instance.OnKeyUp(event.key);
    }

    return (
        <div className="App">
            <PlayerView player={GameBrain.Instance.Player} />
        </div>
    )
}

export default App
