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
  MdHelp,
  MdFeedback,
  MdPerson,
} from "react-icons/md";

const ProfileNavbar = () => {
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
    navigate("/all-items");
    if (location.pathname !== "/profile") {
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
                    leftIcon={<MdPerson size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/profile" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/profile")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/profile" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/profile"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg: location.pathname === "/profile" ? null : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/profile" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/profile" ? "20px" : "0",
                    }}
                  >
                    Profile
                  </Button>
                  <Divider />

                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Interactions
                  </Text>

                  {/* My Items */}
                  <Button
                    leftIcon={<MdShoppingBasket size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/my-items" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/my-items")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/my-items" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/my-items"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg: location.pathname === "/my-items" ? null : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/my-items" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/my-items" ? "20px" : "0",
                    }}
                  >
                    My Items
                  </Button>

                  {/* Messages */}
                  <Button
                    leftIcon={<MdMessage size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/messages" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/messages")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/messages" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/messages"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg: location.pathname === "/messages" ? null : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/messages" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/messages" ? "20px" : "0",
                    }}
                  >
                    Messages
                  </Button>
                  <Divider />

                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Assistance
                  </Text>

                  {/* Help & Support */}
                  <Button
                    leftIcon={<MdHelp size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/help" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/help")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/help" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/help"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg: location.pathname === "/help" ? null : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/help" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/help" ? "20px" : "0",
                    }}
                  >
                    Help & Support
                  </Button>

                  {/* Feedback */}
                  <Button
                    leftIcon={<MdFeedback size={30} color={textColor} />}
                    colorScheme="none"
                    variant={
                      location.pathname === "/feedback" ? "solid" : "outline"
                    }
                    size="md"
                    onClick={() => handleNavigate("/feedback")}
                    justifyContent="flex-start"
                    fontWeight={
                      location.pathname === "/feedback" ? "bold" : "normal"
                    }
                    px={6}
                    height="50px"
                    border="none"
                    bg={
                      location.pathname === "/feedback"
                        ? highlightColor
                        : "transparent"
                    }
                    color={textColor}
                    _hover={{
                      bg: location.pathname === "/feedback" ? null : hoverColor,
                    }}
                    sx={{
                      borderTopRightRadius:
                        location.pathname === "/feedback" ? "100px" : "0",
                      borderBottomRightRadius:
                        location.pathname === "/feedback" ? "20px" : "0",
                    }}
                  >
                    Feedback
                  </Button>
                  <Divider />
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
                onClick={navigateToHome}
              >
                All Items
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
            <MenuItem onClick={navigateToHome}>All Items</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default ProfileNavbar;
