import React, { useContext } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Image} from 'react-native';
import FitnessCards from '../components/FitnessCards';
import GlobalStyles from '../components/GlobalStyles';
import { FitnessItems } from '../components/Context';


const HomePage = () => {
  const {workout} = useContext(FitnessItems);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.container}>
        <View style={styles.orangeContainer}>
          <Text style={styles.text}>Anabolic Archives</Text>
          <View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.wText}>{workout}</Text>
              <Text style={styles.wText}>WORKOUTS</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                width: '95%',
                height: 225,
                marginTop: 20,
                borderTopLeftRadius:5,
                borderTopRightRadius:5,
              }}
              source={require('../images/trainingpic9.jpg')}
            />
          </View>
        </View>
          <FitnessCards />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: 'black',
    flex: 1,
    marginTop:'5%',
  },
  orangeContainer: {
    backgroundColor: 'black',//'#f8a01c',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    fontWeight: '500',
  },
  wText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

export default HomePage;
