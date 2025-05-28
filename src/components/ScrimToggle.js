import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";

const ScrimToggle = ({ scrimOnly, onToggle }) => (
  <FormControlLabel
    control={
      <Checkbox checked={scrimOnly} onChange={onToggle} color="primary" />
    }
    label="Scrim"
    sx={{ mb: 3 }}
  />
);

export default ScrimToggle;
