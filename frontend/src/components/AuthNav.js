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
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo1 from "../Logo/LogoB.png";
import Logo2 from "../Logo/LogoW.png";
import axios from "axios";

const AuthenticatedNavbar = () => {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = colorMode === "dark" ? "#FFFFF" : "#385A64";
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleBellHover = () => {
    setShowNotifications(true);
    fetchNotifications();
  };

  const handleBellLeave = () => {
    setShowNotifications(false);
  };

  const handleNotificationClick = (notification) => {
    // Handle the click event based on the notification type
    // For example, redirect to a specific page or perform a specific action
    console.log("Notification clicked:", notification);
  };

  const categoryOptions = [
    { value: "Watch", label: "Watch" },
    { value: "Purse/Money Bag", label: "Purse/Money Bag" },
    { value: "Cards", label: "Cards" },
    { value: "Phone", label: "Phone" },
    { value: "Phone Cover", label: "Phone Cover" },
    { value: "Earphones", label: "Earphones" },
    { value: "Books", label: "Books" },
    {
      value: "Keyboard/Mouse/Charger/Other Similar Gadgets",
      label: "Keyboard/Mouse/Charger/Other Similar Gadgets",
    },
    {
      value: "Glasses/Spectacles/Goggles",
      label: "Glasses/Spectacles/Goggles",
    },
    { value: "Speakers", label: "Speakers" },
    { value: "Lunch Box/Bottle", label: "Lunch Box/Bottle" },
    {
      value: "Pen Drive/USB/Similar Gadgets",
      label: "Pen Drive/USB/Similar Gadgets",
    },
    { value: "Make-Up Kit", label: "Make-Up Kit" },
    {
      value: "Jewellery/Chains/Rings/Similar Items",
      label: "Jewellery/Chains/Rings/Similar Items",
    },
    { value: "Outfit", label: "Outfit" },
    { value: "Others", label: "Others" },
  ];

  const itemTypeOptions = [
    { value: "Lost", label: "Lost" },
    { value: "Found", label: "Found" },
  ];

  const colorOptions = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "gray", label: "Gray" },
    { value: "brown", label: "Brown" },
    { value: "silver", label: "Silver" },
    { value: "gold", label: "Gold" },
    { value: "unknown", label: "Unknown" },
  ];

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const toggleColors = () => {
    setShowAllColors(!showAllColors);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const CustomDatePickerInput = ({ value, onChange, label }) => {
    return (
      <input
        type="date"
        value={value}
        onChange={onChange}
        placeholder={label}
        style={{
          width: "120px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "0.5em",
          fontSize: "0.875rem",
        }}
      />
    );
  };

  const toggleLeftDrawer = () => {
    setIsLeftOpen(!isLeftOpen);
  };

  const toggleRightDrawer = () => {
    setIsRightOpen(!isRightOpen);
  };

  const location = useLocation();

  const navigateToHome = () => {
    navigate("/all-items");
  };

  const navigateToAddItem = () => {
    navigate("/add-item");
  };

  const navigateToProfile = () => {
    navigate("/profile");
    if (location.pathname !== "/profile") {
      toggleRightDrawer();
    }
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
    >
      <Box
        display={{ base: "block", md: "none" }}
        onClick={toggleLeftDrawer}
        cursor="pointer"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Drawer"
          fontSize="24px"
          color={colorMode === "dark" ? "white" : "#385A64"}
          _hover={{ color: colorMode === "dark" ? "#00DFC0" : "#00DFC0" }}
        />
      </Box>

      <Drawer isOpen={isLeftOpen} placement="left" onClose={toggleLeftDrawer}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Sorts & Filters</DrawerHeader>
            <DrawerBody>
              <Box
                mb={4}
                fontWeight="bold"
                fontSize="xl"
                display="flex"
                flexDirection="column"
              >
                <Box mb={2} color={textColor}>
                  Sort By :
                </Box>
                <Button
                  variant="ghost"
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                >
                  Date Posted: New To Old
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                >
                  Date Posted: Old To New
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                >
                  Authneticity : More To Less
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                >
                  Authneticity : Less To More
                </Button>

                <Box mt={4} mb={2}>
                  <Box mb={2} fontWeight="bold" fontSize="lg" color={textColor}>
                    Filter By :
                  </Box>

                  <Box>
                    <Box
                      mb={2}
                      fontWeight="bold"
                      fontSize="sm"
                      color={textColor}
                    >
                      Category
                    </Box>
                    {categoryOptions
                      .slice(0, showAllCategories ? categoryOptions.length : 7)
                      .map((option, index) => (
                        <Box key={index} color={textColor}>
                          <Checkbox id={`category${index + 1}`} size="sm">
                            <Box fontWeight="normal">{option.label}</Box>
                          </Checkbox>
                        </Box>
                      ))}
                    {categoryOptions.length > 7 && (
                      <Button
                        size="sm"
                        variant="link"
                        onClick={toggleCategories}
                        mb={4}
                        color={textColor}
                      >
                        {showAllCategories ? "Show Less" : "See More"}
                      </Button>
                    )}
                  </Box>

                  <Box>
                    <Box
                      mb={2}
                      fontWeight="bold"
                      fontSize="sm"
                      color={textColor}
                    >
                      Item Type
                    </Box>
                    {itemTypeOptions.map((option, index) => (
                      <Box key={index} color={textColor}>
                        <Checkbox id={`itemType${index + 1}`} size="sm">
                          <Box fontWeight="normal">{option.label}</Box>
                        </Checkbox>
                      </Box>
                    ))}
                  </Box>

                  <Box>
                    <Box
                      mb={2}
                      mt={2}
                      fontWeight="bold"
                      fontSize="sm"
                      color={textColor}
                    >
                      Color
                    </Box>
                    {colorOptions
                      .slice(0, showAllColors ? colorOptions.length : 7)
                      .map((option, index) => (
                        <Box key={index} color={textColor}>
                          <Checkbox id={`color${index + 1}`} size="sm">
                            <Box fontWeight="normal">{option.label}</Box>
                          </Checkbox>
                        </Box>
                      ))}
                    {colorOptions.length > 7 && (
                      <Button
                        size="sm"
                        variant="link"
                        onClick={toggleColors}
                        mb={4}
                        color={textColor}
                      >
                        {showAllColors ? "Show Less" : "See More"}
                      </Button>
                    )}
                  </Box>

                  <Box mt={2} mb={2}>
                    <Box
                      mb={2}
                      fontWeight="bold"
                      fontSize="sm"
                      justifyContent="center"
                      color={textColor}
                    >
                      By Lost/Found Date
                    </Box>
                    {/* 'From' Date Picker */}
                    <Box
                      mb={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box mr={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="normal"
                          color={textColor}
                        >
                          From :
                        </Text>
                      </Box>
                      <CustomDatePickerInput
                        value={fromDate}
                        onChange={handleFromDateChange}
                        label="From"
                        color={textColor}
                      />
                    </Box>
                    {/* 'To' Date Picker */}
                    <Box
                      mb={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box mr={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="normal"
                          color={textColor}
                        >
                          To :
                        </Text>
                      </Box>
                      <CustomDatePickerInput
                        value={toDate}
                        onChange={handleToDateChange}
                        label="To"
                        color={textColor}
                      />
                    </Box>

                    <Box align="center">
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                        backgroundColor={
                          colorMode === "dark" ? "#2D3748" : "#00DFC0"
                        }
                        _hover={{
                          backgroundColor:
                            colorMode === "dark" ? "#385A64" : "#2D3748",
                          color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                        }}
                        width="110px"
                        mt={8}
                      >
                        Apply Filters
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

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
        onClick={toggleRightDrawer}
        cursor="pointer"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Drawer"
          fontSize="24px"
          color={colorMode === "dark" ? "white" : "#385A64"}
          _hover={{ color: colorMode === "dark" ? "#00DFC0" : "#00DFC0" }}
        />
      </Box>

      <Drawer
        isOpen={isRightOpen}
        placement="right"
        onClose={toggleRightDrawer}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
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
                marginTop="2"
                marginBottom="4"
                width="100%"
                onClick={navigateToProfile}
              >
                Profile
              </Button>
              {location.pathname === "/add-item" ? (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  width="100%"
                  onClick={navigateToHome}
                >
                  All Items
                </Button>
              ) : (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  width="100%"
                  onClick={navigateToAddItem}
                >
                  Post Item
                </Button>
              )}
              <Divider my="4" />
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
        justifyContent="flex-start"
      >
        <Tooltip
          label="Notifications"
          aria-label="Notifications"
          isOpen={showNotifications}
          onClose={handleBellLeave}
          hasArrow
          placement="bottom"
        >
          <Flex align="center">
            {" "}
            {/* Wrap IconButton and VStack in Flex */}
            <IconButton
              icon={<BellIcon />}
              variant="ghost"
              aria-label="Notifications"
              fontSize="20px"
              color={colorMode === "dark" ? "white" : "#385A64"}
              marginRight="7"
              onMouseEnter={handleBellHover}
              onMouseLeave={handleBellLeave}
            />
            <VStack
              position="absolute"
              bottom="0"
              right="0"
              bg="white"
              boxShadow="lg"
              p="4"
              borderRadius="md"
              zIndex="1"
              spacing="2"
            >
              {notifications.map((notification) => (
                <Box
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  p="2"
                  borderBottom="1px solid #E2E8F0"
                  cursor="pointer"
                >
                  <p>{notification.message}</p>
                </Box>
              ))}
            </VStack>
          </Flex>
        </Tooltip>

        <IconButton
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          variant="ghost"
          aria-label="Toggle Dark Mode"
          fontSize="20px"
          color={colorMode === "dark" ? "white" : "#385A64"}
          marginRight="7"
          onClick={toggleColorMode}
        />
        <Menu>
          <MenuButton as={Avatar} cursor="pointer" size="sm" marginRight="7" />{" "}
          <MenuList>
            <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default AuthenticatedNavbar;
