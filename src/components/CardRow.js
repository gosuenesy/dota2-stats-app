import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { green, red, grey, orange } from "@mui/material/colors";
import heroMapName from "./heroMapName";
import heroDisplayNames from "./heroDisplayNames";

const getWinrateColor = (winrate) => {
  if (winrate >= 60) return green[500];
  if (winrate >= 55) return green[300];
  if (winrate >= 50) return orange[200];
  if (winrate >= 40) return red[300];
  return red[500];
};

const getKDAColor = (kda) => {
  if (kda >= 4) return green[500];
  if (kda >= 3) return green[300];
  if (kda >= 2) return orange[200];
  if (kda >= 1) return red[300];
  return red[500];
};

const CardRow = ({ heroData, rank }) => {
  const { hero, games, winrate, kda } = heroData;
  const lowerHero = hero.toLowerCase();
  const mappedHero = heroMapName[lowerHero] || lowerHero;
  const displayName = heroDisplayNames[lowerHero] || hero;

  const imageUrl = `https://cdn.dota2.com/apps/dota2/images/heroes/${mappedHero}_sb.png`;

  return (
    <TableRow>
      {rank !== undefined && <TableCell>{rank}</TableCell>}
      <TableCell>
        <img
          src={imageUrl}
          style={{
            maxWidth: "30px",
            height: "auto",
            marginRight: "8px",
            verticalAlign: "middle",
          }}
        />
        {displayName}
      </TableCell>
      <TableCell>{games}</TableCell>
      <TableCell sx={{ color: getWinrateColor(parseFloat(winrate)) }}>
        {winrate}%
      </TableCell>
      <TableCell sx={{ color: getKDAColor(parseFloat(kda)) }}>{kda}</TableCell>
    </TableRow>
  );
};

export default CardRow;
