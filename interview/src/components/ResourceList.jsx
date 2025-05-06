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
  ActionIcon,
  Tooltip,
  keyframes,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconRocket,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";

const PAGE_SIZE = 12;

const glassPulse = keyframes`
  0%, 100% { background-color: rgba(255, 255, 255, 0.1); }
  50% { background-color: rgba(255, 255, 255, 0.15); }
`;

function SkeletonCard() {
  const theme = useMantineTheme();
  return (
    <Paper
      shadow="xl"
      radius="lg"
      p="md"
      withBorder
      sx={{
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          theme.colorScheme === "dark"
            ? `rgba(255, 255, 255, 0.05)`
            : `rgba(255, 255, 255, 0.3)`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)"
        }`,
        animation: "pulse 1.8s ease-in-out infinite",
        borderRadius: 20,
      }}
    >
      <Box
        sx={{
          height: 28,
          width: "70%",
          borderRadius: 12,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
        }}
      />
      <Box
        sx={{
          height: 18,
          width: "85%",
          borderRadius: 12,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
          marginTop: 16,
        }}
      />
      <Box
        sx={{
          height: 18,
          width: "50%",
          borderRadius: 12,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
          marginTop: 12,
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

function LaunchStatusBadge({ launch }) {
  if (launch.upcoming) {
    return (
      <Badge
        color="cyan"
        variant="light"
        leftSection={<IconClock size={14} />}
        sx={{ fontWeight: 700 }}
      >
        Upcoming
      </Badge>
    );
  }
  if (launch.success === true) {
    return (
      <Badge
        color="teal"
        variant="light"
        leftSection={<IconCheck size={14} />}
        sx={{ fontWeight: 700 }}
      >
        Success
      </Badge>
    );
  }
  if (launch.success === false) {
    return (
      <Badge
        color="red"
        variant="light"
        leftSection={<IconX size={14} />}
        sx={{ fontWeight: 700 }}
      >
        Failed
      </Badge>
    );
  }
  return null;
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
    <Container
      size="lg"
      my="xl"
      px={{ base: "sm", md: "lg" }}
      sx={{ paddingTop: 80, paddingBottom:80 }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        withBorder
        sx={{
          background:
            theme.colorScheme === "dark"
              ? "rgba(20, 20, 40, 0.75)"
              : "rgba(255, 255, 255, 0.85)",
          borderRadius: 20,
          border: `1px solid ${theme.colors.indigo[5]}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Group
          position="apart"
          mb="lg"
          align="flex-end"
          spacing="md"
          noWrap={false}
          sx={{ flexWrap: "wrap" }}
        >
          <Title
            order={2}
            weight={900}
            color={theme.colors.indigo[7]}
            sx={{
              flex: "1 1 100%",
              marginBottom: 8,
              minWidth: 0,
              letterSpacing: 1.5,
            }}
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
              sx={{ flex: "1 1 auto", minWidth: 0, maxWidth: 420 }}
              aria-label="Search launches by name"
              radius="md"
              icon={
                isLoading ? (
                  <Loader size="xs" color={theme.colors.indigo[6]} />
                ) : (
                  <IconSearch
                    size={18}
                    stroke={1.5}
                    color={theme.colors.indigo[6]}
                  />
                )
              }
              styles={{
                input: {
                  fontWeight: 600,
                  fontSize: 16,
                  color:
                    theme.colorScheme === "dark" ? theme.white : theme.black,
                },
              }}
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
              color="indigo"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Search
            </Button>
          </Group>
        </Group>

        {isLoading ? (
          <SimpleGrid
            cols={3}
            spacing="xl"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </SimpleGrid>
        ) : launches.length > 0 ? (
          <SimpleGrid
            cols={3}
            spacing="xl"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            {launches.map((launch) => (
              <Paper
                key={launch.id}
                shadow="lg"
                radius="lg"
                p="md"
                withBorder
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 220,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  background:
                    theme.colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: `1px solid ${
                    theme.colorScheme === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.1)"
                  }`,
                  borderRadius: 20,
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.04)",
                    boxShadow: theme.shadows.xl,
                    animation: `${glassPulse} 3s ease-in-out infinite`,
                  },
                  [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                    minHeight: "auto",
                    flexDirection: "column",
                  },
                }}
                component={Link}
                to={`/launch/${launch.id}`}
                aria-label={`View details for ${launch.name}`}
              >
                <Stack spacing={8} mb="md" sx={{ flexGrow: 1, minHeight: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      minWidth: 0,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      weight={700}
                      color={theme.colors.indigo[7]}
                      size="xl"
                      lineClamp={1}
                      sx={{
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {launch.name}
                    </Text>
                    <Box sx={{ marginTop: 4 }}>
                      <LaunchStatusBadge launch={launch} />
                    </Box>
                  </Box>
                  <Text color="dimmed" size="sm" weight={600}>
                    {new Date(launch.date_utc).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <Text
                    color="gray"
                    size="sm"
                    sx={{
                      fontStyle: "italic",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      textOverflow: "ellipsis",
                      minHeight: 72,
                    }}
                  >
                    {launch.details || "No details available."}
                  </Text>
                </Stack>
                <Button
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  radius="md"
                  size="sm"
                  leftIcon={<IconRocket size={16} />}
                  sx={{
                    alignSelf: "flex-start",
                    marginTop: "auto",
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                      width: "100%",
                    },
                  }}
                >
                  View Details
                </Button>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Center py="xl">
            <Text color="dimmed" italic size="lg">
              No launches found.
            </Text>
          </Center>
        )}

        <Group
          position="center"
          mt="xl"
          spacing="xs"
          noWrap={false}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          <Tooltip label="Previous page" withArrow>
            <ActionIcon
              variant="filled"
              size="lg"
              disabled={!hasPrevPage}
              onClick={() => setPage(prevPage)}
              aria-label="Previous page"
              radius="xl"
              color="indigo"
              sx={{ marginBottom: 4 }}
            >
              <IconChevronLeft size={20} stroke={2} />
            </ActionIcon>
          </Tooltip>

          {pageNumbers[0] > 1 && (
            <>
              <Button
                variant="subtle"
                size="md"
                onClick={() => setPage(1)}
                aria-label="Page 1"
                radius="xl"
                sx={{ marginBottom: 4, fontWeight: 700 }}
              >
                1
              </Button>
            </>
          )}

          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "filled" : "subtle"}
              size="md"
              onClick={() => setPage(pageNum)}
              aria-current={currentPage === pageNum ? "page" : undefined}
              aria-label={`Page ${pageNum}`}
              radius="xl"
              sx={{
                marginBottom: 4,
                fontWeight: currentPage === pageNum ? 700 : 600,
                color:
                  currentPage === pageNum
                    ? theme.white
                    : theme.colors.indigo[7],
              }}
            >
              {pageNum}
            </Button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>

              <Button
                variant="subtle"
                size="md"
                onClick={() => setPage(totalPages)}
                aria-label={`Page ${totalPages}`}
                radius="xl"
                sx={{ marginBottom: 4, fontWeight: 700 }}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Tooltip label="Next page" withArrow>
            <ActionIcon
              variant="filled"
              size="lg"
              disabled={!hasNextPage}
              onClick={() => setPage(nextPage)}
              aria-label="Next page"
              radius="xl"
              color="indigo"
              sx={{ marginBottom: 4 }}
            >
              <IconChevronRight size={20} stroke={2} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
    </Container>
  );
}
