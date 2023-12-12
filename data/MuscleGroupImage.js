import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Buffer } from "@craftzdog/react-native-buffer";
// hitto et tässäki meni aikaa
import { API_URL, API_KEY, API_HOST} from '@env';


const MuscleGroupImage = ({ muscleGroups }) => {
  const [image, setImage] = useState(null);

  const fetchImage = async () => {
    try {
      if (!muscleGroups || muscleGroups.length === 0) {
        // error 404, blokataan tyhjä musclegroupimage haku
        return;
      }

      const response = await fetch(
        `${API_URL}/getImage?muscleGroups=${muscleGroups.join(",")}&color=200%2C100%2C80&transparentBackground=1`,
        {
          method: "GET",
          headers: {
            'X-RapidAPI-Key': `${API_KEY}`,
            'X-RapidAPI-Host': `${API_HOST}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      setImage(buffer.toString("base64"));
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [muscleGroups]);

  return (
    <View style={styles.container}>
      {image && (
        <Image
          style={styles.image}
          source={{
            uri: `data:image/png;base64,${image}`,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // justifyContent: "center",
   // alignItems: "center",
  },
  image: {
    width: 250,
    height: 220,
    borderRadius: 7,
  },
});

export default MuscleGroupImage;