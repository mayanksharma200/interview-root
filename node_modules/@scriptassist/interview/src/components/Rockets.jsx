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
  Loader, // <-- add this import
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
      <Paper shadow="xl" radius="md" p="xl" withBorder mt={90}>
        <Title order={2} mb="lg" weight={900} color={theme.colors.indigo[7]}>
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
            sx={{ flex: "1 1 300px", minWidth: 280 }}
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
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.colors.indigo[0],
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
                      style={{ fontWeight: 700, color: theme.colors.indigo[7] }}
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

        <Group position="center" mt="xl">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrevPage}
            onClick={() => setPage(prevPage)}
            aria-label="Previous page"
            radius="xl"
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
          >
            Next
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}