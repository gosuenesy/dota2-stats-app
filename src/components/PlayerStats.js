import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PlayerCard from "./PlayerCard";
import heroNameMap from "./heroMapName";

const PlayerStats = () => {
  const [playerStats, setPlayerStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleStatsCount, setVisibleStatsCount] = useState(50);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("games");
  const [scrimOnly, setScrimOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [matchRes, playerRes] = await Promise.all([
        fetch("/whatthefuck_5.1-1.csv"),
        fetch("/players_202505071018.csv"),
      ]);

      const matchText = await matchRes.text();
      const playerText = await playerRes.text();

      const matchData = Papa.parse(matchText, {
        header: true,
        skipEmptyLines: true,
      }).data;

      const playerLines = playerText.trim().split("\n");
      const players = playerLines.reduce((acc, line) => {
        const [id, name] = line.split(",");
        acc[id] = name;
        return acc;
      }, {});

      const stats = {};

      matchData.forEach((match) => {
        if (scrimOnly && match.is_scrim !== "1") return;

        const playerId = match.player_id;
        const hero = match.hero_played;
        const result = match.result === "1";
        const [kills, deaths, assists] = match.kda.split("/").map(Number);

        if (!stats[playerId]) stats[playerId] = {};
        if (!stats[playerId][hero]) {
          stats[playerId][hero] = {
            games: 0,
            wins: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
          };
        }

        const heroStats = stats[playerId][hero];
        heroStats.games += 1;
        if (result) heroStats.wins += 1;
        heroStats.kills += kills;
        heroStats.deaths += deaths;
        heroStats.assists += assists;
      });

      const formattedStats = Object.entries(stats).map(
        ([playerId, heroData]) => {
          const playerName = players[playerId] || `Unknown (${playerId})`;

          const heroes = Object.entries(heroData).map(([hero, data]) => {
            const correctHeroName =
              heroNameMap[hero.toLowerCase()] || hero.toLowerCase();
            const kda =
              data.deaths === 0
                ? data.kills + data.assists
                : (data.kills + data.assists) / data.deaths;
            const winrate = (data.wins / data.games) * 100;

            return {
              hero: correctHeroName,
              games: data.games,
              winrate: winrate.toFixed(1),
              kda: kda.toFixed(2),
              rawHero: hero,
            };
          });

          return {
            player: playerName,
            heroes: heroes.sort((a, b) => b.games - a.games),
          };
        }
      );

      setPlayerStats(formattedStats);
      applyFilters(formattedStats, searchQuery);
    };

    fetchData();
  }, [scrimOnly]);

  const applyFilters = (stats, query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = stats.filter((player) =>
      player.player.toLowerCase().includes(lowerQuery)
    );
    setFilteredStats(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(playerStats, query);
    setVisibleStatsCount(50);
  };

  const handleScrimToggle = (e) => {
    setScrimOnly(e.target.checked);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStats = filteredStats
    .slice(0, visibleStatsCount)
    .map((player) => {
      const sortedHeroes = [...player.heroes].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      });

      return { ...player, heroes: sortedHeroes };
    });

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dota 2 Player Stats
        </Typography>

        <TextField
          label="Search Player"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={scrimOnly}
              onChange={handleScrimToggle}
              color="primary"
            />
          }
          label="Scrim"
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3} justifyContent="center">
          {sortedStats.map((player) => (
            <Grid item xs={12} sm={6} key={player.player}>
              <PlayerCard
                player={player}
                orderBy={orderBy}
                order={order}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default PlayerStats;
