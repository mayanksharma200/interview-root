import React, { useEffect } from "react";
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
  useMantineTheme,
  Divider,
  Skeleton,
  Box,
} from "@mantine/core";

const fadeInScale = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function SkeletonDetail() {
  return (
    <Stack spacing="md" style={{ marginTop: 100, paddingBottom: 80 }}>
      <Skeleton height={40} width="60%" radius="md" />
      <Skeleton height={24} width="30%" radius="xl" />
      <Skeleton height={20} width="40%" radius="sm" />
      <Skeleton height={100} radius="md" />
      <Skeleton height={30} width="50%" radius="xl" />
      <Skeleton height={150} radius="md" />
    </Stack>
  );
}

const glassCardStyle = (theme) => ({
  background:
    theme.colorScheme === "dark"
      ? "rgba(20, 20, 30, 0.75)"
      : "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 24,
  border: `1.5px solid ${theme.colors.indigo[5]}`,
  boxShadow:
    theme.colorScheme === "dark"
      ? "0 8px 32px rgba(31, 38, 135, 0.37)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
  color: theme.colorScheme === "dark" ? theme.white : theme.black,
  padding: theme.spacing.xl,
  marginTop: theme.spacing.xl,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
});

const badgeColors = {
  upcoming: "cyan",
  success: "teal",
  failed: "red",
};

function LaunchStatusBadge({ launch }) {
  if (launch.upcoming) {
    return (
      <Badge
        color={badgeColors.upcoming}
        variant="filled"
        leftSection={<i className="fas fa-clock" style={{ marginRight: 6 }} />}
        sx={(theme) => ({
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontSize: 14,
          padding: "8px 16px",
          borderRadius: 30,
          boxShadow: `0 0 8px ${theme.colors.cyan[5]}`,
          backgroundColor: theme.colors.cyan[7],
        })}
      >
        Upcoming
      </Badge>
    );
  }
  if (launch.success === true) {
    return (
      <Badge
        color={badgeColors.success}
        variant="filled"
        leftSection={<i className="fas fa-check" style={{ marginRight: 6 }} />}
        sx={(theme) => ({
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontSize: 14,
          padding: "8px 16px",
          borderRadius: 30,
          boxShadow: `0 0 8px ${theme.colors.teal[5]}`,
          backgroundColor: theme.colors.teal[7],
        })}
      >
        Success
      </Badge>
    );
  }
  if (launch.success === false) {
    return (
      <Badge
        color={badgeColors.failed}
        variant="filled"
        leftSection={<i className="fas fa-times" style={{ marginRight: 6 }} />}
        sx={(theme) => ({
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontSize: 14,
          padding: "8px 16px",
          borderRadius: 30,
          boxShadow: `0 0 8px ${theme.colors.red[5]}`,
          backgroundColor: theme.colors.red[7],
        })}
      >
        Failed
      </Badge>
    );
  }
  return null;
}

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loadingLaunch)
    return (
      <Container
        size="md"
        my="xl"
        px="md"
        style={{ marginTop: 100, paddingBottom: 80 }}
      >
        <SkeletonDetail />
      </Container>
    );

  if (!launch)
    return (
      <Container size="sm" my="xl">
        <Paper
          shadow="xl"
          radius="md"
          p="xl"
          withBorder
          style={{
            textAlign: "center",
            backgroundColor: theme.colors.red[0],
            boxShadow: `0 0 20px ${theme.colors.red[5]}`,
          }}
        >
          <Text color={theme.colors.red[7]} weight={700} size="lg">
            Launch not found
          </Text>
        </Paper>
      </Container>
    );

  return (
    <Container
      size="md"
      my="xl"
      px="md"
      style={{ marginTop: 100, paddingBottom: 80 }}
    >
      <motion.div initial="hidden" animate="visible" variants={fadeInScale}>
        <Paper sx={glassCardStyle(theme)} withBorder>
          {/* Breadcrumb */}
          <Group
            spacing={6}
            mb="md"
            aria-label="Breadcrumb"
            role="navigation"
            sx={{ userSelect: "none" }}
          >
            <Anchor
              component={Link}
              to="/resources"
              weight={600}
              color={theme.colors.indigo[7]}
              underline
              sx={{
                "&:hover": { color: theme.colors.indigo[9] },
                fontSize: 14,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
                textShadow:
                  theme.colorScheme === "dark"
                    ? "0 0 6px rgba(99, 102, 241, 0.8)"
                    : "none",
              }}
            >
              Launches
            </Anchor>
            <Text
              color={theme.colors.indigo[4]}
              sx={{ fontWeight: 700, letterSpacing: 2 }}
            >
              /
            </Text>
            <Text
              weight={700}
              color={theme.colorScheme === "dark" ? theme.white : theme.black}
              sx={{
                fontSize: 14,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 800,
                textShadow:
                  theme.colorScheme === "dark"
                    ? "0 0 8px rgba(99, 102, 241, 0.9)"
                    : "none",
              }}
            >
              {launch.name}
            </Text>
          </Group>

          <Group
            mb="md"
            sx={(theme) => ({
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              [theme.fn.smallerThan("sm")]: {
                flexDirection: "column",
                alignItems: "flex-start",
              },
            })}
          >
            <Title
              order={2}
              weight={900}
              color={theme.colorScheme === "dark" ? theme.white : theme.black}
              sx={{
                letterSpacing: 3,
                fontFamily: "'Poppins', sans-serif",
                textShadow:
                  theme.colorScheme === "dark"
                    ? "0 0 12px rgba(99, 102, 241, 0.9)"
                    : "none",
              }}
            >
              {launch.name}
            </Title>
            <Box
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  marginTop: theme.spacing.sm,
                  marginBottom: theme.spacing.sm,
                },
              })}
            >
              <LaunchStatusBadge launch={launch} />
            </Box>
          </Group>

          {/* Date */}
          <Text
            color={theme.colors.indigo[4]}
            size="sm"
            weight={600}
            mb="lg"
            sx={{
              letterSpacing: 1.5,
              fontStyle: "italic",
              fontWeight: 700,
              textShadow:
                theme.colorScheme === "dark"
                  ? "0 0 6px rgba(99, 102, 241, 0.7)"
                  : "none",
            }}
          >
            Date:{" "}
            <time dateTime={launch.date_utc}>
              {new Date(launch.date_utc).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </Text>

          <Stack spacing="xs" mb="xl">
            <Title
              order={4}
              weight={700}
              color={theme.colorScheme === "dark" ? theme.white : theme.black}
              sx={{ letterSpacing: 2 }}
            >
              Launch Details
            </Title>
            <Text
              color={
                launch.details
                  ? theme.colorScheme === "dark"
                    ? theme.white
                    : theme.black
                  : theme.colors.gray[5]
              }
              size="md"
              sx={{
                minHeight: 60,
                fontStyle: launch.details ? "normal" : "italic",
                fontWeight: 600,
                lineHeight: 1.5,
                textShadow:
                  theme.colorScheme === "dark"
                    ? "0 0 4px rgba(255, 255, 255, 0.15)"
                    : "none",
              }}
            >
              {launch.details || "No details available."}
            </Text>
          </Stack>

          <Divider my="xl" variant="dashed" />

          <AnimatePresence>
            {loadingRocket ? (
              <motion.div
                key="loading-rocket"
                style={{ height: 100 }}
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
                <Group position="apart" mb="md" align="center" noWrap>
                  <Title
                    order={4}
                    weight={700}
                    color={
                      theme.colorScheme === "dark" ? theme.white : theme.black
                    }
                    sx={{ letterSpacing: 2 }}
                  >
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
                    radius="xl"
                    size="md"
                    color="indigo"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    aria-label={`View full details for rocket ${rocket.name}`}
                    sx={(theme) => ({
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: theme.white,
                      boxShadow: "0 6px 20px rgba(0, 123, 255, 0.6)",
                      transition: "box-shadow 0.3s ease",
                      padding: "14px 32px",
                      minWidth: 200,
                      fontSize: 16,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      [theme.fn.smallerThan("sm")]: {
                        width: "100%",
                        fontSize: 14,
                        padding: "12px 16px",
                        minWidth: "auto",
                        whiteSpace: "normal",
                        textAlign: "center",
                        wordBreak: "break-word",
                      },
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 123, 255, 0.9)",
                      },
                    })}
                  >
                    View Full Details
                  </Button>
                </Group>

                <Grid gutter="md" mb="md" columns={12}>
                  {[
                    { label: "Name", value: rocket.name },
                    { label: "Type", value: rocket.type },
                    { label: "Country", value: rocket.country },
                    { label: "Company", value: rocket.company },
                  ].map(({ label, value }) => (
                    <Grid.Col key={label} span={6}>
                      <Text
                        weight={700}
                        color={
                          theme.colorScheme === "dark"
                            ? theme.white
                            : theme.black
                        }
                        mb={6}
                        sx={{
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          textShadow:
                            theme.colorScheme === "dark"
                              ? "0 0 6px rgba(99, 102, 241, 0.7)"
                              : "none",
                        }}
                      >
                        {label}
                      </Text>
                      <Text
                        size="md"
                        color={theme.colors.indigo[4]}
                        sx={{
                          fontWeight: 600,
                          textShadow:
                            theme.colorScheme === "dark"
                              ? "0 0 4px rgba(255, 255, 255, 0.15)"
                              : "none",
                        }}
                      >
                        {value}
                      </Text>
                    </Grid.Col>
                  ))}
                  <Grid.Col span={12}>
                    <Text
                      weight={700}
                      color={
                        theme.colorScheme === "dark" ? theme.white : theme.black
                      }
                      mb={6}
                      sx={{
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        textShadow:
                          theme.colorScheme === "dark"
                            ? "0 0 6px rgba(99, 102, 241, 0.7)"
                            : "none",
                      }}
                    >
                      Description
                    </Text>
                    <Text
                      color={
                        theme.colorScheme === "dark"
                          ? theme.colors.gray[3]
                          : theme.colors.dark[3]
                      }
                      size="md"
                      sx={{
                        lineHeight: 1.7,
                        fontWeight: 600,
                        textShadow:
                          theme.colorScheme === "dark"
                            ? "0 0 4px rgba(255, 255, 255, 0.15)"
                            : "none",
                      }}
                    >
                      {rocket.description}
                    </Text>
                  </Grid.Col>
                </Grid>
              </motion.div>
            ) : (
              <motion.p
                key="no-rocket-info"
                style={{
                  fontStyle: "italic",
                  color: theme.colors.gray[6],
                  textAlign: "center",
                  marginTop: theme.spacing.md,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No rocket information available.
              </motion.p>
            )}
          </AnimatePresence>
        </Paper>
      </motion.div>
    </Container>
  );
}
