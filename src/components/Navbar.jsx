import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Heading, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('authToken'));

   useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('authToken'));
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []); 
  
 
  const updateToken = () => {
     setToken(localStorage.getItem('authToken'));
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    updateToken(); 
    navigate('/login');
  };

  return (
    <Box bg="gray.800" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="md">Exodia</Heading>
        <Box>
          {token ? (
            <>
              <Link as={RouterLink} to="/" fontWeight="bold" mr={4}>
                Dashboard
              </Link>
              <Link as={RouterLink} to="/profile" fontWeight="bold" mr={4}>
                Profile
              </Link>
              <Button onClick={handleLogout} colorScheme="red" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link as={RouterLink} to="/login" fontWeight="bold" mr={4}>
                Login
              </Link>
              <Link as={RouterLink} to="/register" fontWeight="bold">
                Register
              </Link>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;