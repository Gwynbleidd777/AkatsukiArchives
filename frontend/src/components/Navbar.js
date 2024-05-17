import React, { useState } from "react";
import {
  Flex,
  Box,
  Image,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Divider,
  useColorMode,
  Switch,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo1 from "../Logo/LogoB.png";
import Logo2 from "../Logo/LogoW.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate(); // Create a navigate function

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();

  const navigateToRegister = () => {
    navigate("/register");
    if (location.pathname !== "/register") {
      toggleDrawer();
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
    if (location.pathname !== "/login") {
      toggleDrawer();
    }
  };

  const navigateToHome = () => {
    navigate("/"); // Use navigate to go to the Home page
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1px"
      bg={colorMode === "dark" ? "#1A202C" : "white"}
      color={colorMode === "dark" ? "white" : "black"}
      boxShadow="0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.06)"
      overflow="auto"
      position="fixed"
      width="100%"
      zIndex="1000"
      top="0"
    >
      <Flex align="center" onClick={navigateToHome} cursor="pointer">
        {colorMode === "dark" ? (
          <Image
            src={Logo2}
            alt="Dark Logo"
            style={{ width: "210px", height: "70px" }}
          />
        ) : (
          <Image
            src={Logo1}
            alt="Light Logo"
            style={{ width: "210px", height: "70px" }}
          />
        )}
      </Flex>

      <Box
        display={{ base: "block", md: "none" }}
        onClick={toggleDrawer}
        cursor="pointer"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Drawer"
          fontSize="24px"
          color={colorMode === "dark" ? "white" : "#385A64"} // Adjust icon color
          _hover={{ color: colorMode === "dark" ? "#00DFC0" : "#00DFC0" }} // Adjust hover color
        />
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"} // Adjust background color
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                marginBottom="2"
                width="100%"
                onClick={navigateToLogin}
              >
                Sign In
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                width="100%"
                onClick={navigateToRegister}
              >
                Register
              </Button>
              <Divider my="2" />
              <Flex align="center" justify="space-between">
                <Text
                  fontSize="lg"
                  color={colorMode === "dark" ? "white" : "#385A64"}
                >
                  Dark mode
                </Text>
                <Switch
                  colorScheme="teal"
                  isChecked={colorMode === "dark"}
                  onChange={toggleColorMode}
                />
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box
        display={{ base: "none", md: "block" }}
        width={{ base: "full", md: "auto" }}
        textAlign="right"
      >
        <IconButton
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          variant="ghost"
          aria-label="Toggle Dark Mode"
          fontSize="20px"
          color={colorMode === "dark" ? "white" : "#385A64"} // Adjust icon color
          marginRight="4"
          onClick={toggleColorMode}
        />
        <Button
          colorScheme="teal"
          variant="outline"
          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"} // Adjust background color
          _hover={{
            backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
            color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
          }}
          marginRight="4"
          width="100px"
          onClick={navigateToLogin}
        >
          Sign In
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"} // Adjust background color
          _hover={{
            backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
            color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
          }}
          marginRight="10"
          width="100px"
          onClick={navigateToRegister}
        >
          Register
        </Button>
      </Box>
    </Flex>
  );
};

export default Navbar;
