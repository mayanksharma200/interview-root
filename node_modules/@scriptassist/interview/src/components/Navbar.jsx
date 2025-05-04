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
  Collapse,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  link: {
    display: "inline-block",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    fontWeight: 600,
    color: theme.colors.gray[7],
    textDecoration: "none",
    borderBottom: "2px solid transparent",
    transition: "color 0.3s ease, border-color 0.3s ease",

    "&:hover": {
      color: theme.colors.indigo[6],
      borderBottomColor: theme.colors.indigo[6],
    },
  },

  activeLink: {
    color: theme.colors.indigo[6],
    borderBottomColor: theme.colors.indigo[6],
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    fontWeight: 800,
    fontSize: 24,
    color: theme.colors.indigo[7],
    textDecoration: "none",
  },

  mobileMenu: {
    backgroundColor: theme.white,
    borderTop: `1px solid ${theme.colors.gray[3]}`,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.md,
  },

  mobileLink: {
    display: "block",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    fontWeight: 600,
    color: theme.colors.gray[7],
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    transition: "background-color 0.3s ease, color 0.3s ease",

    "&:hover": {
      backgroundColor: theme.colors.indigo[0],
      color: theme.colors.indigo[6],
    },
  },

  mobileActiveLink: {
    backgroundColor: theme.colors.indigo[1],
    color: theme.colors.indigo[7],
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

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 360, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <Header height={60} fixed withBorder>
      <Container size="xl" style={{ height: "100%" }}>
        <Group position="apart" align="center" style={{ height: "100%" }}>
          {/*logo*/}
          <UnstyledButton
            component={Link}
            to="/resources"
            className={classes.logo}
            aria-label="SpaceXplorer Home"
          >
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width={32}
              height={32}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#4c6ef5" }}
              aria-hidden="true"
            >
              <path d="M12 2l9 21H3L12 2z" />
            </svg>
            <Text size="xl" weight={700} color="indigo.7" ml="xs">
              SpaceXplorer
            </Text>
          </UnstyledButton>

          {token && (
            <Group
              spacing="xl"
              className="desktop-nav"
              sx={{
                display: "none",
                "@media (min-width: 768px)": { display: "flex" },
              }}
            >
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

          {token && (
            <Group
              sx={{
                display: "none",
                "@media (min-width: 768px)": { display: "flex" },
              }}
            >
              <Button
                variant="outline"
                color="indigo"
                onClick={handleLogout}
                radius="md"
                size="md"
              >
                Logout
              </Button>
            </Group>
          )}
          
          {/* //burger */}
          {token && (
            <Burger
              opened={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              size="sm"
              color="#4c6ef5"
              className="mobile-burger"
              sx={{ "@media (min-width: 768px)": { display: "none" } }}
              aria-label="Toggle menu"
            />
          )}
        </Group>

        <AnimatePresence>
          {token && menuOpen && (
            <motion.div
              className={classes.mobileMenu}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
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
                variant="outline"
                color="indigo"
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
      </Container>
    </Header>
  );
}
