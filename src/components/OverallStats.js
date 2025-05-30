import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Box,
  Button,
  Grid,
  TableCell,
} from "@mui/material";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import CardRow from "./CardRow";
import CardColumn from "./CardColumn";
import SearchBar from "./SearchBar";
import ScrimToggle from "./ScrimToggle";
import heroNameMap from "./heroMapName";

const OverallStats = () => {
  const [allStats, setAllStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [orderBy, setOrderBy] = useState("games");
  const [order, setOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [scrimOnly, setScrimOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://gosuenesy.github.io/dota2-stats-app/whatthefuck_5.1-1.csv"
      );
      const text = await res.text();
      const data = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      }).data;

      const stats = {};

      data.forEach((match) => {
        if (!match.kda || !match.hero_played) return;
        if (scrimOnly && match.is_scrim !== "1") return;

        const [kills, deaths, assists] = match.kda.split("/").map(Number);
        const heroKey = match.hero_played.toLowerCase();
        const mappedHero = heroNameMap[heroKey] || heroKey;
        const result = match.result === "1";

        stats[mappedHero] = stats[mappedHero] || {
          games: 0,
          wins: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
        };

        const s = stats[mappedHero];
        s.games += 1;
        if (result) s.wins += 1;
        s.kills += kills;
        s.deaths += deaths;
        s.assists += assists;
      });

      const formatted = Object.entries(stats).map(([hero, data]) => {
        const kda =
          data.deaths === 0
            ? data.kills + data.assists
            : (data.kills + data.assists) / data.deaths;
        const winrate = (data.wins / data.games) * 100;
        return {
          hero,
          games: data.games,
          winrate: winrate.toFixed(1),
          kda: kda.toFixed(2),
        };
      });

      setAllStats(formatted);
    };

    fetchData();
  }, [scrimOnly]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allStats.filter((h) =>
      h.hero.toLowerCase().includes(lowerQuery)
    );
    setFilteredStats(filtered);
  }, [searchQuery, allStats]);

  const sortedStats = [...filteredStats].sort((a, b) => {
    const aVal = parseFloat(a[orderBy]);
    const bVal = parseFloat(b[orderBy]);
    return order === "asc" ? aVal - bVal : bVal - aVal;
  });

  const heroesToShow = showAll ? sortedStats : sortedStats.slice(0, 15);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <SearchBar
          searchQuery={searchQuery}
          onChange={setSearchQuery}
          label="Search Hero Name"
        />

        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Grid item xs={12} sm="auto">
            <ScrimToggle
              scrimOnly={scrimOnly}
              onToggle={(e) => setScrimOnly(e.target.checked)}
            />
          </Grid>
        </Grid>

        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <CardColumn
                  field="hero"
                  label="Hero"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={setOrderBy}
                />
                <CardColumn
                  field="games"
                  label="Games"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={setOrderBy}
                />
                <CardColumn
                  field="winrate"
                  label="Winrate"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={setOrderBy}
                />
                <CardColumn
                  field="kda"
                  label="KDA"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={setOrderBy}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {heroesToShow.map((heroData, index) => (
                <CardRow
                  key={heroData.hero}
                  heroData={heroData}
                  rank={index + 1}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>

        {sortedStats.length > 10 && (
          <Box textAlign="center" mt={2}>
            <Button onClick={() => setShowAll((prev) => !prev)} variant="text">
              {showAll ? "Show Less" : "Show More"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OverallStats;
