// FlightContext.jsx
import React, { createContext, useContext, useState } from "react";

// 1. Create context
const FlightContext = createContext(null);

// 2. Provide context to the tree
export const FlightProvider = ({ children }) => {
  const [flightData, setFlightData] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  return (
    <FlightContext.Provider value={{ flightData, setFlightData, selectedSeat, setSelectedSeat }}>
      {children}
    </FlightContext.Provider>
  );
};

// 3. Custom hook to use context
export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error("useFlight must be used within a FlightProvider");
  }
  return context;
};
