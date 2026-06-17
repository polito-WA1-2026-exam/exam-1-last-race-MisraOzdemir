import { useState, useEffect } from 'react';
import SetupPhase from "../components/game/SetupPhase.jsx";
import PlanningPhase from "../components/game/PlanningPhase.jsx";
import ExecutionPhase from "../components/game/ExecutionPhase.jsx";
import ResultPhase from "../components/game/ResultPhase.jsx";

function GamePage() {
    // Which phase we're in
    const [phase, setPhase] = useState('setup');

    // Full network data from backend
    const [network, setNetwork] = useState(null);

    // Start and end stations assigned by server
    const [gameData, setGameData] = useState(null);

    // Route the player builds during planning
    const [playerRoute, setPlayerRoute] = useState([]);

    // Final execution result (steps + score)
    const [executionResult, setExecutionResult] = useState(null);

    // Each time this increments, useEffect re-runs and fetches a new game
    const [gameKey, setGameKey] = useState(0);

    useEffect(() => {
        fetch('http://localhost:3001/api/games/start', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setNetwork({
                    stations: data.stations,
                    lines: data.lines,
                    segments: data.segments
                });
                setGameData({
                    startStation: data.startStation,
                    endStation: data.endStation
                });
            })
            .catch(err => console.error(err));
    }, [gameKey]);

    // Show loading until data arrives
    if (!network || !gameData) return <p>Loading...</p>;

    // Render the correct phase
    return (
        <div>
            {phase === 'setup' &&
                <SetupPhase
                    network={network}
                    onStart={() => setPhase('planning')}
                />}
            {phase === 'planning' &&
                <PlanningPhase
                    network={network}
                    gameData={gameData}
                    playerRoute={playerRoute}
                    setPlayerRoute={setPlayerRoute}
                    onSubmit={() => setPhase('execution')}
                />}
            {phase === 'execution' &&
                <ExecutionPhase
                    playerRoute={playerRoute}
                    gameData={gameData}
                    onFinish={(result) => {
                        setExecutionResult(result);
                        setPhase('result');
                    }}
                />}
            {phase === 'result' &&
                <ResultPhase
                    result={executionResult}
                    onRestart={() => {
                        setPhase('setup');
                        setPlayerRoute([]);
                        setExecutionResult(null);
                        setNetwork(null);
                        setGameData(null);
                        setGameKey(prev => prev + 1);
                    }}
                />}
        </div>
    );
}

export default GamePage;