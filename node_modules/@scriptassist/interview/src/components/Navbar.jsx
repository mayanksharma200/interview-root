import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Header,
  Container,
  Group,
  Burger,
  Button,
  UnstyledButton,
  Text,
  Box,
  Divider,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1100,
    background:
      theme.colorScheme === "dark"
        ? "rgba(20, 20, 40, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    boxShadow:
      theme.colorScheme === "dark"
        ? "0 4px 30px rgba(0, 0, 0, 0.7)"
        : "0 4px 30px rgba(0, 0, 0, 0.1)",
    borderBottom:
      theme.colorScheme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
  },

  container: {
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    fontWeight: 900,
    fontSize: 28,
    background:
      theme.colorScheme === "dark"
        ? "linear-gradient(45deg, #8a6bc1, #c1a9e0)"
        : "linear-gradient(45deg, #4f6ef7, #5a4ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    userSelect: "none",
    cursor: "pointer",
    textDecoration: "none",
  },

  navLinks: {
    display: "flex",
    gap: theme.spacing.lg,

    "@media (max-width: 767px)": {
      display: "none",
    },
  },

  link: {
    position: "relative",
    fontWeight: 700,
    fontSize: 16,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[3]
        : theme.colors.indigo[7],
    textDecoration: "none",
    paddingBottom: 4,
    cursor: "pointer",
    transition: "color 0.3s ease",

    "&::after": {
      content: '""',
      position: "absolute",
      width: 0,
      height: 3,
      bottom: 0,
      left: 0,
      background:
        theme.colorScheme === "dark"
          ? "linear-gradient(90deg, #6b5b95, #b8a9c9)"
          : "linear-gradient(90deg, #667eea, #764ba2)",
      borderRadius: 2,
      transition: "width 0.3s ease",
    },

    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.indigo[5]
          : theme.colors.indigo[9],
      "&::after": {
        width: "100%",
      },
    },

    "&:focus-visible": {
      outline: `2px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.indigo[5]
          : theme.colors.indigo[7]
      }`,
      outlineOffset: 4,
    },
  },

  activeLink: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[5]
        : theme.colors.indigo[9],
    fontWeight: 800,
    "&::after": {
      width: "100%",
    },
  },

  burger: {
    display: "none",
    "@media (max-width: 767px)": {
      display: "block",
    },
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[4]
        : theme.colors.indigo[7],
    transition: "color 0.3s ease",
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.indigo[6]
          : theme.colors.indigo[9],
    },
  },

  mobileMenu: {
    position: "fixed",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor:
      theme.colorScheme === "dark"
        ? "rgba(30, 30, 60, 0.85)"
        : "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    borderRadius: theme.radius.lg,
    boxShadow:
      theme.colorScheme === "dark"
        ? "0 4px 20px rgba(0, 0, 0, 0.6)"
        : "0 4px 20px rgba(0, 0, 0, 0.1)",
    border:
      theme.colorScheme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.15)"
        : "1px solid rgba(0, 0, 0, 0.1)",
    padding: theme.spacing.md,
    zIndex: 1200,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    fontWeight: 600,
    fontSize: 18,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[2]
        : theme.colors.indigo[8],
    transition: "all 0.4s ease",
    transformOrigin: "top",
  },

  mobileLink: {
    display: "block",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    fontWeight: 700,
    fontSize: 18,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[3]
        : theme.colors.indigo[7],
    borderRadius: theme.radius.md,
    textDecoration: "none",
    transition:
      "background-color 0.3s ease, color 0.3s ease, transform 0.2s ease",
    cursor: "pointer",
    boxShadow:"none",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? "rgba(75, 0, 130, 0.6)"
          : "rgba(102, 126, 234, 0.15)",
      color:
        theme.colorScheme === "dark" ? theme.white : theme.colors.indigo[9],
      transform: "scale(1.05)",
      boxShadow:
        theme.colorScheme === "dark"
          ? "0 4px 16px rgba(138, 107, 193, 0.7)"
          : "0 4px 16px rgba(102, 126, 234, 0.5)",
    },

    "&:focus-visible": {
      outline: `2px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.indigo[5]
          : theme.colors.indigo[7]
      }`,
      outlineOffset: 4,
    },
  },

  mobileActiveLink: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[7]
        : theme.colors.indigo[2],
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.indigo[9],
    boxShadow:
      theme.colorScheme === "dark"
        ? "0 0 12px 2px rgba(138, 107, 193, 0.8)"
        : "0 0 12px 2px rgba(102, 126, 234, 0.7)",
    transform: "scale(1.05)",
  },

  logoutButton: {
    fontWeight: 700,
    borderRadius: theme.radius.lg,
    border: "2px solid transparent",
    backgroundImage:
      theme.colorScheme === "dark"
        ? "linear-gradient(135deg, #8a6bc1, #b8a9c9)"
        : "linear-gradient(135deg, #667eea, #764ba2)",
    color: theme.white,
    transition: "all 0.4s ease",
    marginTop: theme.spacing.sm,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      theme.colorScheme === "dark"
        ? "0 4px 15px rgba(138, 107, 193, 0.7)"
        : "0 4px 15px rgba(102, 126, 234, 0.7)",

    "&:hover": {
      backgroundImage:
        theme.colorScheme === "dark"
          ? "linear-gradient(135deg, #b8a9c9, #8a6bc1)"
          : "linear-gradient(135deg, #764ba2, #667eea)",
      color: theme.white,
      borderColor: "transparent",
      boxShadow:
        theme.colorScheme === "dark"
          ? "0 6px 20px rgba(184, 169, 201, 0.9)"
          : "0 6px 20px rgba(118, 75, 162, 0.9)",
      transform: "scale(1.05)",
    },

    "&:focus-visible": {
      outline: `2px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.indigo[5]
          : theme.colors.indigo[7]
      }`,
      outlineOffset: 4,
    },
  },

  logoutGroup: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function Navbar() {
  const { classes, cx } = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Launches", to: "/resources" },
    { name: "Rockets", to: "/rockets" },
  ];

const menuVariants = {
  hidden: {
    opacity: 0,
    scaleY: 0,
    transformOrigin: "top",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    transformOrigin: "top",
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

  return (
    <Header height={60} className={classes.header} fixed withBorder={false}>
      <Container className={classes.container} size="xl">
        {/* Logo */}
        <UnstyledButton
          component={Link}
          to="/resources"
          className={classes.logo}
          aria-label="SpaceXplorer Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width={32}
            height={32}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "currentColor" }}
            aria-hidden="true"
          >
            <path d="M12 2l9 21H3L12 2z" />
          </svg>
          <Text size="xl" weight={700} ml="xs" sx={{ userSelect: "none" }}>
            SpaceXplorer
          </Text>
        </UnstyledButton>

        {/* Desktop nav */}
        {token && (
          <Group className={classes.navLinks}>
            {navLinks.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  cx(classes.link, { [classes.activeLink]: isActive })
                }
              >
                {name}
              </NavLink>
            ))}
          </Group>
        )}

        {/* Logout button desktop */}
        {token && (
          <Group
            className={classes.logoutGroup}
            sx={{
              display: "none",
              "@media (min-width: 768px)": { display: "flex" },
            }}
          >
            <Button
              variant="filled"
              className={classes.logoutButton}
              onClick={handleLogout}
              radius="md"
              size="md"
            >
              Logout
            </Button>
          </Group>
        )}

        {/* Burger menu */}
        {token && (
          <Burger
            opened={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            size="sm"
            color="currentColor"
            className={classes.burger}
            sx={{ "@media (min-width: 768px)": { display: "none" } }}
            aria-label="Toggle menu"
          />
        )}
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {token && menuOpen && (
          <motion.div
            className={classes.mobileMenu}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ overflow: "hidden" }}
          >
            {navLinks.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cx(classes.mobileLink, {
                    [classes.mobileActiveLink]: isActive,
                  })
                }
              >
                {name}
              </NavLink>
            ))}

            <Divider my="sm" />

            <Button
              variant="filled"
              className={classes.logoutButton}
              fullWidth
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              radius="md"
              size="md"
            >
              Logout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Header>
  );
}
