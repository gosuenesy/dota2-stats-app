import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlayerStats from "./components/PlayerPage/PlayerStats";
import OverallStats from "./components/OverallPage/OverallStats";
import TopBarNav from "./components/TopBarNav";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router basename="/dota2-stats-app">
        <TopBarNav />
        <Routes>
          <Route path="/" element={<PlayerStats />} />
          <Route path="/overall" element={<OverallStats />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
