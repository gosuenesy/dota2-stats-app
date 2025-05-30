import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const TopNavBar = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Dota 2 Stats</Typography>
          <Box>
            <Button
              component={Link}
              to="/"
              color="inherit"
              variant={location.pathname === "/" ? "outlined" : "text"}
            >
              Player Stats
            </Button>
            <Button
              component={Link}
              to="/overall"
              color="inherit"
              variant={location.pathname === "/overall" ? "outlined" : "text"}
            >
              Overall Hero Stats
            </Button>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
