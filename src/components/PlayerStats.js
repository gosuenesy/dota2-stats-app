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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PlayerCard from "./PlayerCard";
import heroNameMap from "./heroMapName";

const PlayerStats = () => {
  const [playerStats, setPlayerStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("games");
  const [scrimOnly, setScrimOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      const [matchRes, playerRes] = await Promise.all([
        fetch(
          "https://gosuenesy.github.io/dota2-stats-app/whatthefuck_5.1-1.csv"
        ),
        fetch(
          "https://gosuenesy.github.io/dota2-stats-app/players_202505071018.csv"
        ),
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
        if (!match.player_id || !match.kda || !match.hero_played) return;
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
            };
          });

          return {
            player: playerName,
            playerId,
            heroes,
          };
        }
      );

      setPlayerStats(formattedStats);
    };

    fetchData();
  }, [scrimOnly]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = playerStats.filter(
      (player) =>
        player.player.toLowerCase().includes(lowerQuery) ||
        player.playerId.includes(lowerQuery)
    );
    setFilteredStats(filtered);
    setCurrentPage(1);
  }, [playerStats, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleScrimToggle = (e) => {
    setScrimOnly(e.target.checked);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredStats.length / rowsPerPage);

  const paginatedStats = filteredStats
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((player) => {
      const sortedHeroes = [...player.heroes].sort((a, b) => {
        const aValue = parseFloat(a[orderBy]);
        const bValue = parseFloat(b[orderBy]);
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
          label="Search Player or PiD"
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
          {paginatedStats.map((player) => (
            <Grid item xs={12} sm={6} key={player.playerId}>
              <PlayerCard
                player={player}
                orderBy={orderBy}
                order={order}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          ))}
        </Grid>

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
            <Select
              value={rowsPerPage}
              label="Rows"
              onChange={handleChangeRowsPerPage}
            >
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
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default PlayerStats;
