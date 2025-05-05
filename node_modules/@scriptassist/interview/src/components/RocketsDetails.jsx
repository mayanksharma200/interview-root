import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRocketById } from "../api/spacex";
import { motion } from "framer-motion";
import {
  Container,
  Paper,
  Title,
  Text,
  Grid,
  Anchor,
  Breadcrumbs,
  Stack,
  useMantineTheme,
  Box,
} from "@mantine/core";

export default function RocketDetail() {
  const theme = useMantineTheme();
  const { id } = useParams();
  const location = useLocation();

  const launchId = location.state?.launchId;
  const launchName = location.state?.launchName;

  const {
    data: rocket,
    isLoading,
    error,
  } = useQuery(["rocket", id], () => fetchRocketById(id), { enabled: !!id });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [rocket]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!rocket?.flickr_images?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rocket.flickr_images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [rocket]);

  const skeletonVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  if (isLoading)
    return (
      <Container size="md" my="xl">
        <Paper shadow="xl" radius="md" p="xl" withBorder>
          <Stack spacing="md">
            <motion.div
              style={{
                height: 48,
                width: "33%",
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.gray[3],
              }}
              variants={skeletonVariants}
              animate="pulse"
            />
            <motion.div
              style={{
                height: 384,
                width: "100%",
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.gray[3],
              }}
              variants={skeletonVariants}
              animate="pulse"
            />
            <motion.div
              style={{
                height: 24,
                width: "100%",
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.gray[3],
              }}
              variants={skeletonVariants}
              animate="pulse"
            />
            <motion.div
              style={{
                height: 24,
                width: "100%",
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.gray[3],
              }}
              variants={skeletonVariants}
              animate="pulse"
            />
            <motion.div
              style={{
                height: 24,
                width: "66%",
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.gray[3],
              }}
              variants={skeletonVariants}
              animate="pulse"
            />
          </Stack>
        </Paper>
      </Container>
    );

  if (error)
    return (
      <Container size="md" my="xl">
        <Paper shadow="xl" radius="md" p="xl" withBorder>
          <motion.div
            style={{
              textAlign: "center",
              color: theme.colors.red[7],
              fontWeight: 600,
            }}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Error loading rocket details.
          </motion.div>
        </Paper>
      </Container>
    );

  if (!rocket)
    return (
      <Container size="md" my="xl">
        <Paper shadow="xl" radius="md" p="xl" withBorder>
          <motion.div
            style={{ textAlign: "center" }}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Rocket not found.
          </motion.div>
        </Paper>
      </Container>
    );

  const items = [
    launchId && launchName
      ? { title: "Launches", to: "/resources" }
      : { title: "Rockets", to: "/rockets" },
  ];

  if (launchId && launchName) {
    items.push({ title: launchName, to: `/launch/${launchId}` });
  }

  items.push({ title: rocket.name });

  const breadcrumbs = items.map((item, index) =>
    item.to ? (
      <Anchor
        component={Link}
        to={item.to}
        key={index}
        underline={false}
        sx={(theme) => ({
          fontWeight: 600,
          color: theme.colors.indigo[7],
          "&:hover": { color: theme.colors.indigo[9] },
          whiteSpace: "nowrap",
        })}
      >
        {item.title}
      </Anchor>
    ) : (
      <Text key={index} weight={700} color="dark" sx={{ whiteSpace: "nowrap" }}>
        {item.title}
      </Text>
    )
  );

  return (
    <Container size="md" my="xl">
      <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Paper shadow="xl" radius="md" p="xl" withBorder mt={90}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: theme.spacing.xs,
              marginBottom: theme.spacing.md,
            }}
            aria-label="Breadcrumb navigation"
          >
            <Breadcrumbs
              separator="/"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.xs,
              }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>

          <Title order={1} mb="lg" weight={900} color={theme.colors.dark[7]}>
            {rocket.name}
          </Title>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 384,
              borderRadius: theme.radius.md,
              overflow: "hidden",
              boxShadow: theme.shadows.lg,
              marginBottom: theme.spacing.lg,
            }}
          >
            {rocket.flickr_images.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt={`${rocket.name} image ${idx + 1}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: idx === currentIndex ? "auto" : "none",
                  opacity: idx === currentIndex ? 1 : 0,
                }}
                initial={false}
                animate={{ opacity: idx === currentIndex ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </Box>

          <Stack spacing="md" color={theme.colors.dark[7]}>
            <Text size="md" mb="md" sx={{ lineHeight: 1.6 }}>
              {rocket.description}
            </Text>

            <Grid gutter="md">
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    First Flight:
                  </Text>{" "}
                  {new Date(rocket.first_flight).toLocaleDateString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Country:
                  </Text>{" "}
                  {rocket.country}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Company:
                  </Text>{" "}
                  {rocket.company}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Cost per Launch:
                  </Text>{" "}
                  ${rocket.cost_per_launch.toLocaleString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Success Rate:
                  </Text>{" "}
                  {rocket.success_rate_pct}%
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Stages:
                  </Text>{" "}
                  {rocket.stages}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Boosters:
                  </Text>{" "}
                  {rocket.boosters}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Mass:
                  </Text>{" "}
                  {rocket.mass.kg.toLocaleString()} kg
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Height:
                  </Text>{" "}
                  {rocket.height.meters} m
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Diameter:
                  </Text>{" "}
                  {rocket.diameter.meters} m
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text component="span" weight={700}>
                    Landing Legs:
                  </Text>{" "}
                  {rocket.landing_legs.number} (
                  {rocket.landing_legs.material || "N/A"})
                </Text>
              </Grid.Col>
            </Grid>

            <Anchor
              href={rocket.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              weight={700}
              color="indigo"
              underline
              sx={{
                marginTop: theme.spacing.md,
                display: "inline-block",
                "&:hover": { color: theme.colors.indigo[8] },
              }}
            >
              Wikipedia
            </Anchor>
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
}
