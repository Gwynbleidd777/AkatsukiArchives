import React from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  Heading,
  Divider,
  useBreakpointValue,
  useColorMode,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Sidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";
import Img from "../../Logo/Img19.png";

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);

const Profile = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const { colorMode } = useColorMode();
  const dividerWidth = useBreakpointValue({ base: "45%", md: "15%" });

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      {isLargerThan768 && <Sidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <ProfileNavbar />
        <Flex direction="column" align="center" mt={8}>
          {/* Feedback Heading with underline animation */}
          <MotionHeading
            mb={2}
            textAlign={{ base: "center", md: "center" }}
            color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            variants={fadeInAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1.25 }}
          >
            Feedback
          </MotionHeading>
          <MotionBox
            variants={underlineAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 2 }}
          >
            <Divider
              mt="2"
              mb="4" // reduce margin here
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto"
              w={dividerWidth}
            />
          </MotionBox>
          <Flex
            justify="space-between"
            width="100%"
            mt={2}
            mb={8}
            px={{ base: 4, md: 16 }}
          >
            <Box
              width={{ base: "100%", md: "45%" }}
              p={4}
              boxShadow="md"
              borderRadius="10px"
              mr={{ base: 0, md: 2 }}
            >
              <Textarea
                placeholder="You may drop any feedback or query here... The admin will soon contact you after that..."
                mb={4}
                resize="vertical"
                h="calc(100% - 80px)"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                _hover={{
                  borderColor: colorMode === "dark" ? "#00DFC0" : "#385A64",
                }}
                placeholderTextColor={
                  colorMode === "dark" ? "#718096" : "#CBD5E0"
                }
                focusBorderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              />

              <Flex justify="center" mt={4}>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  // onClick={handleFormSubmit}
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  width="100%"
                >
                  Submit
                </Button>
              </Flex>
            </Box>

            <Box
              width={{ base: "100%", md: "45%" }}
              p={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <img src={Img} alt="Image" style={{ width: "100%" }} />
            </Box>
          </Flex>
        </Flex>
        <ProfileFooter />
      </Box>
    </Box>
  );
};

export default Profile;
