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
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import AddSetModal from "./AddSetModal";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("fitness.db");

const WorkoutCards = ({ route }) => {
  const { trainingDetails } = route.params;
  const [exercise, setExercise] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [isExercisePopupVisible, setExercisePopupVisible] = useState(false);
  const [selectedExerciseMuscleGroups, setSelectedExerciseMuscleGroups] = useState([]);
  const navigation = useNavigation();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAddSetModalVisible, setAddSetModalVisible] = useState(false);

  useEffect(() => {
    createTable();
    loadExercises();
  }, []);

  const createTable = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT name FROM sqlite_master WHERE type="table" AND name="exercise";',
          [],
          (_, result) => {
            if (result.rows.length === 0) {
              // Table does not exist, create it
              tx.executeSql(
                "CREATE TABLE IF NOT EXISTS exercise (id INTEGER PRIMARY KEY, name TEXT, muscleGroups TEXT, trainingId INTEGER);",
                [],
                (_, error) => {
                  if (error) {
                    console.error("Error creating table:", error);
                  } else {
                    // Create exercise_sets table if it doesn't exist
                    tx.executeSql(
                      "CREATE TABLE IF NOT EXISTS exercise_sets (id INTEGER PRIMARY KEY, exercise_id INTEGER, repetitions INTEGER, weight REAL);",
                      [],
                      (_, error) => {
                        if (error) {
                          console.error(
                            "Error creating exercise_sets table:",
                            error
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          },
          (_, error) => {
            console.error("Error checking table existence:", error);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
      }
    );
  };

  const loadExercises = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "select e.id, e.name, e.muscleGroups, e.trainingId, s.id as setId, s.repetitions, s.weight from exercise e LEFT JOIN exercise_sets s ON e.id = s.exercise_id WHERE e.trainingId = ?;",
        [trainingDetails.id],
        (_, { rows }) => {
          const fetchedExercises = [];
          rows._array.forEach((row) => {
            const existingExercise = fetchedExercises.find(
              (exercise) => exercise.id === row.id
            );

            if (existingExercise) {
              // Exercise already exists, add set info
              existingExercise.sets.push({
                id: row.setId,
                repetitions: row.repetitions,
                weight: row.weight,
              });
            } else {
              // Exercise doesn't exist, create a new one
              fetchedExercises.push({
                id: row.id,
                name: row.name,
                muscleGroups: JSON.parse(row.muscleGroups),
                trainingId: row.trainingId,
                sets: [
                  {
                    id: row.setId,
                    repetitions: row.repetitions,
                    weight: row.weight,
                  },
                ],
              });
            }
          });

          console.log("Fetched exercises from the database:", fetchedExercises);
          setExercise(fetchedExercises);
        },
        (_, error) => {
          console.error("Error loading exercises:", error);
        }
      );
    });
  };

  const saveExercise = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO exercise (name, muscleGroups, trainingId) VALUES (?, ?, ?);",
          [
            exerciseName,
            JSON.stringify(selectedExerciseMuscleGroups),
            trainingDetails.id,
          ],
          (_, result) => {
            console.log("Exercise saved to the database:", result.insertId);

            loadExercises();

            handleClosePopup();
          },
          (_, error) => {
            console.error("Error inserting exercise:", error);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
      }
    );
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
    saveExercise();
  };

  const deleteExercise = (id) => {
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
            db.transaction(
              (tx) => {
                tx.executeSql("DELETE FROM exercise WHERE id = ?;", [id]);
              },
              null,
              loadExercises
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddSet = (set) => {
    if (selectedExercise) {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "INSERT INTO exercise_sets (exercise_id, repetitions, weight) VALUES (?, ?, ?);",
            [selectedExercise.id, set.repetitions, set.weight],
            (_, result) => {
              console.log("Set saved to the database:", result.insertId);

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
                  exercise.id === selectedExercise.id
                    ? updatedExercise
                    : exercise
                )
              );
              setAddSetModalVisible(false);
            },
            (_, error) => {
              console.error("Error inserting set:", error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
      loadExercises();
    }
  };

  const deleteSet = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM exercise_sets WHERE id = ?;", [id]);
      },
      null,
      loadExercises
    );
  };

  return (
    <View style={GlobalStyles.droidSafeArea}>
      <Icon
        name="arrow-back"
        raised
        containerStyle={styles.iconStyle}
        size={24}
        onPress={() => navigation.goBack()}
        underlayColor="yellow"
      />
      <View style={styles.container}>
        <View style={styles.trainingContainer}>
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
                    deleteExercise(item.id);
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
                                  deleteSet(set.id);
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

        {/* Set Pop-up */}
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
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
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
