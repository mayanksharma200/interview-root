import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRockets } from "../api/spacex";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Table,
  ScrollArea,
  Group,
  Badge,
  Pagination,
  Center,
  Text,
  useMantineTheme,
  Box,
  Loader,
} from "@mantine/core";

const PAGE_SIZE = 10;

function SkeletonRow() {
  const theme = useMantineTheme();
  return (
    <tr>
      <td colSpan={4} style={{ padding: "1rem" }}>
        <Box
          sx={{
            height: 96,
            borderRadius: theme.radius.md,
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
      </td>
    </tr>
  );
}

export default function Rockets() {
  const theme = useMantineTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery(
    ["rockets", search, page],
    () =>
      fetchRockets(
        search ? { name: { $regex: search, $options: "i" } } : {},
        PAGE_SIZE,
        page
      ),
    { keepPreviousData: true }
  );

  const rockets = data?.docs || [];
  const {
    totalPages = 1,
    page: currentPage = 1,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  } = data || {};

  return (
    <Container size="lg" my="xl">
      <Paper
        shadow="xl"
        radius="md"
        p="xl"
        withBorder
        mt={90}
        sx={{
          background:
            theme.colorScheme === "dark"
              ? "rgba(30, 30, 50, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "saturate(180%) blur(12px)",
          WebkitBackdropFilter: "saturate(180%) blur(12px)",
          boxShadow:
            theme.colorScheme === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.7)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)"
          }`,
        }}
      >
        <Title
          order={2}
          mb="lg"
          weight={900}
          sx={{
            color: theme.colors.indigo[7],
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          Rockets
        </Title>

        <Group mb="xl" spacing="md" noWrap sx={{ flexWrap: "wrap" }}>
          <TextInput
            placeholder="Search rockets by name"
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            sx={{
              flex: "1 1 300px",
              minWidth: 280,
              "& input": {
                fontWeight: 600,
                fontSize: theme.fontSizes.md,
              },
            }}
            aria-label="Search rockets by name"
            radius="md"
            size="md"
            rightSection={isLoading ? <Loader size="xs" /> : null}
          />
          <Button
            onClick={() => {
              setPage(1);
              refetch();
            }}
            size="md"
            radius="md"
            aria-label="Search rockets"
            loading={isLoading}
            sx={{
              backgroundImage: `linear-gradient(90deg, ${theme.colors.indigo[6]}, ${theme.colors.indigo[8]})`,
              fontWeight: 700,
              letterSpacing: "0.05em",
              "&:hover": {
                backgroundImage: `linear-gradient(90deg, ${theme.colors.indigo[8]}, ${theme.colors.indigo[6]})`,
              },
            }}
          >
            Search
          </Button>
        </Group>

        <ScrollArea>
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="md"
            sx={{
              minWidth: 720,
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              thead: {
                backgroundColor: theme.colors.indigo[7],
                borderRadius: theme.radius.md,
                "& th": {
                  color: theme.white + " !important",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: theme.fontSizes.sm,
                  padding: "12px 16px",
                  letterSpacing: "0.05em",
                },
              },
              tbody: {
                tr: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.white,
                  borderRadius: theme.radius.md,
                  boxShadow: theme.shadows.xs,
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.colors.indigo[0],
                    boxShadow: theme.shadows.md,
                    transform: "translateY(-2px)",
                  },
                },
                td: {
                  padding: "12px 16px",
                  fontSize: theme.fontSizes.md,
                  color: theme.colors.dark[9],
                  wordBreak: "break-word",
                },
              },
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Active</th>
                <th>View Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))
              ) : rockets.length > 0 ? (
                rockets.map((rocket) => (
                  <tr key={rocket.id}>
                    <td
                      style={{
                        fontWeight: 700,
                        color: theme.colors.indigo[7],
                        letterSpacing: "0.03em",
                      }}
                    >
                      {rocket.name}
                    </td>
                    <td>{rocket.type}</td>
                    <td>
                      <Badge
                        color={rocket.active ? "green" : "red"}
                        variant="light"
                        size="sm"
                        radius="xl"
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {rocket.active ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="subtle"
                        color="indigo"
                        size="sm"
                        onClick={() => navigate(`/rocket/${rocket.id}`)}
                        aria-label={`View details for ${rocket.name}`}
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          transition: "color 0.3s ease",
                          "&:hover": {
                            color: theme.colors.indigo[8],
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Center py="xl">
                      <Text color="dimmed" italic>
                        No rockets found.
                      </Text>
                    </Center>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>

        <Group position="center" mt="xl" spacing="md">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrevPage}
            onClick={() => setPage(prevPage)}
            aria-label="Previous page"
            radius="xl"
            sx={{
              borderColor: theme.colors.indigo[6],
              color: theme.colors.indigo[6],
              fontWeight: 700,
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                backgroundColor: theme.colors.indigo[6],
                color: theme.white,
              },
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
            }}
          >
            Previous
          </Button>

          <Pagination
            page={currentPage}
            onChange={setPage}
            total={totalPages}
            siblings={1}
            boundaries={1}
            size="sm"
            color="indigo"
            aria-label="Pagination"
          />

          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => setPage(nextPage)}
            aria-label="Next page"
            radius="xl"
            sx={{
              borderColor: theme.colors.indigo[6],
              color: theme.colors.indigo[6],
              fontWeight: 700,
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                backgroundColor: theme.colors.indigo[6],
                color: theme.white,
              },
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
            }}
          >
            Next
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
