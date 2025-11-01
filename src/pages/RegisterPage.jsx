import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, Link } from '@chakra-ui/react';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast({ title: "Passwords do not match.", status: "error" });
      return;
    }

    try {
      // This will be your registration endpoint in Laravel
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // After a successful registration, you can automatically log the user in
      localStorage.setItem('authToken', response.data.token);
      window.dispatchEvent(new Event('authChange'));
      
      toast({
        title: "Registration Successful!",
        description: "You are now logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate to the dashboard or profile page to enter vitals
      navigate('/profile'); 

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast({
        title: "Registration Error",
        description: errorMessage,
        status: "error",
      });
      console.error("Registration error:", error);
    }
  };

  return (
    <Box w="100%" maxW="400px">
      <form onSubmit={handleRegister}>
        <VStack spacing={4}>
          <Heading>Create Account</Heading>
          
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="Your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

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
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm Your Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" w="100%">
            Register
          </Button>

          <Text>
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Login here
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}

export default RegisterPage;