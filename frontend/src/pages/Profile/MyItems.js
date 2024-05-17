import React from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  Divider,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";
import ScrollToTopButton from "../../components/ScrollUp";

const Card = ({ children }) => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    width={{ base: "100%", md: "calc(50% - 1rem)", lg: "calc(25% - 1rem)" }}
    m={{ base: "0.5rem 0", md: "0.5rem", lg: "0.5rem" }}
    p={{ base: "0.5rem", md: "1rem", lg: "1rem" }}
  >
    {children}
  </Box>
);

const CardBody = ({ children }) => <Box p="6">{children}</Box>;

const CardFooter = ({ children }) => (
  <Box borderTopWidth="1px" p="6">
    {children}
  </Box>
);

const LostItemCard = ({ item, colorMode }) => (
  <Card>
    <CardBody>
      <Flex justify="center">
        <Image
          src={item.image}
          alt={item.name}
          borderRadius="lg"
          height="200px" // Fixed height
          width="200px" // Fixed width
          objectFit="cover"
        />
      </Flex>
      <Stack mt="6" spacing="3">
        <Heading
          size="md"
          textAlign="center"
          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
        >
          {item.name}
        </Heading>
        <Text
          textAlign="center"
          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
        >
          {item.description}
        </Text>
      </Stack>
    </CardBody>
    <Divider borderColor={colorMode === "light" ? "#385A64" : "#00DFC0"} />
    <CardFooter display="flex" justifyContent="center" width="100%">
      <Button
        colorScheme="teal"
        variant="outline"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%" // Reduced size for smaller screens
        color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
        backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
        _hover={{
          backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
          color: colorMode === "dark" ? "#00DFC0" : "#385A64",
        }}
        mt={"15px"}
        fontSize={{ base: "sm", md: "md" }} // Adjusted font size for smaller screens
      >
        Show Details
      </Button>
    </CardFooter>
  </Card>
);

const Profile = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();

  // Dummy data for lost items
  const lostItems = [
    {
      id: 1,
      name: "Watch",
      description: "I bought it a year ago.",
      image:
        "https://storage.googleapis.com/support-forums-api/attachment/thread-205757063-5003349309186348123.jpg",
    },
    {
      id: 2,
      name: "Wallet",
      description: "I lost it near the staircases.",
      image:
        "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?cs=srgb&dl=pexels-goumbik-915915.jpg&fm=jpg",
    },
    {
      id: 3,
      name: "Fountain Pen",
      description: "It was black in color.",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmr2iSoLYF7bPQTK37pMHJ232M4tXzXp7atXL0cBGSwMZMoeoDy4EBqSCkdSeGgx_YMScdXLSEkj2aIuSx8h4ny8k5_lq3xi2qNt8uhkl4CE5hAm25BYZkU78fs70-KsbIYlllxpYHCgI/s1600/Pmhatre1.JPG",
    },
    {
      id: 4,
      name: "Watter Bottle",
      description: "It was transparent in color.",
      image:
        "https://tiimg.tistatic.com/fp/1/006/153/plastic-packaging-drinking-water--326.jpg",
    },
    {
      id: 5,
      name: "Lost Item 5",
      description: "Description for lost item 5",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      name: "Lost Item 6",
      description: "Description for lost item 6",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 7,
      name: "Lost Item 7",
      description: "Description for lost item 7",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 8,
      name: "Lost Item 8",
      description: "Description for lost item 8",
      image: "https://via.placeholder.com/300",
    },
  ];

  // Dummy data for found items
  const foundItems = [
    {
      id: 1,
      name: "Found Item 1",
      description: "Description for found item 1",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Found Item 2",
      description: "Description for found item 2",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Found Item 3",
      description: "Description for found item 3",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      name: "Found Item 4",
      description: "Description for found item 4",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      name: "Found Item 5",
      description: "Description for found item 5",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      name: "Found Item 6",
      description: "Description for found item 6",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 7,
      name: "Found Item 7",
      description: "Description for found item 7",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 8,
      name: "Found Item 8",
      description: "Description for found item 8",
      image: "https://via.placeholder.com/300",
    },
  ];

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
          <Flex justify="space-between" width="100%" flexWrap="wrap">
            {lostItems.map((item) => (
              <LostItemCard key={item.id} item={item} colorMode={colorMode} />
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
          <Flex justify="space-between" width="100%" flexWrap="wrap">
            {foundItems.map((item) => (
              <LostItemCard key={item.id} item={item} colorMode={colorMode} />
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
