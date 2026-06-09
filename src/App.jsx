import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Forest from './pages/Forest';
import Learn from './pages/Learn';
import Challenges from './pages/Challenges';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import DevGallery from './pages/DevGallery';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/forest" element={<Forest />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/dev/gallery" element={<DevGallery />} />
      </Routes>
    </>
  );
}
