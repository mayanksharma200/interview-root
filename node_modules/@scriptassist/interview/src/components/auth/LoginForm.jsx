import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Center,
  LoadingOverlay,
  Stack,
  Anchor,
  Box,
} from "@mantine/core";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);

export default function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();
      login(data.token);
      navigate("/resources");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 0,
        },
      }}
    >
      <Container
        size={580}
        mt={110}
        px={40}
        sx={(theme) => ({
          maxWidth: 580,
          width: "100%",
          position: "relative",
          zIndex: 1,
          [theme.fn.smallerThan("sm")]: {
            maxWidth: "100%",
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
          },
        })}
      >
        <MotionPaper
          padding="xl"
          radius="lg"
          shadow="xl"
          withBorder
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          sx={(theme) => ({
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 60,
            paddingRight: 60,
            background: "rgba(255, 255, 255, 0.9)", 
            backdropFilter: "blur(20px)",
            borderColor: "rgba(0, 0, 255, 0.7)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            width: "100%",
            boxSizing: "border-box",
            [theme.fn.smallerThan("sm")]: {
              paddingLeft: theme.spacing.md,
              paddingRight: theme.spacing.md,
              borderRadius: theme.radius.md,
            },
          })}
          role="form"
          aria-labelledby="login-form-title"
        >
          <LoadingOverlay visible={loading} overlayBlur={3} />

          <Title
            id="login-form-title"
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
              fontSize: 38,
              background: "linear-gradient(90deg, #22c55e, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: theme.spacing.xl,
              textShadow: "0 2px 6px rgba(0,0,0,0.15)",
              userSelect: "none",
            })}
          >
            SpaceX Explorer
          </Title>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing="xl">
              <TextInput
                label="Username"
                placeholder="admin@spacex.com"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                required
                disabled={loading}
                autoComplete="username"
                radius="md"
                size="md"
                styles={{
                  input: {
                    backgroundColor: "#fff",
                    color: "#000",
                    borderColor: "#1e40af",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&::placeholder": {
                      color: "#3b82f6",
                    },
                    "&:focus-visible": {
                      outline: "3px solid #2563eb",
                      outlineOffset: 2,
                    },
                    "&:focus": {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 8px #2563eb",
                      backgroundColor: "#f0f9ff",
                    },
                    "&:hover": {
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 6px #3b82f6",
                    },
                  },
                  label: {
                    color: "#1e40af",
                    fontWeight: 700,
                  },
                }}
                aria-required="true"
              />

              <PasswordInput
                label="Password"
                placeholder="spacex123"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                radius="md"
                size="md"
                styles={{
                  input: {
                    backgroundColor: "#fff",
                    color: "#000",
                    borderColor: "#1e40af",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&::placeholder": {
                      color: "#3b82f6",
                    },
                    "&:focus-visible": {
                      outline: "3px solid #2563eb",
                      outlineOffset: 2,
                    },
                    "&:focus": {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 8px #2563eb",
                      backgroundColor: "#f0f9ff",
                    },
                    "&:hover": {
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 6px #3b82f6",
                    },
                  },
                  label: {
                    color: "#1e40af",
                    fontWeight: 700,
                  },
                }}
                aria-required="true"
              />

              {error && (
                <Text
                  color="red"
                  size="sm"
                  align="center"
                  weight={700}
                  sx={{ userSelect: "none" }}
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </Text>
              )}

              <MotionButton
                type="submit"
                fullWidth
                size="lg"
                radius="md"
                loading={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                sx={{
                  background: "linear-gradient(90deg, #22c55e, #3b82f6)",
                  boxShadow:
                    "0 4px 15px rgba(34, 197, 94, 0.5), 0 4px 15px rgba(59, 130, 246, 0.5)",
                  fontWeight: 700,
                  userSelect: "none",
                }}
                aria-label="Log in"
              >
                Log In
              </MotionButton>
            </Stack>
          </form>

          <Center mt="lg">
            <Text size="sm" color="#1e40af">
              Don't have an account?{" "}
              <Anchor
                href="#"
                onClick={(e) => e.preventDefault()}
                weight={600}
                sx={{
                  color: "#2563eb",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                  userSelect: "none",
                }}
              >
                Contact Admin
              </Anchor>
            </Text>
          </Center>
        </MotionPaper>
      </Container>
    </Box>
  );
}
