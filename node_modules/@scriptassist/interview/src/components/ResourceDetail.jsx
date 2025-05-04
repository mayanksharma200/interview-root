import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLaunchById, fetchRocketById } from "../api/spacex";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Button,
  Loader,
  Grid,
  Stack,
  Anchor,
  Box,
  useMantineTheme,
} from "@mantine/core";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ResourceDetail() {
  const theme = useMantineTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: launch, isLoading: loadingLaunch } = useQuery(
    ["launch", id],
    () => fetchLaunchById(id)
  );
  const rocketId = launch?.rocket;

  const { data: rocket, isLoading: loadingRocket } = useQuery(
    ["rocket", rocketId],
    () => fetchRocketById(rocketId),
    { enabled: !!rocketId }
  );

  if (loadingLaunch)
    return (
      <Container size="sm" my="xl" style={{ height: 256 }}>
        <Group position="center" align="center" style={{ height: "100%" }}>
          <Loader size="xl" color={theme.colors.indigo[6]} />
        </Group>
      </Container>
    );

  if (!launch)
    return (
      <Container size="sm" my="xl">
        <Paper
          shadow="md"
          radius="md"
          p="xl"
          withBorder
          style={{ textAlign: "center", backgroundColor: theme.colors.red[0] }}
        >
          <Text color={theme.colors.red[7]} weight={700} size="lg">
            Launch not found
          </Text>
        </Paper>
      </Container>
    );

  return (
    <Container size="md" my="xl">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Paper shadow="xl" radius="md" p="xl" withBorder mt={90}>
          <Group spacing={4} mb="md" aria-label="Breadcrumb" role="navigation">
            <Anchor
              component={Link}
              to="/resources"
              weight={600}
              color={theme.colors.indigo[7]}
              underline
              sx={{ "&:hover": { color: theme.colors.indigo[9] } }}
            >
              Launches
            </Anchor>
            <Text>/</Text>
            <Text weight={700} color={theme.colors.dark[7]}>
              {launch.name}
            </Text>
          </Group>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Title order={2} mb="sm" weight={900} color={theme.colors.dark[7]}>
              {launch.name}
            </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Text color="dimmed" size="sm" mb="lg">
              Date:{" "}
              <time
                dateTime={launch.date_utc}
                style={{ fontWeight: 600, color: theme.colors.dark[7] }}
              >
                {new Date(launch.date_utc).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </Text>
          </motion.div>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ marginBottom: theme.spacing.xl }}
          >
            <Title order={4} mb="sm" weight={700} color={theme.colors.dark[7]}>
              Launch Details
            </Title>
            <Text
              color={
                launch.details ? theme.colors.dark[7] : theme.colors.gray[5]
              }
              size="md"
              style={{ minHeight: 50 }}
            >
              {launch.details || <em>No details available.</em>}
            </Text>
          </motion.section>

          <section>
            <AnimatePresence>
              {loadingRocket ? (
                <motion.div
                  key="loading-rocket"
                  style={{ height: 80 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Group
                    position="center"
                    align="center"
                    style={{ height: "100%" }}
                  >
                    <Loader size="lg" color={theme.colors.indigo[6]} />
                  </Group>
                </motion.div>
              ) : rocket ? (
                <motion.div
                  key="rocket-details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                >
                  <Group position="apart" mb="md" align="center">
                    <Title order={4} weight={700} color={theme.colors.dark[7]}>
                      Rocket Details
                    </Title>
                    <Button
                      onClick={() =>
                        navigate(`/rocket/${rocket.id}`, {
                          state: {
                            launchId: launch.id,
                            launchName: launch.name,
                          },
                        })
                      }
                      radius="md"
                      size="md"
                      color="indigo"
                      aria-label={`View full details for rocket ${rocket.name}`}
                    >
                      View Full Rocket Details
                    </Button>
                  </Group>

                  <Grid gutter="md" mb="md" columns={12}>
                    <Grid.Col span={6}>
                      <Text weight={600} color={theme.colors.dark[7]} mb={4}>
                        Name
                      </Text>
                      <Text>{rocket.name}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text weight={600} color={theme.colors.dark[7]} mb={4}>
                        Type
                      </Text>
                      <Text>{rocket.type}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text weight={600} color={theme.colors.dark[7]} mb={4}>
                        Country
                      </Text>
                      <Text>{rocket.country}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text weight={600} color={theme.colors.dark[7]} mb={4}>
                        Company
                      </Text>
                      <Text>{rocket.company}</Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Text weight={600} color={theme.colors.dark[7]} mb={4}>
                        Description
                      </Text>
                      <Text color={theme.colors.gray[7]}>
                        {rocket.description}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </motion.div>
              ) : (
                <motion.p
                  key="no-rocket-info"
                  style={{ fontStyle: "italic", color: theme.colors.gray[6] }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  No rocket information available.
                </motion.p>
              )}
            </AnimatePresence>
          </section>
        </Paper>
      </motion.div>
    </Container>
  );
}
