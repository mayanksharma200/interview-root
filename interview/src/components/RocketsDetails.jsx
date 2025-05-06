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
    }, 3000);

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
    <Container size="md" my="xl" sx={{ paddingTop: 90, paddingBottom: 90 }}>
      <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Paper
          shadow="xl"
          radius="xl"
          p="xl"
          withBorder
          sx={{
            background:
              theme.colorScheme === "dark"
                ? "rgba(10, 10, 30, 0.85)"
                : "rgba(255, 255, 255, 0.9)",
            borderRadius: 30,
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.1)"
            }`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              theme.colorScheme === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.8)"
                : "0 12px 48px rgba(0, 0, 0, 0.12)",
            transition: "all 0.3s ease",
            borderImageSlice: 1,
            borderImageSource:
              theme.colorScheme === "dark"
                ? "linear-gradient(45deg, #6b5b95, #b8a9c9)"
                : "linear-gradient(45deg, #667eea, #764ba2)",
          }}
        >
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

          <Title
            order={1}
            mb="lg"
            weight={900}
            color={theme.colors.indigo[9]}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: 2,
            }}
          >
            {rocket.name}
          </Title>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 400,
              borderRadius: theme.radius.md,
              overflow: "hidden",
              boxShadow:
                theme.colorScheme === "dark"
                  ? "0 12px 40px rgba(0, 0, 0, 0.7)"
                  : "0 12px 40px rgba(0, 0, 0, 0.1)",
              marginBottom: theme.spacing.lg,
              border: `2px solid ${
                theme.colorScheme === "dark"
                  ? "rgba(111, 66, 193, 0.3)"
                  : "rgba(102, 126, 234, 0.3)"
              }`,
              transition: "transform 0.5s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow:
                  theme.colorScheme === "dark"
                    ? "0 20px 60px rgba(0, 0, 0, 0.9)"
                    : "0 20px 60px rgba(0, 0, 0, 0.15)",
              },
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
                  borderRadius: theme.radius.md,
                  transformOrigin: "center",
                  transition: "transform 0.5s ease",
                  transform: idx === currentIndex ? "scale(1.05)" : "scale(1)",
                }}
                initial={false}
                animate={{ opacity: idx === currentIndex ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </Box>

          <Stack
            spacing="lg"
            color={
              theme.colorScheme === "dark"
                ? theme.colors.gray[0]
                : theme.colors.dark[7]
            }
          >
            <Text
              size="md"
              mb="md"
              sx={{
                lineHeight: 1.8,
                fontWeight: 500,
                fontSize: 18,
                letterSpacing: 0.5,
                fontFamily: "'Inter', sans-serif",
                textShadow:
                  theme.colorScheme === "dark"
                    ? "0 0 6px rgba(255, 255, 255, 0.15)"
                    : "none",
              }}
            >
              {rocket.description}
            </Text>

            <Grid gutter="md" sx={{ fontWeight: 600, fontSize: 15 }}>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    First Flight:
                  </Text>{" "}
                  {new Date(rocket.first_flight).toLocaleDateString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Country:
                  </Text>{" "}
                  {rocket.country}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Company:
                  </Text>{" "}
                  {rocket.company}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Cost per Launch:
                  </Text>{" "}
                  ${rocket.cost_per_launch.toLocaleString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Success Rate:
                  </Text>{" "}
                  {rocket.success_rate_pct}%
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Stages:
                  </Text>{" "}
                  {rocket.stages}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Boosters:
                  </Text>{" "}
                  {rocket.boosters}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Mass:
                  </Text>{" "}
                  {rocket.mass.kg.toLocaleString()} kg
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Height:
                  </Text>{" "}
                  {rocket.height.meters} m
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
                    Diameter:
                  </Text>{" "}
                  {rocket.diameter.meters} m
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <Text
                    component="span"
                    weight={700}
                    color={theme.colors.indigo[7]}
                  >
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
                fontSize: 18,
                letterSpacing: 0.8,
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
