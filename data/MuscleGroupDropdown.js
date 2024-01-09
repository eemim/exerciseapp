import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import {API_URL, API_KEY, API_HOST} from '@env';

const MuscleGroupDropdown = ({ onSelectionChange }) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      const url =
        `${API_URL}/getMuscleGroups`;
       // console.log('Api url: ', url)
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":`${API_KEY}`,
          "X-RapidAPI-Host": `${API_HOST}`,
        },
      };
     // console.log('api headres: ', options.headers)

      try {
        const response = await fetch(url, options);
        const result = await response.json();
     //   console.log(result); // api data

        const data = result.map((item) => ({
          label: item,
          value: item,
        }));

        setMuscleGroups(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMuscleGroups();
  }, []);

  return (
    <View style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={muscleGroups}
        labelField="label"
        valueField="value"
        placeholder="Select Muscle Groups"
        searchPlaceholder="Search..."
        value={selectedMuscleGroups}
        onChange={(selectedItems) => {
          setSelectedMuscleGroups(selectedItems);
          onSelectionChange(selectedItems);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 60,
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginLeft: "auto",
    marginRight: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    //marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  selectedTextStyle: {
    marginRight: 5,
    fontSize: 15,
    color: "black",
  },
});

export default MuscleGroupDropdown;
