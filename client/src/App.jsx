import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import InstructionPage from './pages/InstructionsPage.jsx';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';
import {UserProvider, useUser} from "./contexts/UserContext.jsx";
import AppNavbar from "./components/Navbar.jsx";

function ProtectedRoute({ children }) {
    const { user } = useUser();
    // If not logged in, redirect to login page
    if (!user) return <Navigate to="/login" />;
    // If logged in, render the page normally
    return children;
}
function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <AppNavbar/>
                <Routes>
                    <Route path="/" element={<InstructionPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/game" element={
                        <ProtectedRoute>
                             <GamePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/ranking" element={
                        <ProtectedRoute>
                            <RankingPage/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;