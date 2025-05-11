import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import heroDisplayNames from "./heroDisplayNames";

const CardRow = ({ heroData }) => {
  const { hero, games, winrate, kda, rawHero } = heroData;
  const theme = useTheme();

  const imageUrl = `https://cdn.dota2.com/apps/dota2/images/heroes/${hero}_sb.png`;

  const getWinrateColor = () => {
    const rate = parseFloat(winrate);
    if (rate >= 60) return theme.palette.success.main;
    if (rate >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getKdaColor = () => {
    const value = parseFloat(kda);
    if (value >= 4) return theme.palette.success.main;
    if (value >= 2) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <TableRow>
      <TableCell>
        <img
          src={imageUrl}
          alt={rawHero}
          style={{
            maxWidth: "30px",
            height: "auto",
            marginRight: "8px",
            verticalAlign: "middle",
          }}
        />
        {heroDisplayNames[hero] || hero}
      </TableCell>
      <TableCell>{games}</TableCell>
      <TableCell sx={{ color: getWinrateColor() }}>{winrate}%</TableCell>
      <TableCell sx={{ color: getKdaColor() }}>{kda}</TableCell>
    </TableRow>
  );
};

export default CardRow;
