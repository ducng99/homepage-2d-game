import { useEffect, useState } from 'react'
import './App.css'
import Renderer from './views/Renderer'
import InputHandler from './InputHandler'

function App() {
    const [_, updateTick] = useState(0);
    const ForceUpdate = () => updateTick(t => t + 1)

    const [fps, setFPS] = useState(0);

    useEffect(() => {        
        setInterval(() => {
            setFPS(Math.floor(Renderer.Instance.FPS * 10) / 10);
        }, 1000);

        //GameBrain.Instance.UpdateView = ForceUpdate;

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
            <div style={{ position: 'fixed', top: 10, left: 10, color: 'white', zIndex: 2 }}>FPS: {fps}</div>
        </div>
    )
}

export default App
