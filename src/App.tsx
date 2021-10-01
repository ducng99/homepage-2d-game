import { useEffect, useState } from 'react'
import './App.css'
import Renderer from './views/Renderer'

function App() {
    const [fps, setFPS] = useState(0);

    useEffect(() => {
        // Init needs to be called after Renderer has been created. So we call it here.
        Renderer.Instance.Init();

        setInterval(() => {
            setFPS(Math.floor(Renderer.Instance.FPS * 10) / 10);
        }, 1000);
    }, [])

    return (
        <div className="App">
            <div style={{ position: 'fixed', top: 10, left: 10, color: 'white', zIndex: 2 }}>FPS: {fps}</div>
        </div>
    )
}

export default App
