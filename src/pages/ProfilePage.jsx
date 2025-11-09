import {
  Box, Button, FormControl, FormLabel, NumberInput,
  NumberInputField, Heading, Select, VStack, useToast,
  FormErrorMessage, HStack, Text 
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [formData, setFormData] = useState({
    weight: '',
    height_ft: '', 
    height_in: '',
    age: '',
    gender: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const user = response.data;
          
          const totalInches = user.height || 0;
          const feet = Math.floor(totalInches / 12);
          const inches = Math.round(totalInches % 12);

          setFormData({
            weight: user.weight || '',
            height_ft: feet || '',
            height_in: inches || '',
            age: user.age || '',
            gender: user.gender || ''
          });
        } catch (error) { console.error("Failed to fetch user data", error); }
      }
    };
    fetchUserData();
  }, []); 

  const handleChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.weight || formData.weight < 50 || formData.weight > 1000) newErrors.weight = 'Please enter a realistic weight (50-1000 lbs).';
    
    const feet = parseInt(formData.height_ft, 10);
    const inches = parseInt(formData.height_in, 10);
    if (isNaN(feet) || feet < 2 || feet > 8) newErrors.height = 'Feet must be between 2 and 8.';
    if (isNaN(inches) || inches < 0 || inches > 11) newErrors.height = 'Inches must be between 0 and 11.';

    if (!formData.age || formData.age < 13 || formData.age > 120) newErrors.age = 'Please enter a valid age (13-120).';
    if (!formData.gender) newErrors.gender = 'Please select a gender.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Invalid Data", description: "Please correct the errors before saving.", status: "warning", isClosable: true });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('authToken'); 
    
    const totalHeightInInches = (parseInt(formData.height_ft, 10) * 12) + parseInt(formData.height_in, 10);

    const submissionData = {
        weight: formData.weight,
        height: totalHeightInInches,
        age: formData.age,
        gender: formData.gender,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/user/vitals', submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Success!", description: "Your vitals have been updated.", status: "success", isClosable: true });
      navigate('/');       
    } catch (error) {
      toast({ title: "Update Failed", description: error.response?.data?.message || "There was an error saving your vitals.", status: "error", isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%" maxW="450px" bg="rgba(27, 38, 59, 0.5)" backdropFilter="blur(10px)" p={8} borderRadius="xl" border="1px solid" borderColor="brand.700" boxShadow="xl">
      <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={2}>My Vitals</Heading>

        <FormControl isInvalid={!!errors.weight}>
          <FormLabel>Weight (lbs)</FormLabel>
          <NumberInput value={formData.weight} onChange={(val) => handleChange('weight', val)}>
            <NumberInputField placeholder="e.g., 150.5" />
          </NumberInput>
          <FormErrorMessage>{errors.weight}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.height}>
          <FormLabel>Height</FormLabel>
          <HStack spacing={4}>
            <NumberInput value={formData.height_ft} onChange={(val) => handleChange('height_ft', val)}>
              <NumberInputField placeholder="Feet" />
            </NumberInput>
            <Text>ft</Text>
            <NumberInput value={formData.height_in} onChange={(val) => handleChange('height_in', val)}>
              <NumberInputField placeholder="Inches" />
            </NumberInput>
            <Text>in</Text>
          </HStack>
          <FormErrorMessage>{errors.height}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.age}>
          <FormLabel>Age</FormLabel>
          <NumberInput value={formData.age} onChange={(val) => handleChange('age', val)}>
            <NumberInputField placeholder="e.g., 25" />
          </NumberInput>
          <FormErrorMessage>{errors.age}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.gender}>
          <FormLabel>Gender</FormLabel>
          <Select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} placeholder="Select option">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <FormErrorMessage>{errors.gender}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" mt={4} isLoading={isLoading} loadingText="Saving...">
          Save Vitals
        </Button>
      </VStack>
    </Box>
  );
}

export default ProfilePage;