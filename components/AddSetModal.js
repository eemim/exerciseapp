import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";

const AddSetModal = ({ isVisible, onClose, onAddSet, selectedExerciseId }) => {
  const [repetitions, setRepetitions] = useState("");
  const [weight, setWeight] = useState("");

  const handleAddSet = () => {
    if (repetitions && weight && selectedExerciseId) {
      const newSet = {
        repetitions: parseInt(repetitions, 10),
        weight: parseFloat(weight),
      };
      onAddSet(newSet);

      setRepetitions("");
      setWeight("");

      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Repetitions:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter repetitions"
            keyboardType="numeric"
            value={repetitions}
            onChangeText={(text) => setRepetitions(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight"
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
          />
        </View>
        <Pressable style={styles.addButton} onPress={handleAddSet}>
          <Icon name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Set</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "white",
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: 200,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
  },
  addButton: {
    backgroundColor: "#f8a01c",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
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
});

export default AddSetModal;
