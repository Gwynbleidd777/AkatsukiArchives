import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  useMediaQuery,
  Divider,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import ProfileSidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";
import ScrollToTopButton from "../../components/ScrollUp";

const Profile = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/auth/my-items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = response;
        console.log("Response data:", data); // Logging response data

        setLostItems(data.filter((item) => item.itemType === "Lost"));
        setFoundItems(data.filter((item) => item.itemType === "Found"));
        setClaimedItems(data.filter((item) => item.claimed === "claimed"));

        setLoading(false);
      } catch (error) {
        setError(error.response.data.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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

  const LostItemCard = ({ item }) => (
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
  );

  return (
    <Box>
      {isLargerThan768 && <ProfileSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <ProfileNavbar />
        <Flex direction="column" align="center" mt={8}>
          {/* Lost Items Section */}
          <Box
            mb={4}
            textAlign={{ base: "center", md: "center" }}
            color="#385A64"
          >
            <Heading
              mb={4}
              textAlign={{ base: "center", md: "center" }}
              color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            >
              My Lost Items
            </Heading>
            <Divider
              mt="-2"
              mb="4"
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto"
              w="100%"
            />
          </Box>
          <Flex
            justifyContent="space-between"
            mb={3}
            flexWrap="wrap"
            width="100%"
          >
            {loading
              ? Array.from({ length: lostItems.length }).map((_, index) => (
                  <Box
                    key={index}
                    width={{
                      base: "100%",
                      sm: "50%",
                      md: "50%",
                      lg: "25%",
                    }}
                    mb={{ base: 4, sm: 1 }} // Add margin bottom to create space between cards
                    pr={{ base: 0, sm: 2 }} // Add padding right for smaller screens
                  >
                    {/* Skeleton loader */}
                  </Box>
                ))
              : lostItems.map((item) => (
                  <LostItemCard
                    key={item._id} // Assuming '_id' is the unique identifier for each item
                    item={item}
                    colorMode={colorMode}
                  />
                ))}
          </Flex>
          {/* Divider for Lost and Found Items */}
          <Divider
            my="10"
            borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            borderWidth="1px"
            mx="auto"
            w="90%"
          />

          {/* Found Items Section */}
          <Box
            mb={4}
            textAlign={{ base: "center", md: "center" }}
            color="#385A64"
          >
            <Heading
              mb={4}
              textAlign={{ base: "center", md: "center" }}
              color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            >
              My Found Items
            </Heading>
            <Divider
              mt="-2"
              mb="4"
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto"
              w="100%"
            />
          </Box>
          <Flex
            justifyContent="space-between"
            mb={3}
            flexWrap="wrap"
            width="100%"
          >
            {loading
              ? Array.from({ length: foundItems.length }).map((_, index) => (
                  <Box
                    key={index}
                    width={{
                      base: "100%",
                      sm: "50%",
                      md: "50%",
                      lg: "25%",
                    }}
                    mb={{ base: 4, sm: 1 }} // Add margin bottom to create space between cards
                    pr={{ base: 0, sm: 2 }} // Add padding right for smaller screens
                  >
                    {/* Skeleton loader */}
                  </Box>
                ))
              : foundItems.map((item) => (
                  <LostItemCard
                    key={item._id} // Assuming '_id' is the unique identifier for each item
                    item={item}
                    colorMode={colorMode}
                  />
                ))}
          </Flex>

          {/* Divider for Found and Claimed Items */}
          {/* <Divider
            my="10"
            borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            borderWidth="1px"
            mx="auto"
            w="90%"
          /> */}

          {/* <Box
            mb={4}
            textAlign={{ base: "center", md: "center" }}
            color="#385A64"
          >
            <Heading
              mb={4}
              textAlign={{ base: "center", md: "center" }}
              color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            >
              Claimed Items
            </Heading>
            <Divider
              mt="-2"
              mb="4"
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto"
              w="100%"
            />
          </Box>
          <Flex
            justifyContent="space-between"
            mb={3}
            flexWrap="wrap"
            width="100%"
          >
            {loading
              ? Array.from({ length: claimedItems.length }).map((_, index) => (
                  <Box
                    key={index}
                    width={{
                      base: "100%",
                      sm: "50%",
                      md: "50%",
                      lg: "25%",
                    }}
                    mb={{ base: 4, sm: 1 }}
                    pr={{ base: 0, sm: 2 }}
                  >
                  </Box>
                ))
              : claimedItems.map((item) => (
                  <LostItemCard
                    key={item._id}
                    item={item}
                    colorMode={colorMode}
                  />
                ))}
          </Flex> */}
        </Flex>
        <ProfileFooter />
        <ScrollToTopButton />
      </Box>
    </Box>
  );
};

export default Profile;
