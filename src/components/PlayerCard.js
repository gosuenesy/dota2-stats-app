import React, { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
} from "@mui/material";
import CardRow from "./CardRow";
import CardColumn from "./CardColumn";

const PlayerCard = ({ player, orderBy, order, onRequestSort }) => {
  const [showMore, setShowMore] = useState(false);

  const heroesToShow = showMore
    ? player.heroes.slice(0, 20)
    : player.heroes.slice(0, 4);

  return (
    <Box
      component={Paper}
      sx={{ mb: 3, p: 2, width: "100%", maxWidth: 560, minWidth: 560 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">{player.player}</Typography>
        <Typography variant="body2" color="text.secondary">
          PiD: {player.playerId}
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <CardColumn
              field="hero"
              label="Hero"
              orderBy={orderBy}
              order={order}
              onRequestSort={onRequestSort}
            />
            <CardColumn
              field="games"
              label="Games"
              orderBy={orderBy}
              order={order}
              onRequestSort={onRequestSort}
            />
            <CardColumn
              field="winrate"
              label="Winrate"
              orderBy={orderBy}
              order={order}
              onRequestSort={onRequestSort}
            />
            <CardColumn
              field="kda"
              label="KDA"
              orderBy={orderBy}
              order={order}
              onRequestSort={onRequestSort}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {heroesToShow.map((heroData) => (
            <CardRow key={heroData.hero} heroData={heroData} />
          ))}
        </TableBody>
      </Table>
      {player.heroes.length > 5 && (
        <Box textAlign="center" mt={1}>
          <Button onClick={() => setShowMore((prev) => !prev)} size="small">
            {showMore ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PlayerCard;
