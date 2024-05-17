import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "../../components/AuthNav";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useColorMode,
  Grid,
  Checkbox,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

const AllItems = () => {
  const [items, setItems] = useState([]);
  const { colorMode } = useColorMode();
  const textColor = colorMode === "dark" ? "#FFFFF" : "#385A64";
  const navigate = useNavigate();

  const navbarBgColor = colorMode === "dark" ? "#171923" : "#F7FAFC";
  const navbarTextColor = colorMode === "dark" ? "white" : "black";

  const displayFilters = useBreakpointValue({ base: "none", lg: "block" });

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

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    // Pad single-digit day and month with leading zero if necessary
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;

    return formattedDay + "/" + formattedMonth + "/" + year;
  };

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    // Function to fetch items from the backend
    const fetchItems = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");

        // Set the headers with the token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Make GET request to backend route with the headers
        const response = await axios.get(
          "http://localhost:5000/api/auth/get-items",
          config
        );

        // Update state with fetched items
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems(); // Call fetchItems function when component mounts
  }, []);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderItemCards = (currentPage, itemsPerPage) => {
    const itemsPerRow = [1, 2, 3, 4]; // Define the number of items per row for different screen sizes
    const rows = Math.ceil(itemsPerPage / itemsPerRow[3]); // Initialize with the maximum items per row (for larger screens)

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    const itemCards = [];

    for (let i = 0; i < rows; i++) {
      const startIdx = i * itemsPerRow[3]; // Initialize with the maximum items per row (for larger screens)
      const endIdx = Math.min(startIdx + itemsPerRow[3], itemsPerPage); // Initialize with the maximum items per row (for larger screens)
      const rowItems = items.slice(startIndex + startIdx, startIndex + endIdx);

      const row = (
        <Flex
          key={i}
          justifyContent="space-between"
          mb={3}
          flexWrap="wrap"
          width="100"
        >
          {rowItems.map((item) => (
            <Box
              key={item._id} // Assuming '_id' is the unique identifier for each item
              width={{ base: "100%", sm: "50%", md: "50%", lg: "25%" }}
              mb={{ base: 4, sm: 1 }} // Add margin bottom to create space between cards
              pr={{ base: 0, sm: 2 }} // Add padding right for smaller screens
            >
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={4}
                height="450px"
                overflow="hidden"
              >
                <Box mb={1} height="65%">
                  {/* Upper portion: Item image with padding and gap */}
                  <img
                    src={item.mainImage} // Use item's main image
                    alt={`Item ${item._id}`}
                    style={{
                      width: "100%",
                      height: "96%",
                      maxHeight: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
                {/* Divider */}
                <Box
                  borderBottom={`2px solid ${
                    colorMode === "dark" ? "#00DFC0" : "#385A64"
                  }`}
                  mb={1}
                ></Box>
                <Box align="center">
                  {/* Item name */}
                  <Text
                    fontWeight="bold"
                    mb={1}
                    fontSize="xl"
                    color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  >
                    {item.itemName}
                  </Text>
                  {/* Item type */}
                  <Text
                    mb={1}
                    color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                    textAlign="left" // Align text to the left
                  >
                    Type: {item.itemType}
                  </Text>
                  {/* Posted on */}
                  <Text
                    mb={3}
                    color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                    textAlign="left" // Align text to the left
                  >
                    Posted on: {formatDate(item.postedDate)}
                    {/* Assuming 'datePosted' is the field representing the posted date */}
                  </Text>
                  {/* View Details button */}
                  <Link to={`/view-details`}>
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
                    >
                      View Details
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      );
      itemCards.push(row);
    }
    return itemCards;
  };

  const handleSearch = () => {
    console.log("Searching...");
  };

  return (
    <Box>
      <AuthenticatedNavbar />
      <Box
        bg={navbarBgColor}
        color={navbarTextColor}
        boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        paddingY={4}
        paddingX={4}
        zIndex={10}
      >
        <Flex align="center" direction={{ base: "column", md: "row" }}>
          <Box flex={{ base: "0 0 5%", md: "0 0 20%" }}></Box>

          <Box width={{ base: "90%", md: "60%" }}>
            <InputGroup alignItems="center">
              <Input
                placeholder="Search items..."
                variant="filled"
                bgColor={colorMode === "dark" ? "gray.800" : "gray.100"}
                _placeholder={{
                  color: colorMode === "dark" ? "gray.400" : "gray.600",
                }}
                size="sm"
                height="10"
                borderRadius="md"
                focusBorderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              />
              <InputRightElement
                height="100%"
                display="flex"
                alignItems="center"
              >
                <Box
                  bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  borderRadius="md"
                  border={`2px solid ${
                    colorMode === "dark" ? "#385A64" : "#00DFC0"
                  }`}
                  _hover={{
                    bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                  }}
                >
                  <IconButton
                    icon={<SearchIcon />}
                    variant="ghost"
                    aria-label="Search"
                    color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
                    size="md"
                    _hover={{
                      color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                    }}
                    onClick={handleSearch}
                  />
                </Box>
              </InputRightElement>
            </InputGroup>
          </Box>

          <Box
            flex={{ base: "0 0 5%", md: "0 0 20%" }}
            textAlign="right"
            display={{ base: "none", md: "flex" }}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              colorScheme="teal"
              variant="outline"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
              _hover={{
                backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
              }}
              width="90px"
              onClick={() => navigate("/add-item")}
            >
              Post Item
            </Button>
          </Box>
        </Flex>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 5fr" }} // Adjust template columns for smaller devices
        gap={{ base: 0, md: 4 }} // Remove gap for smaller devices
        p={4}
      >
        <Box
          display={displayFilters}
          mb={4}
          fontWeight="bold"
          fontSize="xl"
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
              <Box mb={2} fontWeight="bold" fontSize="sm" color={textColor}>
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
              <Box mb={2} fontWeight="bold" fontSize="sm" color={textColor}>
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
                  <Text fontSize="sm" fontWeight="normal" color={textColor}>
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
                  <Text fontSize="sm" fontWeight="normal" color={textColor}>
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
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
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

        <Box
          minHeight="200px"
          borderWidth="1px"
          borderRadius="md"
          p={4}
          position="relative"
        >
          {/* Render item cards based on current page */}
          {renderItemCards(currentPage, itemsPerPage)}

          {/* Pagination */}
          <Box
            bottom="0"
            backgroundColor={colorMode === "dark" ? "#1A202C" : "white"}
            paddingY={2}
            borderTop="1px solid"
            borderColor={colorMode === "dark" ? "#2D3748" : "#E2E8F0"}
            display="flex"
            justifyContent="center"
          >
            {/* Previous button */}
            {currentPage !== 1 && (
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={handlePreviousPage}
                marginRight={2}
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              >
                Prev
              </Button>
            )}
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              if (totalPages <= 3 || Math.abs(currentPage - (index + 1)) <= 1) {
                return (
                  <Button
                    key={index}
                    colorScheme="teal"
                    variant={currentPage === index + 1 ? "solid" : "outline"}
                    onClick={() => setCurrentPage(index + 1)}
                    disabled={currentPage === index + 1}
                    width={currentPage === index + 1 ? "40px" : "30px"}
                    marginRight={2}
                    color={
                      currentPage === index + 1
                        ? colorMode === "dark"
                          ? "#1A202C"
                          : "white"
                        : colorMode === "dark"
                        ? "#00DFC0"
                        : "#385A64"
                    }
                  >
                    {index + 1}
                  </Button>
                );
              } else if (
                Math.abs(currentPage - (index + 1)) === 2 &&
                totalPages > 3 &&
                currentPage !== 1 &&
                currentPage !== totalPages
              ) {
                return (
                  <Button
                    key={index}
                    variant="outline"
                    disabled
                    width="30px"
                    marginRight={2}
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    _focus={{ boxShadow: "none" }}
                    color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  >
                    ...
                  </Button>
                );
              }
              return null;
            })}
            {/* Next button */}
            {currentPage !== totalPages && (
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={handleNextPage}
                marginRight={2}
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Grid>

      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default AllItems;
