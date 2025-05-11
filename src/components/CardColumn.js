import React from "react";
import { TableCell, TableSortLabel } from "@mui/material";

const CardHeader = ({ orderBy, order, field, label, onRequestSort }) => (
  <TableCell>
    <TableSortLabel
      active={orderBy === field}
      direction={orderBy === field ? order : "asc"}
      onClick={() => onRequestSort(field)}
    >
      {label}
    </TableSortLabel>
  </TableCell>
);

export default CardHeader;
