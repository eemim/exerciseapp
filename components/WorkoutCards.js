import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import MuscleGroupDropdown from "../data/MuscleGroupDropdown";
import MuscleGroupImage from "../data/MuscleGroupImage";
import GlobalStyles from "./GlobalStyles";
import { Icon } from "react-native-elements";
import AddSetModal from "./AddSetModal";
import {
  createWorkoutTable,
  loadExercises,
  saveExercise,
  deleteExercise,
  saveSet,
  deleteSet,
} from "./database";

const WorkoutCards = ({ route }) => {
  const { trainingDetails } = route.params;
  const [exercise, setExercise] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [isExercisePopupVisible, setExercisePopupVisible] = useState(false);
  const [selectedExerciseMuscleGroups, setSelectedExerciseMuscleGroups] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAddSetModalVisible, setAddSetModalVisible] = useState(false);

  useEffect(() => {
    createWorkoutTable();
    loadExercises(trainingDetails.id, setExercise);
  }, []);

  const handleSaveExercise = () => {
    saveExercise(
      exerciseName,
      selectedExerciseMuscleGroups,
      trainingDetails.id
    );
    // Update the state with the new exercise
    loadExercises(trainingDetails.id, setExercise);
  };

  const handleAddExercise = () => {
    setExercisePopupVisible(true);
  };

  const handleClosePopup = () => {
    setExercisePopupVisible(false);
    setExerciseName("");
    setSelectedExerciseMuscleGroups([]);
  };

  const handleConfirm = () => {
    handleSaveExercise();
    handleClosePopup();
  };

  const handleDeleteExercise = (id) => {
    Alert.alert(
      "Do you really want to delete this exercise?",
      null,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteExercise(id, () =>
              loadExercises(trainingDetails.id, setExercise)
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddSet = (set) => {
    if (selectedExercise) {
      saveSet(selectedExercise.id, set.repetitions, set.weight);

      // Update the selected exercise with the new set
      const updatedExercise = {
        ...selectedExercise,
        sets: [...(selectedExercise.sets || []), set], // Add the new set
        setsInfo: [
          ...(selectedExercise.setsInfo || []),
          `${set.repetitions} X ${set.weight}kg`,
        ], // Update setsInfo
      };

      // Update the exercise in the state
      setExercise((prevExercise) =>
        prevExercise.map((exercise) =>
          exercise.id === selectedExercise.id ? updatedExercise : exercise
        )
      );
      setAddSetModalVisible(false);

      loadExercises(trainingDetails.id, setExercise);
    }
  };

  const handleDeleteSet = (id) => {
    deleteSet(id, () => loadExercises(trainingDetails.id, setExercise));
  };

  return (
    <View style={GlobalStyles.droidSafeArea}>
      {/*
      <Icon
        name="arrow-back"
        raised
        containerStyle={styles.iconStyle}
        size={24}
        onPress={() => navigation.goBack()}
        underlayColor="yellow"
  /> */}
      <View style={styles.container}>
        <View style={styles.trainingContainer}>
          <Text style={{ color: "white" }}>{trainingDetails.dateAdded}</Text>
          <Text style={styles.textStyle}>Training: {trainingDetails.name}</Text>
          <MuscleGroupImage muscleGroups={trainingDetails.muscleGroups} />
        </View>

        {/* Workout Cards */}
        <View style={styles.workoutContainer}>
          <Text style={styles.textStyle}>Workout Exercises:</Text>
          <FlatList
            data={exercise}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.exerciseCard}>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    handleDeleteExercise(item.id);
                  }}
                >
                  <Icon name="clear" size={22} color="red" />
                </Pressable>

                <View style={styles.exerciseCardHeader}>
                  <Text style={styles.exerciseCardName}>{item.name}</Text>
                </View>
                <View style={styles.exerciseCardBody}>
                  <MuscleGroupImage muscleGroups={item.muscleGroups} />
                  <View style={styles.setsInfoContainer}>
                    {item.sets &&
                    item.sets.length > 0 &&
                    item.sets[0].id !== null &&
                    item.sets[0].repetitions !== null &&
                    item.sets[0].weight !== null
                      ? item.sets
                          .slice()
                          .reverse()
                          .map((set, setIndex) => (
                            <View key={setIndex} style={styles.setRow}>
                              <Text
                                style={styles.setTextStyle}
                                key={setIndex}
                              >{`${set.repetitions} X ${set.weight}kg`}</Text>
                              <Pressable
                                style={styles.deleteSetButton}
                                onPress={() => {
                                  handleDeleteSet(set.id);
                                }}
                              >
                                <Icon name="clear" size={14} color="red" />
                              </Pressable>
                            </View>
                          ))
                      : null}
                  </View>
                </View>
                <Pressable
                  style={styles.addSetButton}
                  onPress={() => {
                    setSelectedExercise(item);
                    setAddSetModalVisible(true);
                  }}
                >
                  <Icon name="add" raised reverse color="#f8a01c" size={18} />
                </Pressable>
              </View>
            )}
          />
        </View>

        {/* Exercise Pop-up */}

        <Modal
          transparent={true}
          animationType="slide"
          visible={isExercisePopupVisible}
          onRequestClose={() => setExercisePopupVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.dropText}>Enter Exercise:</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={exerciseName}
              onChangeText={(text) => setExerciseName(text)}
            />
            <Text style={styles.dropText}>Select Muscle Groups:</Text>
            <MuscleGroupDropdown
              onSelectionChange={(selectedItems) =>
                setSelectedExerciseMuscleGroups(selectedItems)
              }
              selectedItems={selectedExerciseMuscleGroups}
            />

            <Pressable onPress={handleConfirm} style={styles.confirmButton}>
              <Icon name="add" size={20} color="white" />
              <Text style={styles.confirmButtonText}>Add Exercise</Text>
            </Pressable>
            <Pressable
              onPress={() => setExercisePopupVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Modal>

        {/* Set Pop-up*/}

        <AddSetModal
          isVisible={isAddSetModalVisible}
          onClose={() => setAddSetModalVisible(false)}
          onAddSet={handleAddSet}
          selectedExerciseId={selectedExercise ? selectedExercise.id : null}
        />
      </View>

      <Pressable style={styles.addExerciseIcon} onPress={handleAddExercise}>
        <Icon name="fitness-center" raised reverse size={30} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  setTextStyle: {
    fontSize: 15,
  },
  trainingContainer: {
    //justifyContent: "center",
    alignItems: "center",
    marginBottom: -10,
    backgroundColor: "black",
  },
  iconStyle: {
    position: "absolute",
    left: 5,
    top: 80,
  },
  workoutContainer: {
    flex: 1,
    marginTop: 250,
    backgroundColor: "black",
    padding: 10,
  },
  exerciseCard: {
    borderWidth: 3,
    borderColor: "#f8a01c",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  exerciseCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  exerciseCardName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  setsInfoContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    marginVertical: 5,
    marginLeft: "70%",
    position: "absolute",
    top: "10%",
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  addSetButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  deleteSetButton: {
    marginLeft: 10,
  },
  addExerciseIcon: {
    position: "absolute",
    bottom: 25,
    left: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  input: {
    height: 50,
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  dropText: {
    color: "white",
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
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutCards;
