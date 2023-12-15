import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("fitness.db");

const createTrainingsTable = () =>{
    db.transaction(
        (tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, muscleGroups TEXT);"
          );
        },
      );
    };

    const getTrainings = (setTrainings) => {
        console.log("Getting trainings...");
        db.transaction(
          (tx) => {
            tx.executeSql("SELECT * FROM trainings;", [], (_, result) => {
              const fetchedTrainings = result.rows._array.map((training) => ({
                ...training,
                muscleGroups: JSON.parse(training.muscleGroups),
              }));
              console.log("Fetched trainings from the database:", fetchedTrainings);
              setTrainings(fetchedTrainings);
            });
          },
          (error) => {
            console.error("Transaction error:", error);
          }
        );
      };

      const saveTraining = (name, muscleGroups) => {
        console.log("Saving training...");
        db.transaction(
          (tx) => {
            tx.executeSql(
              "INSERT INTO trainings (name, muscleGroups) VALUES (?, ?);",
              [name, JSON.stringify(muscleGroups)],
              (_, result) => {
                console.log("Training saved to the database:", result.insertId);
              },
              (_, error) => {
                console.error("Error inserting training:", error);
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
          }
        );
      };

    export {createTrainingsTable, getTrainings, saveTraining};