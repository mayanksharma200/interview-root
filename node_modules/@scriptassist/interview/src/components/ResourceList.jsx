import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLaunches } from "../api/spacex";
import { Link } from "react-router-dom";
import {
  Container,
  TextInput,
  Button,
  Title,
  Group,
  Text,
  Loader,
  Center,
  Paper,
  Box,
  SimpleGrid,
  useMantineTheme,
  Stack,
} from "@mantine/core";

const PAGE_SIZE = 12;

function SkeletonCard() {
  const theme = useMantineTheme();
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      withBorder
      sx={{
        height: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      }}
    >
      <Box
        sx={{
          height: 20,
          width: "60%",
          borderRadius: theme.radius.sm,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          height: 14,
          width: "80%",
          borderRadius: theme.radius.sm,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          height: 14,
          width: "40%",
          borderRadius: theme.radius.sm,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
    </Paper>
  );
}

export default function ResourceList() {
  const theme = useMantineTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery(
    ["launches", search, page],
    () =>
      fetchLaunches(
        search ? { name: { $regex: search, $options: "i" } } : {},
        PAGE_SIZE,
        page
      ),
    { keepPreviousData: true }
  );

  const launches = data?.docs || [];
  const {
    totalPages = 1,
    page: currentPage = 1,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  } = data || {};

  const maxPageButtons = 5;

  function getPageNumbers(currentPage, totalPages, maxButtons = 5) {
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxButtons);
    } else if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages, maxPageButtons);

  return (
    <Container size="lg" my="xl" px={{ base: "sm", md: "lg" }}>
      <Paper shadow="xl" radius="md" p="xl" withBorder mt={90}>
        <Group
          position="apart"
          mb="md"
          align="flex-end"
          spacing="md"
          noWrap={false}
          sx={{ flexWrap: "wrap" }}
        >
          <Title
            order={2}
            weight={900}
            color={theme.colors.indigo[7]}
            sx={{ flex: "1 1 100%", marginBottom: 8, minWidth: 0 }}
          >
            SpaceX Launches
          </Title>
          <Group
            spacing="sm"
            noWrap={false}
            sx={{ flex: "1 1 auto", minWidth: 280, flexWrap: "wrap" }}
          >
            <TextInput
              placeholder="Search launches by name"
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setPage(1);
              }}
              size="md"
              sx={{ flex: "1 1 auto", minWidth: 0, maxWidth: 400 }}
              aria-label="Search launches by name"
              radius="md"
              icon={
                isLoading ? (
                  <Loader size="xs" color={theme.colors.indigo[6]} />
                ) : null
              }
            />
            <Button
              onClick={() => {
                setPage(1);
                refetch();
              }}
              size="md"
              radius="md"
              aria-label="Search launches"
              loading={isLoading}
              sx={{ flex: "0 0 auto", marginTop: 4 }}
            >
              Search
            </Button>
          </Group>
        </Group>

        {isLoading ? (
          <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </SimpleGrid>
        ) : launches.length > 0 ? (
          <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            {launches.map((launch) => (
              <Paper
                key={launch.id}
                shadow="sm"
                radius="md"
                p="md"
                withBorder
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 180,
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: theme.shadows.md,
                  },
                }}
              >
                <Stack spacing={6} mb="md" style={{ flexGrow: 1 }}>
                  <Text
                    weight={700}
                    color={theme.colors.indigo[7]}
                    size="lg"
                    lineClamp={1}
                  >
                    {launch.name}
                  </Text>
                  <Text color="dimmed" size="sm">
                    {new Date(launch.date_utc).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <Text color="gray" size="sm" lineClamp={3}>
                    {launch.details || "No details available."}
                  </Text>
                </Stack>
                <Button
                  component={Link}
                  to={`/launch/${launch.id}`}
                  variant="light"
                  color="indigo"
                  radius="md"
                  size="sm"
                  aria-label={`View details for ${launch.name}`}
                >
                  View Details
                </Button>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Center py="xl">
            <Text color="dimmed" italic>
              No launches found.
            </Text>
          </Center>
        )}

        {/*pgno*/}
        <Group
          position="center"
          mt="xl"
          spacing="xs"
          noWrap={false}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrevPage}
            onClick={() => setPage(prevPage)}
            aria-label="Previous page"
            radius="xl"
            sx={{ marginBottom: 4 }}
          >
            Previous
          </Button>

          {pageNumbers[0] > 1 && (
            <>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setPage(1)}
                aria-label="Page 1"
                radius="xl"
                sx={{ marginBottom: 4 }}
              >
                1
              </Button>
              {pageNumbers[0] > 2 && (
                <Text size="sm" sx={{ marginBottom: 4 }}>
                  ...
                </Text>
              )}
            </>
          )}

          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "filled" : "subtle"}
              size="sm"
              onClick={() => setPage(pageNum)}
              aria-current={currentPage === pageNum ? "page" : undefined}
              aria-label={`Page ${pageNum}`}
              radius="xl"
              sx={{ marginBottom: 4 }}
            >
              {pageNum}
            </Button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <Text size="sm" sx={{ marginBottom: 4 }}>
                  ...
                </Text>
              )}
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setPage(totalPages)}
                aria-label={`Page ${totalPages}`}
                radius="xl"
                sx={{ marginBottom: 4 }}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => setPage(nextPage)}
            aria-label="Next page"
            radius="xl"
            sx={{ marginBottom: 4 }}
          >
            Next
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}