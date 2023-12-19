import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("fitness.db");

{
  /** FITNESSCARDS.JS */
}

const createTrainingsTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, muscleGroups TEXT);"
    );
  });
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

const deleteTraining = (id, getTrainings) => {
  console.log("Deleting training...");
  db.transaction(
    (tx) => {
      tx.executeSql("DELETE FROM trainings WHERE id = ?;", [id]);
    },
    null,
    getTrainings
  );
};

{
  /** WORKOUTCARDS.JS */
}

const createWorkoutTable = () => {
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

const loadExercises = (trainingId, setExercise) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select e.id, e.name, e.muscleGroups, e.trainingId, s.id as setId, s.repetitions, s.weight from exercise e LEFT JOIN exercise_sets s ON e.id = s.exercise_id WHERE e.trainingId = ?;",
      [trainingId],
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

const saveExercise = (name, muscleGroups, trainingId) => {
  console.log("Saving exercise...");
  db.transaction(
    (tx) => {
      tx.executeSql(
        "INSERT INTO exercise (name, muscleGroups, trainingId) VALUES (?, ?, ?);",
        [name, JSON.stringify(muscleGroups), trainingId],
        (_, result) => {
          console.log("Exercise saved to the database:", result.insertId);
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

const deleteExercise = (id, loadExercises) => {
  console.log("Deleting exercise...");
  db.transaction(
    (tx) => {
      tx.executeSql(
        "DELETE FROM exercise WHERE id = ?;",
        [id],
        (_, result) => {
          console.log("Exercise deleted from the database:", id);
        },
        (_, error) => {
          console.error("Error deleting exercise:", error);
        }
      );
    },
    null,
    loadExercises,
    (error) => {
      console.error("Transaction error:", error);
    }
  );
};

{
  /** SETS */
}

const saveSet = (exerciseId, repetitions, weight) => {
  console.log("Saving set...");
  db.transaction(
    (tx) => {
      tx.executeSql(
        "INSERT INTO exercise_sets (exercise_id, repetitions, weight) VALUES (?, ?, ?);",
        [exerciseId, repetitions, weight],
        (_, result) => {
          console.log("Set saved to the database:", result.insertId);
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
};

const deleteSet = (id, loadExercises) => {
  db.transaction(
    (tx) => {
      tx.executeSql("DELETE FROM exercise_sets WHERE id = ?;", [id]);
    },
    null,
    loadExercises
  );
};

export {
  createTrainingsTable,
  getTrainings,
  saveTraining,
  deleteTraining,
  createWorkoutTable,
  loadExercises,
  saveExercise,
  deleteExercise,
  saveSet,
  deleteSet,
};
