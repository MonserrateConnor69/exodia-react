import {
  Box, Button, FormControl, FormLabel, Input, NumberInput,
  NumberInputField, Heading, Select, VStack, useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: ''
  });
  
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken'); // We'll set this up for real later

      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Pre-fill the form with the user's current data
          setFormData({
            weight: response.data.weight || '',
            height: response.data.height || '',
            age: response.data.age || '',
            gender: response.data.gender || ''
          });
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };
    fetchUserData();
  }, []); 

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken'); 

    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to update your vitals.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/vitals', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success!",
        description: "Your vitals have been updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate('/');       

      console.log(response.data); 
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error saving your vitals.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error updating vitals:", error);
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch" w="100%" maxW="400px">
      <Heading as="h1" size="lg" textAlign="center">
        My Vitals
      </Heading>

      <FormControl>
        <FormLabel>Weight (lbs)</FormLabel>
        <NumberInput value={formData.weight} onChange={(val) => handleChange({ target: { name: 'weight', value: val } })}>
          <NumberInputField name="weight" placeholder="e.g., 150.5" />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Height (inches)</FormLabel>
        <NumberInput value={formData.height} onChange={(val) => handleChange({ target: { name: 'height', value: val } })}>
          <NumberInputField name="height" placeholder="e.g., 68.5" />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Age</FormLabel>
        <NumberInput value={formData.age} onChange={(val) => handleChange({ target: { name: 'age', value: val } })}>
          <NumberInputField name="age" placeholder="e.g., 25" />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Gender</FormLabel>
        <Select name="gender" value={formData.gender} onChange={handleChange} placeholder="Select option">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
      </FormControl>

      <Button type="submit" colorScheme="blue" mt={4}>
        Save Vitals
      </Button>
    </VStack>
  );
}

export default ProfilePage;