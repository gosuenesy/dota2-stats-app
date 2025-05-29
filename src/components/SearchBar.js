import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchQuery, onChange, label = "Search" }) => (
  <TextField
    label={label}
    variant="outlined"
    fullWidth
    value={searchQuery}
    onChange={(e) => onChange(e.target.value)}
    sx={{ mb: 2 }}
  />
);

export default SearchBar;
