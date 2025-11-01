import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('authToken');
  return token ? <Outlet /> : <Navigate to="/login" />;
};


const PublicRoutes = () => {
  const token = localStorage.getItem('authToken');
  return !token ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  return (
    <Box 
      bgGradient="linear(to-b, brand.900, brand.800)" 
      minH="100vh" 
      color="brand.200"
    >
      <Navbar />
      <Container maxW="container.xl" centerContent py={10}>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Container>
    </Box>
  );
}

export default App;