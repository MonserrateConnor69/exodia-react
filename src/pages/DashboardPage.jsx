import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, VStack, useToast, Heading, HStack, Text, Box } from '@chakra-ui/react';
import MuscleDiagram from '../components/MuscleDiagram';
import ExerciseModal from '../components/ExerciseModal';
import '../App.css';

function DashboardPage() {
  // --- All State Variables ---
  const [user, setUser] = useState(null);
  const [isShowingFront, setIsShowingFront] = useState(true);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedWorkouts, setLoggedWorkouts] = useState({}); 
  const [aiExercises, setAiExercises] = useState([]);
  const [simulatedDate, setSimulatedDate] = useState(new Date());
  const toast = useToast();
  const token = localStorage.getItem('authToken');

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedDate(currentDate => new Date(currentDate.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) { console.error("Error fetching user data:", error); }
    };
    
    const fetchMuscleGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/muscle-groups');
        setMuscleGroups(response.data);
      } catch (error) { console.error("Error fetching muscle groups:", error); }
    };

    const fetchLoggedWorkouts = async () => {
      if (!token) return;
      try {
        const dateString = simulatedDate.toISOString().split('T')[0];
        const response = await axios.get('http://127.0.0.1:8000/api/workout-logs', {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: dateString }
        });
        setLoggedWorkouts(response.data);
      } catch (error) { console.error("Error fetching logged workouts:", error); }
    };

    fetchUserData();
    fetchMuscleGroups();
    fetchLoggedWorkouts();
  }, [token, simulatedDate.toDateString()]);

  // --- Handler Functions (All fully defined) ---
  const handleFlipView = () => setIsShowingFront(!isShowingFront);

  const handleNextDay = () => {
    setSimulatedDate(currentDate => {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    });
    toast({ title: "Skipped to the next day!", status: "info", duration: 2000 });
  };
  
  const resetTime = () => setSimulatedDate(new Date());

  const handleMuscleClick = async (muscle) => {
    if (!token) return toast({ title: "Please log in.", status: "error" });
    setSelectedMuscle(muscle);
    const loadingToast = toast({ title: "Generating AI Suggestions...", status: "info", duration: null });
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/ai/workout/${muscle.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiExercises(response.data.exercises); 
      setIsModalOpen(true);
    } catch (error) {
      toast({ title: "AI Failed", status: "error" });
    } finally {
      toast.close(loadingToast);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMuscle(null);
    setAiExercises([]);
  };

  const handleLogWorkout = async (exercise) => {
    try {
      const dateString = simulatedDate.toISOString().split('T')[0];
      const response = await axios.post('http://127.0.0.1:8000/api/workout-logs',
        { 
          exercise_name: exercise.name,
          muscle_group_id: selectedMuscle.id,
          date: dateString
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newLog = response.data.workout_log;
      setLoggedWorkouts(prev => {
        const currentLogs = prev[selectedMuscle.id] || [];
        return { ...prev, [selectedMuscle.id]: [...currentLogs, newLog] };
      });
      toast({ title: "Workout Logged!", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Log Failed", status: "error" });
      console.error("Error logging workout:", error);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/workout-logs/${logId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoggedWorkouts(prev => {
        const updatedLogs = (prev[selectedMuscle.id] || []).filter(log => log.id !== logId);
        const newState = { ...prev, [selectedMuscle.id]: updatedLogs };
        if (updatedLogs.length === 0) {
          delete newState[selectedMuscle.id];
        }
        return newState;
      });
      toast({ title: "Log removed!", status: "info", duration: 2000 });
    } catch (error) {
      toast({ title: "Failed to remove log.", status: "error" });
    }
  };

 return (
    <HStack spacing={10} align="start" w="100%" justify="center">

      {/* --- Left Side: The Muscle Diagram --- */}
      <MuscleDiagram
        isShowingFront={isShowingFront}
        workedOutMuscles={Object.fromEntries(Object.keys(loggedWorkouts).filter(id => loggedWorkouts[id] && loggedWorkouts[id].length > 0).map(id => [id, true]))}
        handleMuscleClick={handleMuscleClick}
        muscleGroups={muscleGroups}
      />

      {/* --- Right Side: The Glassmorphism Control Panel --- */}
      <VStack 
        spacing={5} 
        align="stretch" 
        w="350px"
        bg="rgba(27, 38, 59, 0.5)" // Semi-transparent background using your brand.800 color
        backdropFilter="blur(10px)" // The "frosty glass" effect
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor="brand.700"
        boxShadow="xl"
      >
        {user && <Heading size="xl" textAlign="center" mb={2}>Welcome, {user.first_name}!</Heading>}
        
        <Text fontSize="md" fontWeight="bold" textAlign="center" py={2} bg="rgba(0,0,0,0.2)" borderRadius="md">
          Simulated Time: {simulatedDate.toLocaleString()}
        </Text>

        <HStack>
          {/* This button will now use the custom style from your theme.js */}
          <Button onClick={handleNextDay} colorScheme="purple" flex={1}>Skip to Next Day</Button>
          <Button onClick={resetTime} variant="outline" _hover={{ bg: 'brand.700' }} flex={1}>Reset Time</Button>
        </HStack>
        
       <Button onClick={handleFlipView} colorScheme="teal">Flip View</Button>
      </VStack>

      {/* The Modal is not part of the main layout and will use the styles from your theme.js */}
      {isModalOpen && (
        <ExerciseModal
          muscle={selectedMuscle}
          aiExercises={aiExercises}
          loggedExercises={loggedWorkouts[selectedMuscle.id] || []} 
          onClose={closeModal}
          onLogWorkout={handleLogWorkout}
          onDeleteLog={handleDeleteLog}
        />
      )}
    </HStack>
  );
}

export default DashboardPage;