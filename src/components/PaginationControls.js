import React from "react";
import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const PaginationControls = ({
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <Box
    mt={4}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    flexWrap="wrap"
    gap={2}
  >
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel>Players</InputLabel>
      <Select value={rowsPerPage} label="Rows" onChange={onRowsPerPageChange}>
        {[2, 4, 8, 16, 32].map((num) => (
          <MenuItem key={num} value={num}>
            {num}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      shape="rounded"
      size="large"
    />
  </Box>
);

export default PaginationControls;
