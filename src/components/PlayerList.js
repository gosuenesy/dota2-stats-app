import React from "react";
import { Grid } from "@mui/material";
import PlayerCard from "./PlayerCard";

const PlayerList = ({ players, orderBy, order, onRequestSort }) => (
  <Grid container spacing={3} justifyContent="center">
    {players.map((player) => (
      <Grid item xs={12} sm={6} key={player.playerId}>
        <PlayerCard
          player={player}
          orderBy={orderBy}
          order={order}
          onRequestSort={onRequestSort}
        />
      </Grid>
    ))}
  </Grid>
);

export default PlayerList;
