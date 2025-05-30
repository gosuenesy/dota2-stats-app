import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

const ScrimToggle = ({ scrimOnly, onToggle }) => (
  <FormControlLabel
    control={
      <Switch checked={scrimOnly} onChange={onToggle} color="primary" />
    }
    label="Scrim"
    sx={{ mb: 1 }}
  />
);

export default ScrimToggle;
