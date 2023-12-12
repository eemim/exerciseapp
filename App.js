
import { StyleSheet, Text, View} from 'react-native';
import StackNavigator from './components/StackNavigator';
import { FitnessContext } from './components/Context';

export default function App() {
  return (
    <FitnessContext>
    <StackNavigator />
    </FitnessContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});