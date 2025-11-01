import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Heading, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // This effect listens for changes to localStorage from other tabs/windows
   useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('authToken'));
    };

    // Listen for our custom event
    window.addEventListener('authChange', handleAuthChange);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []); // The empty dependency array means this runs only once.
  
  // This function is needed to update the navbar immediately on login/logout
  // We will call this from LoginPage and when the logout button is clicked
  const updateToken = () => {
     setToken(localStorage.getItem('authToken'));
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    updateToken(); // Update the state to re-render the navbar
    navigate('/login');
  };

  return (
    <Box bg="gray.800" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="md">Exodia</Heading>
        <Box>
          {token ? (
            // Logged-in user links
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
            // Logged-out user links
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

// Exporting the component so other files can use it.
export default Navbar;