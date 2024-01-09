import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import WorkoutCards from './WorkoutCards';
import MarkAsDoneButton from './MarkAsDone';

export default function StackNavigator() {
    const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomePage} options={{headerShown: true}} />
        <Stack.Screen
          name='Workout'
          component={WorkoutCards}
          options={({ navigation }) => ({
            headerRight: () => (
              <MarkAsDoneButton navigation={navigation} />
            ),
            headerShown: true,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})