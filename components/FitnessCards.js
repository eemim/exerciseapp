import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MuscleGroupDropdown from '../data/MuscleGroupDropdown';
import { Icon } from "react-native-elements";
import MuscleGroupImage from "../data/MuscleGroupImage";
// import * as SQLite from "expo-sqlite";
import {createTrainingsTable, getTrainings, saveTraining} from './database';

//const db = SQLite.openDatabase("fitness.db");

const FitnessCards = () => {
  const navigation = useNavigation();
  const [trainings, setTrainings] = useState([]);
  const [trainingName, setTrainingName] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    createTrainingsTable();
    getTrainings(setTrainings);
  }, []);

  const handleSaveTraining = () => {
    console.log('handling save training...')
    saveTraining(trainingName, selectedMuscleGroups);
    getTrainings(setTrainings);
  };




  const deleteTraining = (id) => {
    Alert.alert(
      "Do you really want to delete this training?",
      null,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            db.transaction(
              (tx) => {
                tx.executeSql("DELETE FROM trainings WHERE id = ?;", [id]);
              },
              null,
              getTrainings
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddTraining = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setTrainingName("");
    setSelectedMuscleGroups([]);
  };

  const handleConfirm = () => {
    handleSaveTraining();
    handleClosePopup();
  };

  const handleFitnessCardPress = (training) => {
    navigation.navigate("Workout", { trainingDetails: training });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleAddTraining} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Training</Text>
      </Pressable>

      <FlatList
        data={trainings.slice().reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.trainingCard}
            onPress={() => handleFitnessCardPress(item)}
          >
            <View style={styles.trainingHeader}>
              <Text style={styles.trainingName}>{item.name}</Text>
              <Pressable
                style={styles.deleteButton}
                onPress={() => {
                  deleteTraining(item.id);
                }}
              >
                <Icon name="clear" size={22} color="red" />
              </Pressable>
            </View>
            <MuscleGroupImage muscleGroups={item.muscleGroups} />
          </Pressable>
        )}
      />

      <Modal
        transparent={true}
        animationType="slide"
        visible={isPopupVisible}
        onRequestClose={handleClosePopup}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.dropText}>Enter Training Name:</Text>
          <TextInput
            style={styles.input}
            maxLength={20}
            placeholder="Training Name"
            onChangeText={(text) => setTrainingName(text)}
            value={trainingName}
          />
          <Text style={styles.dropText}>Select Muscle Groups:</Text>
          
          <MuscleGroupDropdown
            onSelectionChange={(selectedItems) =>
              setSelectedMuscleGroups(selectedItems)
            }
            selectedItems={selectedMuscleGroups}
          />

          <Pressable onPress={handleConfirm} style={styles.confirmButton}>
            <Icon name="add" size={20} color="white" />
            <Text style={styles.confirmButtonText}>Add Training</Text>
          </Pressable>
          <Pressable onPress={handleClosePopup} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  addButton: {
    backgroundColor: "#f8a01c",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  confirmButton: {
    backgroundColor: "#f8a01c",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  input: {
    height: 50,
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom:10,
  },
  trainingName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    padding: 5,
  },
  dropText: {
    color: "white",
  },
  trainingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  trainingCard: {
    borderWidth: 3,
    borderColor: "#f8a01c",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    padding: 5,
  },
});

export default FitnessCards;
