import { useState, useMemo } from 'react'; // Added useMemo for performance
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  List, ListItem, HStack, VStack, Text, Box, Divider, Heading
} from '@chakra-ui/react';

function ExerciseModal({ muscle, aiExercises, loggedExercises, onClose, onConfirmLogs, onDeleteLog }) {
  if (!muscle) return null;

  const [pendingLogs, setPendingLogs] = useState([]);

  // Using Sets for faster .has() lookups is a performance best practice
  const loggedExerciseNames = useMemo(() => new Set(loggedExercises.map(log => log.exercise.name)), [loggedExercises]);
  const pendingExerciseNames = useMemo(() => new Set(pendingLogs.map(ex => ex.name)), [pendingLogs]);

  const handleTogglePending = (exercise) => {
    if (pendingExerciseNames.has(exercise.name)) {
      setPendingLogs(current => current.filter(ex => ex.name !== exercise.name));
    } else {
      setPendingLogs(current => [...current, exercise]);
    }
  };

  const handleConfirm = () => {
    onConfirmLogs(pendingLogs);
  };

  return (
    <Modal isOpen={true} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.50" color="gray.800">
        <ModalHeader borderBottomWidth="1px">{muscle.name} Workout</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">

            {/* Section for items already saved to the database */}
            {loggedExercises.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>Logged Today</Heading>
                <List spacing={4}>
                  {loggedExercises.map(log => (
                    <ListItem key={log.id}>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{log.exercise.name}</Text>
                        <Button size="xs" colorScheme="red" onClick={() => onDeleteLog(log.id)}>Remove</Button>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Divider */}
            {(loggedExercises.length > 0 || pendingLogs.length > 0) && <Divider />}

            {/* ✅ NEW: A section to show what the user is about to log */}
            {pendingLogs.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="blue.600">Pending Confirmation</Heading>
                 <List spacing={3}>
                  {pendingLogs.map(exercise => (
                     <ListItem key={exercise.name}>
                       <HStack justify="space-between">
                         <Text fontWeight="semibold" color="blue.700">{exercise.name}</Text>
                         {/* This button removes it from the pending list */}
                         <Button size="xs" colorScheme="yellow" onClick={() => handleTogglePending(exercise)}>
                           Undo
                         </Button>
                       </HStack>
                     </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Divider */}
            {(loggedExercises.length > 0 || pendingLogs.length > 0) && <Divider />}

            {/* Section for AI Suggestions */}
            <Box>
              <Heading size="sm" mb={3}>AI Suggestions</Heading>
              <List spacing={5}>
                {aiExercises.map(exercise => {
                  const isLogged = loggedExerciseNames.has(exercise.name);
                  const isPending = pendingExerciseNames.has(exercise.name);

                  return (
                    <ListItem key={exercise.name}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color={isLogged ? "gray.400" : "inherit"}>
                            {exercise.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">{exercise.sets} sets of {exercise.reps} reps</Text>
                          <Text fontSize="sm" color="gray.500" fontStyle="italic">{exercise.description || exercise.explanation}</Text>
                        </VStack>
                        <Box pt={1}>
                           {/* ✅ UPDATED BUTTON LOGIC: Shows Logged, Pending, or Log It! */}
                          <Button 
                            size="sm" 
                            colorScheme={isPending ? "yellow" : "green"}
                            onClick={() => handleTogglePending(exercise)}
                            isDisabled={isLogged}
                          >
                            {isLogged ? "Logged" : (isPending ? "Pending" : "Log It!")}
                          </Button>
                        </Box>
                      </HStack>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px">
          <Button colorScheme="green" mr={3} onClick={handleConfirm} isDisabled={pendingLogs.length === 0}>
            Confirm & Close
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ExerciseModal;