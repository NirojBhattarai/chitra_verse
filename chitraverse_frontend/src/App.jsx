import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/Register';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
