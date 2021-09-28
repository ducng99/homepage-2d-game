import { useEffect, useState } from 'react'
import './App.css'
import GameBrain from './models/GameBrain'
import PlayerView from './views/PlayerView'
import InputHandler from './InputHandler'
import { GetFPS } from './FPSCounter'

function App() {
    const [_, updateTick] = useState(0);
    const ForceUpdate = () => updateTick(t => t + 1)
    
    const [fps, setFPS] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setFPS(GetFPS());
        }, 1000);
        
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
            <div style={{ position: 'absolute', top: 10, left: 10 }}>FPS: {fps}</div>
            <PlayerView player={GameBrain.Instance.Player} />
        </div>
    )
}

export default App
