import {BrowserRouter, Routes, Route} from 'react-router-dom';
import InstructionPage from './pages/InstructionsPage.jsx';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';
import {UserProvider} from "./contexts/UserContext.jsx";
import AppNavbar from "./components/Navbar.jsx";

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <AppNavbar/>
                <Routes>
                    <Route path="/" element={<InstructionPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/game" element={<GamePage/>}/>
                    <Route path="/ranking" element={<RankingPage/>}/>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;