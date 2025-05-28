import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Container, Box, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import ScrimToggle from "./ScrimToggle";
import PlayerList from "./PlayerList";
import PaginationControls from "./PaginationControls";
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

        const [kills, deaths, assists] = match.kda.split("/").map(Number);
        const playerId = match.player_id;
        const hero = match.hero_played;
        const result = match.result === "1";

        stats[playerId] = stats[playerId] || {};
        stats[playerId][hero] = stats[playerId][hero] || {
          games: 0,
          wins: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
        };

        const s = stats[playerId][hero];
        s.games += 1;
        if (result) s.wins += 1;
        s.kills += kills;
        s.deaths += deaths;
        s.assists += assists;
      });

      const formatted = Object.entries(stats).map(([playerId, heroData]) => ({
        player: players[playerId] || `Unknown (${playerId})`,
        playerId,
        heroes: Object.entries(heroData).map(([hero, data]) => {
          const correct = heroNameMap[hero.toLowerCase()] || hero.toLowerCase();
          const kda =
            data.deaths === 0
              ? data.kills + data.assists
              : (data.kills + data.assists) / data.deaths;
          const winrate = (data.wins / data.games) * 100;
          return {
            hero: correct,
            games: data.games,
            winrate: winrate.toFixed(1),
            kda: kda.toFixed(2),
          };
        }),
      }));

      setPlayerStats(formatted);
    };

    fetchData();
  }, [scrimOnly]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = playerStats.filter(
      (p) =>
        (p.player.toLowerCase().includes(lowerQuery) ||
          p.playerId.includes(lowerQuery)) &&
        (!scrimOnly || p.heroes.some((hero) => hero.games > 0))
    );
    setFilteredStats(filtered);
    setCurrentPage(1);
  }, [playerStats, searchQuery, scrimOnly]);

  const sortedAndPaginated = filteredStats
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((player) => {
      const sortedHeroes = [...player.heroes].sort((a, b) => {
        const aVal = parseFloat(a[orderBy]);
        const bVal = parseFloat(b[orderBy]);
        return order === "asc" ? aVal - bVal : bVal - aVal;
      });
      return { ...player, heroes: sortedHeroes };
    });

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleScrimToggle = (e) => {
    setScrimOnly(e.target.checked);
  };

  const totalPages = Math.ceil(filteredStats.length / rowsPerPage);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dota 2 Pro Player Stats
        </Typography>

        <SearchBar query={searchQuery} onChange={setSearchQuery} />
        <ScrimToggle scrimOnly={scrimOnly} onToggle={handleScrimToggle} />
        <PlayerList
          players={sortedAndPaginated}
          order={order}
          orderBy={orderBy}
          onRequestSort={setOrderBy}
        />
        <PaginationControls
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      </Box>
    </Container>
  );
};

export default PlayerStats;
