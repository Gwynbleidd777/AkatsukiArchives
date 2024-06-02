import React, { useState } from "react";
import {
  Flex,
  Box,
  IconButton,
  Image,
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
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo1 from "../../Logo/LogoB.png";
import Logo2 from "../../Logo/LogoW.png";
import axios from "axios";
import {
  MdShoppingBasket,
  MdMessage,
  MdPerson,
  MdDashboard,
  MdHistory,
  MdExitToApp,
} from "react-icons/md";

const AdminNavbar = () => {
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const toggleLeftDrawer = () => {
    setIsLeftDrawerOpen(!isLeftDrawerOpen);
  };

  const toggleRightDrawer = () => {
    setIsRightDrawerOpen(!isRightDrawerOpen);
  };

  const navigateToHome = () => {
    navigate("/admin-dashboard");
    if (location.pathname !== "/admin-dashboard") {
      setIsLeftDrawerOpen(false);
      setIsRightDrawerOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout"
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/");
        }, 1000);
        setTimeout(() => {
          toast({
            title: "Logged Out Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const highlightColor = colorMode === "dark" ? "#00DFC0" : "#00DFC0";
  const textColor = colorMode === "dark" ? "#FFFFFF" : "#385A64";
  const hoverColor = colorMode === "dark" ? "#00DFC0" : "lightgrey";

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
      direction="row-reverse"
    >
      <Box
        display={{ base: "block", md: "none" }}
        onClick={toggleLeftDrawer}
        cursor="pointer"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Left Drawer"
          fontSize="24px"
          color={colorMode === "dark" ? "white" : "#385A64"}
          _hover={{ color: colorMode === "dark" ? "#00DFC0" : "#00DFC0" }}
        />
      </Box>
      <Drawer
        isOpen={isRightDrawerOpen}
        placement="left"
        onClose={toggleRightDrawer}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Settings</DrawerHeader>
            <DrawerBody>
              <Flex direction="column">
                <Flex align="center" justify="space-between" mb={2}>
                  <Text fontSize="lg" color={textColor}>
                    Dark mode
                  </Text>
                  <Switch
                    colorScheme="teal"
                    isChecked={colorMode === "dark"}
                    onChange={toggleColorMode}
                  />
                </Flex>
                <Divider my="2" />
                <Stack spacing={3}>
                  {/* Profile */}
                  <Button
                    leftIcon={<MdDashboard size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/admin-dashboard"
                        ? "solid"
                        : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/admin-dashboard")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/admin-dashboard"
                        ? "bold"
                        : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/admin-dashboard"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg:
                        location.pathname === "/admin-dashboard"
                          ? null
                          : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/admin-dashboard"
                          ? "100px"
                          : "0",
                      borderBottomRightRadius:
                        location.pathname === "/admin-dashboard" ? "20px" : "0",
                    }}
                  >
                    Dashboard
                  </Button>
                  <Divider />

                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Management
                  </Text>

                  {/* My Items */}
                  <Button
                    leftIcon={<MdShoppingBasket size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/admin-items" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/admin-items")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/admin-items" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/admin-items"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg:
                        location.pathname === "/admin-items"
                          ? null
                          : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/admin-items" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/admin-items" ? "20px" : "0",
                    }}
                  >
                    Items
                  </Button>

                  {/* Messages */}
                  <Button
                    leftIcon={<MdPerson size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/admin-users" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/admin-users")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/admin-users" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/admin-users"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg:
                        location.pathname === "/admin-users"
                          ? null
                          : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/admin-users" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/admin-users" ? "20px" : "0",
                    }}
                  >
                    Users
                  </Button>
                  <Divider />

                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Activity Logs
                  </Text>

                  {/* Help & Support */}
                  <Button
                    leftIcon={<MdMessage size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/admin-messages"
                        ? "solid"
                        : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/admin-messages")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/admin-messages"
                        ? "bold"
                        : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/admin-messages"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg:
                        location.pathname === "/admin-messages"
                          ? null
                          : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/admin-messages" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/admin-messages" ? "20px" : "0",
                    }}
                  >
                    Messages
                  </Button>

                  {/* Feedback */}
                  <Button
                    leftIcon={<MdHistory size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/admin-history"
                        ? "solid"
                        : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/admin-history")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/admin-history" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/admin-history"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg:
                        location.pathname === "/admin-history"
                          ? null
                          : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/admin-history" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/admin-history" ? "20px" : "0",
                    }}
                  >
                    History
                  </Button>

                  <Divider />

                  <Button
                    leftIcon={<MdExitToApp size={30} />}
                    variant="ghost"
                    size="lg"
                    color={textColor}
                    onClick={handleLogout}
                    _hover={{ color: hoverColor }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box
        display={{ base: "block", md: "none" }}
        onClick={navigateToHome}
        cursor="pointer"
      >
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
      </Box>

      <Box
        display={{ base: "block", md: "none" }}
        onClick={toggleRightDrawer}
        cursor="pointer"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Right Drawer"
          fontSize="24px"
          color={colorMode === "dark" ? "white" : "#385A64"}
          _hover={{ color: colorMode === "dark" ? "#00DFC0" : "#00DFC0" }}
        />
      </Box>

      <Drawer
        isOpen={isLeftDrawerOpen}
        placement="right"
        onClose={toggleLeftDrawer}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navigations</DrawerHeader>
            <DrawerBody>
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
              <Divider my="2" />

              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                marginBottom="2"
                width="100%"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        height="70px"
        marginRight="3"
      >
        <IconButton
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          variant="ghost"
          aria-label="Toggle Dark Mode"
          fontSize="20px"
          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          marginRight="7"
          onClick={toggleColorMode}
        />
        <Menu>
          <MenuButton as={Avatar} cursor="pointer" size="sm" marginRight="4" />{" "}
          <MenuList>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default AdminNavbar;
