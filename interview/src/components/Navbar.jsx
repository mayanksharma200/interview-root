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
  Divider,
} from "@mantine/core";

export default function Navbar() {
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
    <Header height={60} fixed withBorder={false} className="navbar-header">
      <Container size="xl" className="navbar-container">
        <UnstyledButton
          component={Link}
          to="/resources"
          className="navbar-logo"
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

        {token && (
          <Group className="navbar-navLinks">
            {navLinks.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-activeLink" : ""}`
                }
              >
                {name}
              </NavLink>
            ))}
          </Group>
        )}

        {token && (
          <Group className="navbar-logoutGroup navbar-logoutDesktop">
            <Button
              variant="filled"
              className="navbar-logoutButton"
              onClick={handleLogout}
              radius="md"
              size="md"
            >
              Logout
            </Button>
          </Group>
        )}

        {/*burgerMenu */}
        {token && (
          <Burger
            opened={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            size="sm"
            color="currentColor"
            className="navbar-burger"
            sx={{ "@media (min-width: 768px)": { display: "none" } }}
            aria-label="Toggle menu"
          />
        )}
      </Container>

      <AnimatePresence>
        {token && menuOpen && (
          <motion.div
            className="navbar-mobileMenu"
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
                  `navbar-mobileLink ${
                    isActive ? "navbar-mobileActiveLink" : ""
                  }`
                }
              >
                {name}
              </NavLink>
            ))}

            <Divider my="sm" />

            <Button
              variant="filled"
              className="navbar-logoutButton navbar-logoutMobile"
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
