import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, List, ListItem, HStack, VStack, Text, Box, Divider, Heading } from '@chakra-ui/react';

function ExerciseModal({ muscle, aiExercises, loggedExercises, onClose, onLogWorkout, onDeleteLog }) {
  if (!muscle) return null;

  // Create a list of names of exercises that are already logged
  const loggedExerciseNames = loggedExercises.map(log => log.exercise.name);

  return (
    <Modal isOpen={true} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        {/* The header now includes the count to guide the user */}
        <ModalHeader>{muscle.name} Workout ({loggedExercises.length} / 4 Recommended)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* --- SECTION 1: LOGGED EXERCISES --- */}
            {loggedExercises.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>Logged Today</Heading>
                <List spacing={4}>
                  {loggedExercises.map(log => (
                    <ListItem key={log.id}>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{log.exercise.name}</Text>
                        <Button size="xs" colorScheme="red" onClick={() => onDeleteLog(log.id)}>
                          Remove
                        </Button>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* --- DIVIDER --- */}
            {loggedExercises.length > 0 && <Divider />}

            {/* --- SECTION 2: AI SUGGESTIONS --- */}
            <Box>
              <Heading size="sm" mb={3}>AI Suggestions</Heading>
              <List spacing={5}>
                {aiExercises.map(exercise => {
                  const isLogged = loggedExerciseNames.includes(exercise.name);
                  return (
                    <ListItem key={exercise.name}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight={isLogged ? "normal" : "bold"} color={isLogged ? "gray.400" : "inherit"}>
                            {exercise.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">{exercise.sets} sets of {exercise.reps} reps</Text>
                          <Text fontSize="sm" color="gray.500" fontStyle="italic">{exercise.description || exercise.explanation}</Text>
                        </VStack>
                        <Box pt={1}>
                          <Button 
                            size="sm" 
                            colorScheme="green" 
                            onClick={() => onLogWorkout(exercise)}
                            // ✅ Disable the button if the exercise is already logged
                            isDisabled={isLogged}
                          >
                            {isLogged ? "Logged" : "Log It!"}
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
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ExerciseModal;