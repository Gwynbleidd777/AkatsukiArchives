import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  Divider,
  Heading,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import ScrollToTopButton from "../../components/ScrollUp";
import { ArrowBackIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Img from "../../Logo/Apple1.jpeg";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const AdminSingleItem = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const dividerWidth = useBreakpointValue({ base: "98%", md: "15%" });

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBackButtonClick = () => {
    navigate("/admin-items");
  };

  const handleLeftArrowClick = () => {
    console.log("Left arrow clicked");
  };

  const handleRightArrowClick = () => {
    console.log("Right arrow clicked");
  };
  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />

        <Box mb={4}>
          <Button
            variant="ghost"
            onClick={handleBackButtonClick}
            mr={4}
            mt={4}
            ml={4}
          >
            <ArrowBackIcon
              boxSize={6}
              color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            />
          </Button>

          <MotionHeading
            mb={4}
            mt={4}
            textAlign={{ base: "center", md: "center" }}
            color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            variants={fadeInAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1.25 }}
          >
            Item Info
          </MotionHeading>

          <MotionBox
            variants={underlineAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 2 }}
          >
            <Divider
              mt="-2"
              mb="10"
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto"
              w={dividerWidth}
            />
          </MotionBox>

          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Flex maxW="100%" justifyContent="space-between" mt={4} px={10}>
              <Box
                flex="1"
                p={4}
                mb={4}
                height="500px"
                width="900px"
                overflow="hidden"
                position="relative"
              >
                <Box
                  position="absolute"
                  top="50%"
                  left="0"
                  transform="translateY(-50%)"
                  zIndex="1"
                >
                  <ArrowLeftIcon
                    boxSize={10}
                    color="gray.400"
                    cursor="pointer"
                    onClick={handleLeftArrowClick}
                  />
                </Box>
                <Box
                  position="absolute"
                  top="50%"
                  right="0"
                  transform="translateY(-50%)"
                  zIndex="1"
                >
                  <ArrowRightIcon
                    boxSize={10}
                    color="gray.400"
                    cursor="pointer"
                    onClick={handleRightArrowClick}
                  />
                </Box>
                <img
                  src={Img}
                  alt="Item Image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              </Box>

              <Box flex="1" ml={16}>
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  height="500px"
                  width="600px"
                  p={4}
                  mb={4}
                >
                  <Box mb={4}>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Item Name:</strong> Apple Watch
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Category:</strong> Watch
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Description:</strong> I lost it near canteen when I was going for the lunch. I haven't seen it till then.
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Location:</strong> Canteen
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Item Type:</strong> Lost
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Lost/Found Date:</strong> 2024-05-01
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Date Posted:</strong> 2024-05-01
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Brand:</strong> Apple
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Item Color:</strong> Red
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Flex>

            <Button
              colorScheme="teal"
              variant="outline"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
              _hover={{
                backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
              }}
              width="400px"
              mt={4}
            >
              Delete Item
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
              width="400px"
              mt={4}
            >
              Message User
            </Button>
          </Flex>
        </Box>

        <AdminFooter />
      </Box>

      <ScrollToTopButton />
    </Box>
  );
};

export default AdminSingleItem;
