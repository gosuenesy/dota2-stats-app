import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchQuery, onChange }) => (
  <TextField
    label="Search Player or PiD"
    variant="outlined"
    fullWidth
    value={searchQuery}
    onChange={(e) => onChange(e.target.value)}
    sx={{ mb: 2 }}
  />
);

export default SearchBar;
