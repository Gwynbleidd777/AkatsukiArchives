import React, { useState, useEffect, useRef } from "react";
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
  LinkBox,
  LinkOverlay,
  Skeleton,
  SkeletonText,
  useDisclosure,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaCameraRetro } from "react-icons/fa";
import axios from "axios";
import fuzzy from "fuzzy";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

const AllItems = () => {
  const [items, setItems] = useState([]);
  const { colorMode } = useColorMode();
  const textColor = colorMode === "dark" ? "#FFFFF" : "#385A64";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState(null);
  const [activeSortButton, setActiveSortButton] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedItemTypes, setSelectedItemTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const [isImageSearchResult, setIsImageSearchResult] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const tokenizeAndNormalize = (text) => {
    return text.toLowerCase().split(/\s+/);
  };

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

  const navbarBgColor = colorMode === "dark" ? "#171923" : "#F7FAFC";
  const navbarTextColor = colorMode === "dark" ? "white" : "black";
  const displayFilters = useBreakpointValue({ base: "none", lg: "block" });

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
  const itemsPerPage = 16;
  const verifiedItems = items.filter((item) => !item.deleted && item.verified);
  const totalPages = Math.ceil(verifiedItems.length / itemsPerPage);

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
      const rowItems = items
        .filter((item) => !item.deleted && item.verified)
        .slice(startIndex + startIdx, startIndex + endIdx);

      const row = (
        <Flex
          justifyContent="space-between"
          mb={3}
          flexWrap="wrap"
          width="100%"
        >
          {loading
            ? Array.from({ length: itemsPerRow[3] }).map((_, index) => (
                <Box
                  key={index}
                  width={{ base: "100%", sm: "50%", md: "50%", lg: "25%" }}
                  mb={{ base: 4, sm: 1 }} // Add margin bottom to create space between cards
                  pr={{ base: 0, sm: 2 }} // Add padding right for smaller screens
                >
                  <Skeleton height="300px" borderRadius="md" />
                  <SkeletonText mt="4" noOfLines={3} spacing="4" />
                </Box>
              ))
            : rowItems.map((item, i) => (
                <Box
                  key={item._id} // Assuming '_id' is the unique identifier for each item
                  width={{ base: "100%", sm: "50%", md: "50%", lg: "25%" }}
                  mb={{ base: 4, sm: 1 }} // Add margin bottom to create space between cards
                  pr={{ base: 0, sm: 2 }} // Add padding right for smaller screens
                  _hover={{
                    transform: "scale(1.05)", // Scale the card slightly
                    transition: "all 0.3s ease-in-out", // Smooth transition for the hover effect
                  }}
                >
                  <LinkBox
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    height="400px"
                    overflow="hidden"
                    as="article"
                  >
                    <LinkOverlay as={Link} to={`/view-details/${item._id}`}>
                      <Box mb={1} height="70%">
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
                      <Box>
                        {/* Item name */}
                        <Text
                          fontWeight="bold"
                          mb={1}
                          fontSize="lg" // Make the item name font size a bit smaller
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                          textAlign="left" // Align text to the left
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
                          Posted on: {formatDate(item.datePosted)}
                          {/* Assuming 'postedDate' is the field representing the posted date */}
                        </Text>
                      </Box>
                    </LinkOverlay>
                  </LinkBox>
                </Box>
              ))}
        </Flex>
      );
      itemCards.push(row);
    }
    return itemCards;
  };

  const handleSearch = () => {
    fetchItems(searchQuery); // Pass the search query to fetchItems
  };

  const [model, setModel] = useState(null);

  const handleImageSearch = async () => {
    if (!imagePreview) {
      console.log("No image preview available");
      return;
    }

    console.log("Starting image search");

    let currentModel = model;
    if (!currentModel) {
      console.log("Loading model...");
      try {
        currentModel = await mobilenet.load();
        setModel(currentModel);
        console.log("Model loaded:", currentModel);

        if (typeof currentModel.infer !== "function") {
          console.error("Loaded model does not have an infer function");
          return;
        }
      } catch (error) {
        console.error("Error loading model:", error);
        return;
      }
    }

    const img = new Image();
    img.onload = async () => {
      console.log("Image loaded");

      try {
        const imgTensor = tf.browser.fromPixels(img);
        const resizedImg = tf.image.resizeBilinear(imgTensor, [224, 224]);
        const expandedImg = resizedImg.expandDims(0);

        console.log("Image converted to tensor:", expandedImg);

        const embeddings = currentModel
          .infer(expandedImg, "conv_preds")
          .dataSync();
        console.log("Embeddings created:", embeddings);

        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/auth/get-items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const items = response.data;
        console.log("Items fetched from database:", items);

        const calculateEuclideanDistance = (embedding1, embedding2) => {
          let sum = 0;
          for (let i = 0; i < embedding1.length; i++) {
            sum += Math.pow(embedding1[i] - embedding2[i], 2);
          }
          return Math.sqrt(sum);
        };

        const distances = items.map((item) => {
          const itemEmbedding = item.mainImageEmbedding;
          const distance = calculateEuclideanDistance(
            embeddings,
            itemEmbedding
          );
          console.log("Distance : ", distance);
          return { ...item, distance };
        });

        const maxDistance = Math.max(...distances.map((item) => item.distance));
        const minDistance = Math.min(...distances.map((item) => item.distance));

        const similarItems = distances.map((item) => {
          const normalizedSimilarity =
            ((maxDistance - item.distance) / (maxDistance - minDistance)) * 100;
          console.log("Similarity Percentage : ", normalizedSimilarity);
          return { ...item, similarityPercentage: normalizedSimilarity };
        });

        console.log("Before sorting:", similarItems);

        const filteredItems = similarItems
          .filter((item) => item.similarityPercentage >= 50)
          .sort((a, b) => b.similarityPercentage - a.similarityPercentage);

        // Logging item names and similarity percentages after sorting
        filteredItems.forEach((item) => {
          console.log(
            `Item: ${item.itemName}, Similarity Percentage: ${item.similarityPercentage}`
          );
        });

        setItems(filteredItems);
        setIsImageSearchResult(true);
      } catch (error) {
        console.error("Error during image processing or prediction:", error);
      }

      onClose();
    };

    img.onerror = () => {
      console.log("Error loading image");
      onClose();
    };

    img.src = imagePreview;
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
                onChange={(e) => setSearchQuery(e.target.value)} // Capture search query
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
            ml={2}
          >
            <Tooltip
              label="Search by image"
              aria-label="Search by image tooltip"
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
                  icon={<FaCameraRetro size="20px" />}
                  variant="ghost"
                  aria-label="Search by image"
                  color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
                  _hover={{
                    color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                  }}
                  onClick={onOpen}
                />
              </Box>
            </Tooltip>

            <Box width="150px" />

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
              <Button
                colorScheme="teal"
                variant="ghost"
                color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
                _hover={{
                  color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                }}
                width="90px"
                onClick={() => navigate("/add-item")}
              >
                Post Item
              </Button>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Search by Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody onPaste={handlePaste}>
                  <Box
                    border="2px dashed"
                    p={4}
                    textAlign="center"
                    minHeight="300px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    ) : (
                      <>
                        <Text mb={2}>Copy and paste item image</Text>
                        <Text>
                          or{" "}
                          <Text
                            as="span"
                            textDecoration="underline"
                            cursor="pointer"
                            onClick={() => fileInputRef.current.click()}
                          >
                            upload an image
                          </Text>
                        </Text>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          display="none"
                          onChange={handleImageUpload}
                        />
                      </>
                    )}
                  </Box>
                </ModalBody>
                <ModalFooter>
                  {imagePreview ? (
                    <>
                      <Button onClick={handleRemoveImage} mr={3}>
                        Remove
                      </Button>
                      <Button onClick={handleImageSearch}>Search</Button>
                    </>
                  ) : (
                    <Button onClick={onClose}>Close</Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Flex>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 5fr" }}
        gap={{ base: 0, md: 4 }}
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
              activeSortButton === "moreToLessAuthentic" ? "solid" : "ghost"
            }
            size="sm"
            fontWeight="normal"
            mb={2}
            color={textColor}
            onClick={() => handleSort("moreToLessAuthentic")}
          >
            Authenticity: More To Less
          </Button>
          <Button
            variant={
              activeSortButton === "lessToMoreAuthentic" ? "solid" : "ghost"
            }
            size="sm"
            fontWeight="normal"
            mb={2}
            color={textColor}
            onClick={() => handleSort("lessToMoreAuthentic")}
          >
            Authenticity: Less To More
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
                    <Checkbox
                      id={`category${index + 1}`}
                      size="sm"
                      isChecked={selectedCategories.includes(option.value)}
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
              <Box mb={2} fontWeight="bold" fontSize="sm" color={textColor}>
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
          {isImageSearchResult ? (
            <>
              <Text
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                fontSize="4xl"
                mb={4}
                textAlign="center"
              >
                Potential Matches
              </Text>
              <Box
                borderBottom={`2px solid ${
                  colorMode === "dark" ? "#00DFC0" : "#385A64"
                }`}
                mb={4}
              ></Box>
              {/* Render potential matches with similarity percentage above 60% */}
              {items.filter((item) => item.similarityPercentage >= 50).length >
              0 ? (
                renderItemCards(
                  currentPage,
                  itemsPerPage,
                  items.filter((item) => item.similarityPercentage >= 50)
                )
              ) : (
                <Text
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  fontSize="2xl"
                  mb={4}
                  textAlign="center"
                >
                  No potential matches
                </Text>
              )}
            </>
          ) : (
            renderItemCards(currentPage, itemsPerPage)
          )}

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
