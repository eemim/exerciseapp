import { SafeAreaView, StyleSheet, Image, Text, Pressable} from 'react-native';
import React, { useContext, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import GlobalStyles from '../components/GlobalStyles';
import { FitnessItems } from '../components/Context';

// KOODI EI KÄYTÖSSÄ VIELÄ

export default function FitScreen() {
    const route = useRoute();
    // console.log(route.params);
    const excersises = route.params.excersises;
    // console.log(current)
   // const {workout, setWorkout} = useContext(FitnessItems);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Pressable
      onPress={() => {
        setWorkout(workout+1)
      }}
      style={{
        backgroundColor: 'blue',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        width: 150,
      }}
      >
        <Text
        style={{
            textAlign:'center',
            fontWeight:'bold',
            fontSize:20,
            color:'white',
        }}
        >DONE</Text>

      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})