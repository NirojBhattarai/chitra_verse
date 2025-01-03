import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/Register';
import { AuthProvider } from './context/AuthContext';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
