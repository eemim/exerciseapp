import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FitnessItems } from '../components/Context';
import { markTrainingAsDone, getCompletedTrainings } from './database';
import { useRoute } from '@react-navigation/native';
import { Icon } from "react-native-elements";

const MarkAsDoneButton = ({ navigation }) => {
  const { setWorkout } = React.useContext(FitnessItems);
  const [pressed, setPressed] = useState(false);
  const route = useRoute();

  useEffect(() => {
    
    // Check if the training is already completed
    const trainingId = route?.params?.trainingDetails?.id;
    console.log('TrainingId in MarkAsDoneButton:', trainingId);
  if (trainingId) {
    getCompletedTrainings((completedTrainings) => {
      setPressed(completedTrainings.includes(trainingId));
    });
  }
}, [route]);

const handleMarkAsDone = () => {
    // Check if the button is already pressed
    const trainingId = route?.params?.trainingDetails?.id;
    if (!pressed && trainingId) {
      // Update the workout count in the context
      setWorkout((prevWorkout) => prevWorkout + 1);
      markTrainingAsDone(trainingId);
      setPressed(true);
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handleMarkAsDone} style={{ marginRight: 15 }} disabled={pressed}>
      <Text style={{ color: pressed ? 'green' : 'blue' }}>
        {pressed ? 'Done' : 'Mark as Done'}
        {pressed && <Icon name='check' color='green'/>}
        </Text>
        
        
    </TouchableOpacity>
  );
};


export default MarkAsDoneButton;