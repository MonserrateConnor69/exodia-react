import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Text,
  Link
} from '@chakra-ui/react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        email: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem('authToken', token);
      window.dispatchEvent(new Event('authChange'));

      toast({
        title: 'Login Successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      
      window.location.href = '/';

    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Please check your email and password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Login error:", error.response); 
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch" w="100%" maxW="400px">
      <Heading as="h1" size="lg" textAlign="center">
        Login
      </Heading>

      <FormControl isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <Button type="submit" colorScheme="blue" mt={4}>
        Login
      </Button> 

      <Text>
        Don't have an account?{' '}
        <Link as={RouterLink} to="/register" color="blue.500">
          Register here
        </Link>
      </Text>
    </VStack>
  );
}

export default LoginPage;