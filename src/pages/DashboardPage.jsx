import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, VStack, useToast, Heading, HStack, Text, Box,  Modal, ModalOverlay, ModalContent, ModalHeader, 
ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Spinner, useClipboard } from '@chakra-ui/react';
import MuscleDiagram from '../components/MuscleDiagram';
import ExerciseModal from '../components/ExerciseModal';
import '../App.css';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isShowingFront, setIsShowingFront] = useState(true);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiExercises, setAiExercises] = useState([]);
  const [simulatedDate, setSimulatedDate] = useState(new Date());
  const [recoveryStates, setRecoveryStates] = useState({});
  const [loggedWorkouts, setLoggedWorkouts] = useState({});
  const toast = useToast();
  const token = localStorage.getItem('authToken');
  const [isDietGenerated, setIsDietGenerated] = useState(false);
  const [dietPlan, setDietPlan] = useState('');
  const [isDietLoading, setIsDietLoading] = useState(false);
  const { isOpen: isDietModalOpen, onOpen: onDietModalOpen, onClose: onDietModalClose } = useDisclosure();
  const { onCopy, hasCopied } = useClipboard(dietPlan); 

    useEffect(() => {
    const preloadImages = () => {
      const imageModules = import.meta.glob('../assets/highlight-*.png', { eager: true });
      Object.values(imageModules).forEach(module => {
        const img = new Image();
        img.src = module.default;
      });
    };
    preloadImages();
  }, []); 

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedDate(currentDate => new Date(currentDate.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
        if (!token) return;

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user', { headers: { Authorization: `Bearer ${token}` } });
                setUser(response.data);
            } catch (error) { console.error("Error fetching user data:", error); }
        };

        const fetchMuscleGroups = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/muscle-groups');
                setMuscleGroups(response.data);
            } catch (error) { console.error("Error fetching muscle groups:", error); }
        };

        const fetchRecoveryStates = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/recovery-states', { headers: { Authorization: `Bearer ${token}` } });
                setRecoveryStates(response.data);
            } catch (error) { console.error("Error fetching recovery states:", error); }
        };

        const fetchLoggedWorkouts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/workout-logs', { headers: { Authorization: `Bearer ${token}` } });
                const groupedLogs = response.data.reduce((acc, log) => {
                    const muscleId = log.exercise?.muscle_group_id;
                    if (muscleId) {
                        if (!acc[muscleId]) { acc[muscleId] = []; }
                        acc[muscleId].push(log);
                    }
                    return acc;
                }, {});
                setLoggedWorkouts(groupedLogs);
            } catch (error) { console.error("Error fetching logged workouts:", error); }
        };
        
        await Promise.all([
            fetchUserData(),
            fetchMuscleGroups(),
            fetchRecoveryStates(),
            fetchLoggedWorkouts()
        ]);
    };

    fetchAllData();
  }, [token]);


  const handleFlipView = () => setIsShowingFront(!isShowingFront);

  const handleNextDay = async () => {
    const loadingToast = toast({ title: "Advancing to next day...", status: "info", duration: null });
    try {
      await axios.post('http://127.0.0.1:8000/api/next-day', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get('http://127.0.0.1:8000/api/recovery-states', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setRecoveryStates(response.data);
      setLoggedWorkouts({});
      setIsDietGenerated(false); 
      setDietPlan('');           

      setSimulatedDate(currentDate => new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));

      toast({ title: "A new day has begun!", status: "success" });
    } catch (error) {
      toast({ title: "Failed to advance day.", status: "error" });
    } finally {
      toast.close(loadingToast);
    }
  };
  
 const resetTime = () => {

    setSimulatedDate(new Date());

    setLoggedWorkouts({});

    setRecoveryStates({});

    toast({
        title: "Simulation Reset",
        description: "The day has been reset to its starting state.",
        status: "info",
        duration: 3000,
        isClosable: true,
    });
};
  const handleMuscleClick = async (muscle) => {
    if (!token) return toast({ title: "Please log in.", status: "error" });
    
   const resetTime = async () => {
    setSimulatedDate(new Date());

    const loadingToast = toast({ title: "Re-syncing with server...", status: "info", duration: null });
    
    try {
        const [recoveryResponse, logsResponse] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/recovery-states', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('http://127.0.0.1:8000/api/workout-logs', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setRecoveryStates(recoveryResponse.data);

        const groupedLogs = logsResponse.data.reduce((acc, log) => {
            const muscleId = log.exercise?.muscle_group_id;
            if (muscleId) {
                if (!acc[muscleId]) { acc[muscleId] = []; }
                acc[muscleId].push(log);
            }
            return acc;
        }, {});
        setLoggedWorkouts(groupedLogs);

        toast({ title: "Time Reset!", status: "success", duration: 2000 });

    } catch (error) {
        toast({ title: "Failed to re-sync.", status: "error" });
    } finally {
        toast.close(loadingToast);
    }
};
    
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

  const handleConfirmLogs = async (pendingExercises) => {
    if (pendingExercises.length === 0) {
      closeModal();
      return;
    }

    const toastId = "log-toast";
    toast({ id: toastId, title: `Logging ${pendingExercises.length} workout(s)...`, status: "info", duration: null });

    try {
      const logPromises = pendingExercises.map(exercise => 
        axios.post('http://127.0.0.1:8000/api/workout-logs',
          { 
            exercise_name: exercise.name, 
            muscle_group_id: selectedMuscle.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(logPromises);

      const [recoveryResponse, logsResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/recovery-states', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:8000/api/workout-logs', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setRecoveryStates(recoveryResponse.data);

      const groupedLogs = logsResponse.data.reduce((acc, log) => {
          const muscleId = log.exercise?.muscle_group_id;
          if (muscleId) {
            if (!acc[muscleId]) { acc[muscleId] = []; }
            acc[muscleId].push(log);
          }
          return acc;
      }, {});
      setLoggedWorkouts(groupedLogs);
      
      toast.update(toastId, { title: "Workouts Logged!", status: "success", duration: 3000 });

    } catch (error) {
      toast.update(toastId, { title: "Log Failed", description: "There was an error saving your workouts.", status: "error", duration: 5000 });
      console.error("Error batch logging workouts:", error);
    } finally {
      closeModal();
    }
  };


  const handleDeleteLog = async (logId) => {
      try {
          await axios.delete(`http://127.0.0.1:8000/api/workout-logs/${logId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          const response = await axios.get('http://127.0.0.1:8000/api/workout-logs', {
              headers: { Authorization: `Bearer ${token}` }
          });
          const groupedLogs = response.data.reduce((acc, log) => {
              const muscleId = log.exercise?.muscle_group_id;
              if (muscleId) {
                if (!acc[muscleId]) { acc[muscleId] = []; }
                acc[muscleId].push(log);
              }
              return acc;
          }, {});
          setLoggedWorkouts(groupedLogs);
          
          toast({ title: 'Log Deleted', status: 'info', duration: 2000 });
      } catch (error) {
          toast({ title: 'Failed to delete log', status: 'error' });
          console.error("Error deleting log:", error);
      }
  };


const handleHeadClick = () => {
  const hasLoggedWorkouts = Object.values(recoveryStates).some(stage => stage > 0);

  if (!hasLoggedWorkouts) {
    toast({
      title: "Log a Workout First",
      description: "You need to log at least one workout to get a diet plan.",
      status: "info",
      isClosable: true,
    });
    return; 
  }

  onDietModalOpen();
};
const fetchDietRecommendation = async () => {
  setIsDietLoading(true);
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/diet-recommendation', 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setDietPlan(response.data.diet_plan);
    setIsDietGenerated(true); 

  } catch (error) {
    toast({ title: "AI Diet Failed", description: "Could not generate a diet plan.", status: "error" });
    console.error("Error fetching diet recommendation:", error);
  } finally {
    setIsDietLoading(false);
  }
};

const handleCloseDietModal = () => {
  onDietModalClose();
  
};

  return (

    <HStack spacing={10} align="start" w="100%" justify="center">
   <VStack spacing={4} w="500px">
    
    {Object.keys(recoveryStates).length === 0 ? (
        <Box textAlign="center" p={4} bg="rgba(0,0,0,0.3)" borderRadius="lg">
            <Heading size="md" color="gray.200">Ready to Begin?</Heading>
            <Text color="gray.400" mt={2}>Click on any muscle group to get your first AI workout!</Text>
        </Box>
    ) : (
        <Heading size="md" color="gray.400">
            {isShowingFront ? 'Front View' : 'Back View'}
        </Heading>
    )}

    <MuscleDiagram
        isShowingFront={isShowingFront}
        recoveryStates={recoveryStates}
        handleMuscleClick={handleMuscleClick}
        muscleGroups={muscleGroups}
        isDietGenerated={isDietGenerated}
         onHeadClick={handleHeadClick}
    />
</VStack>

      <VStack 
        spacing={5} 
        align="stretch" 
        w="350px"
        bg="rgba(27, 38, 59, 0.5)"
        backdropFilter="blur(10px)"
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
          <Button onClick={handleNextDay} colorScheme="purple" flex={1}>Skip to Next Day</Button>
          <Button onClick={resetTime} variant="outline" _hover={{ bg: 'brand.700' }} flex={1}>Reset Time</Button>
        </HStack>
        <Button onClick={handleFlipView} colorScheme="teal">Flip View</Button>
      </VStack>

     {isModalOpen && (
        <ExerciseModal
          muscle={selectedMuscle}
          aiExercises={aiExercises}
          loggedExercises={loggedWorkouts[selectedMuscle.id] || []} 
          onDeleteLog={handleDeleteLog}
          onClose={closeModal}
          onConfirmLogs={handleConfirmLogs}
        />
      )}

    
      <Modal isOpen={isDietModalOpen} onClose={handleCloseDietModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>AI Powered Diet Recommendation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isDietLoading ? (
              <VStack justify="center" h="150px">
                <Spinner size="xl" />
                <Text mt={4}>Generating your personalized diet plan...</Text>
              </VStack>
            ) : dietPlan ? (
              <Text style={{ whiteSpace: 'pre-wrap' }}>{dietPlan}</Text>
            ) : (
              <Text>
                Based on your user vitals and fully recovered workouts, we can generate a personalized diet plan to support muscle growth and recovery.
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleCloseDietModal}>
              Close
            </Button>
           
             {dietPlan && (
        <Button colorScheme={hasCopied ? "green" : "blue"} onClick={onCopy}>
            {hasCopied ? "Copied!" : "Copy Plan"}
        </Button>
    )}

            {!dietPlan && (
              <Button 
                colorScheme='teal' 
                onClick={fetchDietRecommendation} 
                isLoading={isDietLoading}
              >
                Generate Plan
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

    </HStack>
  );
}

export default DashboardPage;