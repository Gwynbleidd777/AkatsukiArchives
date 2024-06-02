import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  useMediaQuery,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
  Button,
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

  const LostItemCard = ({ item }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="100%" // Ensure full width for each card
      height="400px" // Fixed height for all cards
      p="1rem"
    >
      <Heading size="md" mb="1" textAlign="center">
        {item.itemName}
      </Heading>
      <Text mb="1" textAlign="center">
        Type: {item.itemType}
      </Text>
      <Text mb="1" textAlign="center">
        Posted on: {formatDate(item.datePosted)}
      </Text>
      <Divider my="1" />
      <Button
        colorScheme="teal"
        variant="outline"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mt="auto" // Move button to the bottom
      >
        Show Details
      </Button>
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
            justifyContent="flex-start"
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
          <Divider
            my="10"
            borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            borderWidth="1px"
            mx="auto"
            w="90%"
          />

          {/* Claimed Items Section */}
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
                    mb={{ base: 4, sm: 1 }} // Add margin bottom to create space between cards
                    pr={{ base: 0, sm: 2 }} // Add padding right for smaller screens
                  >
                    {/* Skeleton loader */}
                  </Box>
                ))
              : claimedItems.map((item) => (
                  <LostItemCard
                    key={item._id} // Assuming '_id' is the unique identifier for each item
                    item={item}
                    colorMode={colorMode}
                  />
                ))}
          </Flex>
        </Flex>
        <ProfileFooter />
        <ScrollToTopButton />
      </Box>
    </Box>
  );
};

export default Profile;
