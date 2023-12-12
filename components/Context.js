import React ,{createContext, useState} from 'react';

const FitnessItems = createContext();

const FitnessContext = ({children}) => {
    const [completed, setCompleted] = useState([]);
    const [workout, setWorkout] = useState(0);

    return(
        <FitnessItems.Provider value= {{completed, setCompleted, workout, setWorkout}}>
            {children}
        </FitnessItems.Provider>
    )
}

export {FitnessContext, FitnessItems}

// KOODI EI KÄYTÖSSÄ VIELÄ