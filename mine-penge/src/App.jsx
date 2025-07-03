import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import ForUnge from './pages/ForUnge'
import ForFamilier from './pages/ForFamilier'
import AIFunktioner from './pages/AIFunktioner'
import Community from './pages/Community'
import OmMinePenge from './pages/OmMinePenge'
import { PiggyBank } from '@phosphor-icons/react';

function App() {
  return (
    <Router>
      <header>
        <div className="header-inner">
          <NavLink to="/" className="logo" style={{textDecoration:'none'}}>
            <PiggyBank size={32} weight="duotone" style={{marginRight:'0.3rem'}} />
            MinePenge.dk
          </NavLink>
          <nav>
            <NavLink to="/" end>Forside</NavLink>
            <NavLink to="/for-unge">For Unge</NavLink>
            <NavLink to="/for-familier">For Familier</NavLink>
            <NavLink to="/ai">AI & Værktøjer</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/om">Om</NavLink>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/for-unge" element={<ForUnge />} />
        <Route path="/for-familier" element={<ForFamilier />} />
        <Route path="/ai" element={<AIFunktioner />} />
        <Route path="/community" element={<Community />} />
        <Route path="/om" element={<OmMinePenge />} />
      </Routes>
    </Router>
  )
}

export default App
