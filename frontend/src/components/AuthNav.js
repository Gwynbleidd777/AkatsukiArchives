import React, { useState, useEffect } from "react";
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
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo1 from "../Logo/LogoB.png";
import Logo2 from "../Logo/LogoW.png";
import axios from "axios";
import fuzzy from "fuzzy";

const AuthenticatedNavbar = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = colorMode === "dark" ? "#FFFFF" : "#385A64";
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [activeSortButton, setActiveSortButton] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedItemTypes, setSelectedItemTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tokenizeAndNormalize = (text) => {
    return text.toLowerCase().split(/\s+/);
  };

  // Calculate relevance score based on matched keywords
  const calculateRelevanceScore = (item, queryTokens) => {
    const itemTokens = [
      ...tokenizeAndNormalize(item.itemName),
      ...tokenizeAndNormalize(item.description),
      ...tokenizeAndNormalize(item.category),
      ...tokenizeAndNormalize(item.location),
      ...tokenizeAndNormalize(item.itemType),
      ...tokenizeAndNormalize(item.brand),
      ...tokenizeAndNormalize(item.itemColor),
    ];

    let score = 0;
    queryTokens.forEach((token) => {
      if (itemTokens.includes(token)) {
        score += 1;
      }
    });
    return score;
  };

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
      // Filter and sort the notifications
      const sortedNotifications = data
        .filter((notification) => !notification.isRead)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setIsMenuOpen(!isMenuOpen);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );

    if (date >= today) {
      return "Today";
    } else if (date >= yesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === "userVerification") {
      window.location.href = "/profile";
    } else if (
      notification.type === "itemVerification" ||
      notification.type === "itemDeletion"
    ) {
      window.location.href = `/view-details/${notification.itemId}`;
    } else {
      console.log("Notification clicked:", notification);
    }
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
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
    { value: "Green", label: "Green" },
    { value: "Yellow", label: "Yellow" },
    { value: "Orange", label: "Orange" },
    { value: "Purple", label: "Purple" },
    { value: "Pink", label: "Pink" },
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Gray", label: "Gray" },
    { value: "Brown", label: "Brown" },
    { value: "Silver", label: "Silver" },
    { value: "Gold", label: "Gold" },
    { value: "Others", label: "Others" },
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

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const handleItemTypeChange = (itemType) => {
    setSelectedItemTypes((prevItemTypes) =>
      prevItemTypes.includes(itemType)
        ? prevItemTypes.filter((t) => t !== itemType)
        : [...prevItemTypes, itemType]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const fetchItems = async (searchQuery = "") => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:5000/api/auth/get-items",
        config
      );

      let fetchedItems = response.data;

      // Apply search filter
      if (searchQuery) {
        // Create a dictionary of common item words
        const dictionary = fetchedItems
          .flatMap((item) => [
            item.itemName,
            item.description,
            item.category,
            item.location,
            item.itemType,
            item.brand,
            item.itemColor,
          ])
          .map(tokenizeAndNormalize)
          .flat();
        const uniqueDictionary = Array.from(new Set(dictionary));

        const correctMisspellings = (queryTokens, dictionary) => {
          return queryTokens.map((token) => {
            const match = fuzzy.filter(token, dictionary);
            return match.length ? match[0].string : token;
          });
        };

        // Correct misspellings in the search query
        let queryTokens = tokenizeAndNormalize(searchQuery);
        queryTokens = correctMisspellings(queryTokens, uniqueDictionary);

        fetchedItems = fetchedItems
          .map((item) => ({
            ...item,
            relevanceScore: calculateRelevanceScore(item, queryTokens),
          }))
          .filter((item) => item.relevanceScore > 0);

        // Sort by relevance score in descending order
        fetchedItems.sort((a, b) => b.relevanceScore - a.relevanceScore);
      }

      // Apply other filters (categories, item types, colors)
      if (selectedCategories.length > 0) {
        fetchedItems = fetchedItems.filter((item) =>
          selectedCategories.includes(item.category)
        );
      }
      if (selectedItemTypes.length > 0) {
        fetchedItems = fetchedItems.filter((item) =>
          selectedItemTypes.includes(item.itemType)
        );
      }
      if (selectedColors.length > 0) {
        fetchedItems = fetchedItems.filter((item) =>
          selectedColors.includes(item.itemColor)
        );
      }

      // Apply date filter
      if (fromDate && !toDate) {
        const fromDateObj = new Date(fromDate);
        fetchedItems = fetchedItems.filter((item) => {
          const itemDate = new Date(item.lostFoundDate);
          return itemDate >= fromDateObj;
        });
      } else if (!fromDate && toDate) {
        const toDateObj = new Date(toDate);
        fetchedItems = fetchedItems.filter((item) => {
          const itemDate = new Date(item.lostFoundDate);
          return itemDate <= toDateObj;
        });
      } else if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        fetchedItems = fetchedItems.filter((item) => {
          const itemDate = new Date(item.lostFoundDate);
          return itemDate >= fromDateObj && itemDate <= toDateObj;
        });
      }

      // Function to get the count of filled fields in an item
      const getFilledFieldsCount = (item) => {
        return Object.values(item).filter(
          (value) => value !== null && value !== undefined && value !== ""
        ).length;
      };

      // Apply sorting based on sortType
      if (sortType === "newToOld") {
        fetchedItems.sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
      } else if (sortType === "oldToNew") {
        fetchedItems.sort(
          (a, b) => new Date(a.datePosted) - new Date(b.datePosted)
        );
      } else if (sortType === "moreToLessAuthentic") {
        fetchedItems.sort((a, b) => {
          const fieldsFilledA = getFilledFieldsCount(a);
          const fieldsFilledB = getFilledFieldsCount(b);
          return (
            fieldsFilledB - fieldsFilledA ||
            new Date(a.datePosted) - new Date(b.datePosted)
          );
        });
      } else if (sortType === "lessToMoreAuthentic") {
        fetchedItems.sort((a, b) => {
          const fieldsFilledA = getFilledFieldsCount(a);
          const fieldsFilledB = getFilledFieldsCount(b);
          return (
            fieldsFilledA - fieldsFilledB ||
            new Date(a.datePosted) - new Date(b.datePosted)
          );
        });
      }

      // Log item names and date posted
      fetchedItems.forEach((item) => {
        console.log(`${item.itemName} : ${item.datePosted}`);
      });

      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }

    const correctMisspellings = (queryTokens, dictionary) => {
      return queryTokens.map((token) => {
        const match = fuzzy.filter(token, dictionary);
        return match.length ? match[0].string : token;
      });
    };
  };

  useEffect(() => {
    fetchItems(searchQuery);
  }, [
    sortType,
    selectedCategories,
    selectedItemTypes,
    selectedColors,
    fromDate,
    toDate,
    searchQuery,
  ]);

  const handleSort = (type) => {
    if (type === activeSortButton) {
      setSortType(null);
      setActiveSortButton(null);
    } else {
      setSortType(type);
      setActiveSortButton(type);
    }
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

  const toggleNotificationDrawer = () => {
    setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
    if (!showNotifications) {
      fetchNotifications();
    }
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

  const handleSearch = () => {
    fetchItems(searchQuery); // Pass the search query to fetchItems
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
                  variant={activeSortButton === "newToOld" ? "solid" : "ghost"}
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                  onClick={() => handleSort("newToOld")}
                >
                  Date Posted: New To Old
                </Button>
                <Button
                  variant={activeSortButton === "oldToNew" ? "solid" : "ghost"}
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                  onClick={() => handleSort("oldToNew")}
                >
                  Date Posted: Old To New
                </Button>
                <Button
                  variant={
                    activeSortButton === "moreToLessAuthentic"
                      ? "solid"
                      : "ghost"
                  }
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                  onClick={() => handleSort("moreToLessAuthentic")}
                >
                  Authneticity : More To Less
                </Button>
                <Button
                  variant={
                    activeSortButton === "lessToMoreAuthentic"
                      ? "solid"
                      : "ghost"
                  }
                  size="sm"
                  fontWeight="normal"
                  mb={2}
                  color={textColor}
                  onClick={() => handleSort("lessToMoreAuthentic")}
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
                          <Checkbox
                            id={`category${index + 1}`}
                            size="sm"
                            isChecked={selectedCategories.includes(
                              option.value
                            )}
                            onChange={() => handleCategoryChange(option.value)}
                          >
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
                        <Checkbox
                          id={`itemType${index + 1}`}
                          size="sm"
                          isChecked={selectedItemTypes.includes(option.value)}
                          onChange={() => handleItemTypeChange(option.value)}
                        >
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
                          <Checkbox
                            id={`color${index + 1}`}
                            size="sm"
                            isChecked={selectedColors.includes(option.value)}
                            onChange={() => handleColorChange(option.value)}
                          >
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

              {location.pathname === "/all-items" && (
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
                  marginBottom="4"
                  onClick={toggleNotificationDrawer}
                >
                  Notifications
                </Button>
              )}

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

      <Drawer
        isOpen={isNotificationDrawerOpen}
        placement="top"
        onClose={toggleNotificationDrawer}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Notifications</DrawerHeader>
            <DrawerBody>
              {/* Notifications list */}
              {notifications.length === 0 ? (
                <Text>No notifications</Text>
              ) : (
                notifications.map((notification) => (
                  <Box
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    p="2"
                    borderBottom="1px solid #E2E8F0"
                    cursor="pointer"
                    whiteSpace="normal" // Enable text wrapping
                    _hover={{
                      bg: colorMode === "dark" ? "#2E3748" : "#E2E8F0",
                    }}
                  >
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text flex="1" mr="2">
                        {notification.message}
                      </Text>
                      <Text fontSize="sm" whiteSpace="nowrap">
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>
                    </Box>
                  </Box>
                ))
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          <MenuButton
            as={IconButton}
            icon={<BellIcon />}
            variant="ghost"
            aria-label="Notifications"
            fontSize="20px"
            color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            marginRight="7"
            onClick={toggleNotifications}
          />
          {showNotifications && (
            <MenuList
              bg={colorMode === "dark" ? "#1A202C" : "white"}
              boxShadow="lg"
              p="4"
              borderRadius="md"
              zIndex="1"
              border="1px solid #E2E8F0"
              color={colorMode === "dark" ? "white" : "#2D3748"}
              maxH="500px" // Set the max height
              w="400px" // Set the fixed width
              overflowY="auto" // Enable vertical scrolling
              css={{
                // Customize scrollbar
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: colorMode === "dark" ? "#2D3748" : "#A0AEC0",
                  borderRadius: "8px",
                },
              }}
            >
              <Box
                bg={colorMode === "dark" ? "#00DFC0" : "#E2E8F0"}
                width="100%"
                p="2"
                borderRadius="md"
                mb="4"
                textAlign="center"
              >
                <Text fontWeight="bold" color="#385A64">
                  Notifications
                </Text>
              </Box>
              {notifications.length === 0 ? (
                <MenuItem>No notifications</MenuItem>
              ) : (
                Object.entries(
                  notifications.reduce((acc, notification) => {
                    const formattedDate = formatDate(notification.createdAt);
                    if (!acc[formattedDate]) {
                      acc[formattedDate] = [];
                    }
                    acc[formattedDate].push(notification);
                    return acc;
                  }, {})
                ).map(([date, groupedNotifications]) => (
                  <VStack key={date} align="start" spacing="4" width="100%">
                    <Text fontWeight="bold">{date}</Text>
                    {groupedNotifications.map((notification) => (
                      <MenuItem
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        p="2"
                        borderBottom="1px solid #E2E8F0"
                        cursor="pointer"
                        bg={colorMode === "dark" ? "#1A202C" : "white"}
                        _hover={{
                          bg: colorMode === "dark" ? "#2D3748" : "#E2E8F0",
                        }}
                        whiteSpace="normal" // Enable text wrapping
                      >
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Text flex="1" mr="2">
                            {notification.message}
                          </Text>
                          <Text fontSize="sm" whiteSpace="nowrap">
                            {new Date(
                              notification.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </Box>
                      </MenuItem>
                    ))}
                  </VStack>
                ))
              )}
            </MenuList>
          )}
        </Menu>

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
