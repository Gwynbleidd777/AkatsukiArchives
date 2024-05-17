import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  useColorMode,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import { useNavigate } from "react-router-dom";
import Img1 from "../../Logo/Img1.png";
import Img2 from "../../Logo/Img2.png";
import Img3 from "../../Logo/Img3.png";
import Img4 from "../../Logo/Img4.png";
import Img5 from "../../Logo/Img5.png";
import Img6 from "../../Logo/Img6.png";
import Img7 from "../../Logo/Img7.png";
import Img8 from "../../Logo/Img8.png";
import Img9 from "../../Logo/Img9.png";
import Img10 from "../../Logo/Img10.png";

const MotionBox = motion(Box);

const slideInFromLeftImg1 = {
  hidden: { x: "-100vw", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1, delay: 0 } },
  exit: { x: "-100vw", opacity: 0 }, // Exit animation to reset initial state
};

const slideInFromRightImg6 = {
  hidden: { x: "100vw", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1, delay: 5 } },
  exit: { x: "100vw", opacity: 0 }, // Exit animation to reset initial state
};

const slideInFromLeft = {
  hidden: { x: "-100vw", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 2 } },
  exit: { x: "-100vw", opacity: 0 }, // Exit animation to reset initial state
};

const slideInFromLeftCards = {
  hidden: { x: "-100vw", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1, delay: 3.25 } },
  exit: { x: "-100vw", opacity: 0 }, // Exit animation to reset initial state
};

const slideInFromLeftInspiration = {
  hidden: { x: "-100vw", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1, delay: 5 } },
  exit: { x: "-100vw", opacity: 0 }, // Exit animation to reset initial state
};

const ProjectObjectiveCard = ({ objective, description, imageSrc }) => {
  const { colorMode } = useColorMode();
  const underlineColor = colorMode === "dark" ? "#00DFC0" : "#00DFC0";

  return (
    <MotionBox
      w="400px"
      h="95%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      m="4"
      className="hidden"
      boxShadow="lg"
      variants={slideInFromLeftCards} // Apply arrival animation variants here
      whileHover={{ scale: 1.05, boxShadow: "xl" }} // Hover animation
    >
      {/* Image section */}
      <Image src={imageSrc} alt="Project Objective Image" />

      {/* Content section */}
      <Box p="6">
        {/* Objective Heading with Underline */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          mb="4"
          position="relative"
        >
          {objective}
          <Box
            position="absolute"
            bottom="-4"
            left="0"
            w="full"
            h="2px"
            bg={underlineColor}
          />
        </Text>

        {/* Description Point */}
        <Text
          fontSize="md"
          color={colorMode === "dark" ? "#00DFC0" : "gray.700"}
        >
          {description}
        </Text>
      </Box>
    </MotionBox>
  );
};

const Home = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate("/register");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const fadeInWithDelay = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 2 } },
  };

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const dividerWidth = useBreakpointValue({ base: "80%", md: "60%" });

  return (
    <Box>
      <Navbar />
      <Flex
        direction={{ base: "column", md: "row" }}
        mt="20"
        align="center"
        justify="center"
        textAlign={{ base: "center", md: "left" }}
        overflowX="hidden"
      >
        {/* Left block with Img1 */}
        <Box flex="1" order={{ base: 2, md: 1 }} mb={{ base: "4", md: "0" }}>
          <MotionBox
            variants={slideInFromLeftImg1}
            initial="hidden"
            animate="visible"
          >
            <Image src={Img1} alt="Image 1" borderRadius="md" />
          </MotionBox>
        </Box>

        {/* Right block with motto, underline, and sub-motto */}
        <MotionBox
          flex="1"
          order={{ base: 1, md: 2 }}
          mb={{ base: "4", md: "0" }}
          textAlign={{ md: "center" }}
        >
          {/* Motto animation */}
          <MotionBox variants={fadeIn} initial="hidden" animate="visible">
            <Text
              fontSize={{ base: "3xl", md: "6xl" }}
              fontWeight="bold"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            >
              Lost & Found
            </Text>
          </MotionBox>

          {/* Underline animation */}
          <MotionBox
            variants={underlineAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 2, when: "afterChildren" }}
          >
            <Divider
              mt="2"
              mb="2"
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto" // Set equal margins on both sides
              w={dividerWidth}
            />
          </MotionBox>

          {/* Sub-motto animation */}
          <MotionBox
            variants={fadeInWithDelay}
            initial="hidden"
            animate="visible"
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            >
              Lost It. List It. Find It.
            </Text>
          </MotionBox>
        </MotionBox>
      </Flex>

      {/* New section for Project Objectives */}
      <Box mt="20" textAlign="center">
        <MotionBox
          variants={slideInFromLeft}
          initial="hidden"
          animate="visible"
        >
          <Text
            fontSize={{ base: "3xl", md: "6xl" }}
            fontWeight="bold"
            color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          >
            Objective Of Our Project
          </Text>
        </MotionBox>

        {/* Divider for Objective */}
        <MotionBox
          variants={underlineAnimation}
          initial="hidden"
          animate="visible"
          transition={{ duration: 2, when: "afterChildren" }}
        >
          <Divider
            mt="2"
            mb="2"
            borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
            borderWidth="4px"
            mx="auto" // Set equal margins on both sides
            w={dividerWidth}
          />
        </MotionBox>

        {/* Objective Cards */}
        <MotionBox
          mt={8}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <Flex justify="center" wrap="wrap">
            {/* Added wrap prop for responsiveness */}
            {[
              {
                objective: "Lost and Found Postings",
                description:
                  "Users can share details about lost or found items with relevant information.",
                imageSrc: Img2,
                delay: 0.5,
              },
              {
                objective: "Retrieve Items",
                description:
                  "Users can search and retrieve information about lost or found items.",
                imageSrc: Img3,
                delay: 1.0,
              },
              {
                objective: "User Account Management",
                description:
                  "Users can register, log in, manage profiles for posting, retrieving items.",
                imageSrc: Img4,
                delay: 1.5,
              },
              {
                objective: "Real-time Notifications",
                description:
                  "Users get instant notifications for posted items and matching founds.",
                imageSrc: Img5,
                delay: 2.0,
              },
            ].map((card, index) => (
              <ProjectObjectiveCard
                key={index}
                objective={card.objective}
                description={card.description}
                imageSrc={card.imageSrc}
                variants={{
                  visible: { transition: { delay: card.delay } },
                }}
              />
            ))}
          </Flex>
        </MotionBox>
      </Box>

      {/* New section for Inspiration */}
      <Flex
        px={{ base: 4, md: 8 }} py={4}
        direction={{ base: "column", md: "row" }}
        mt="16" // Adjust the margin-top value for the desired gap
        align="center"
        justify="center"
        textAlign={{ base: "center", md: "left" }}
        overflowX="hidden"
      >
        {/* Left block with Inspiration heading and submotto */}
        <MotionBox
          px={{ base: 4, md: 8 }} py={4}
          flex="1"
          order={{ base: 2, md: 1 }}
          mb={{ base: "4", md: "0" }}
          textAlign={{ md: "center" }}
          variants={slideInFromLeftInspiration}
          initial="hidden"
          animate="visible"
        >
          {/* Heading for Inspiration section */}
          <MotionBox variants={fadeIn} initial="hidden" animate="visible">
            <Text
              fontSize={{ base: "3xl", md: "6xl" }}
              fontWeight="bold"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            >
              Unleashing Akatsuki Archives : A Journey into Lost & Found Magic!
            </Text>
          </MotionBox>

          {/* Underline animation */}
          <MotionBox
            variants={underlineAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 2, when: "afterChildren" }}
          >
            <Divider
              mt="2"
              mb="2"
              borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
              borderWidth="4px"
              mx="auto" // Set equal margins on both sides
              w={dividerWidth}
            />
          </MotionBox>

          {/* Sub-motto for Inspiration section */}
          <MotionBox
            variants={fadeInWithDelay}
            initial="hidden"
            animate="visible"
            mt="12" // Adjust the margin-top value for the desired gap
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            >
              Embarking on Akatsuki Archives, we're on a quest to revolutionize
              the lost and found game. This isn't just a tech project; it's a
              symphony of empathy and innovation. Picture a digital realm where
              lost items aren't just found—they become the heroes of shared
              stories. Join us, and let's make 'lost and found' legendary. 🚀🔍
              #TheAkatsukiz
            </Text>
          </MotionBox>
        </MotionBox>

        {/* Right block with Img1 */}
        <MotionBox
          flex="1"
          order={{ base: 1, md: 2 }}
          mb={{ base: "4", md: "0" }}
          textAlign={{ md: "center" }}
          variants={slideInFromRightImg6}
          initial="hidden"
          animate="visible"
        >
          <Image src={Img6} alt="Inspiration Image" borderRadius="md" />
        </MotionBox>
      </Flex>

      {/* New section for Project Objectives */}
      <Box mt="20" textAlign="center">
        <MotionBox
          variants={slideInFromLeft}
          initial="hidden"
          animate="visible"
        >
          <Text
            fontSize={{ base: "3xl", md: "6xl" }}
            fontWeight="bold"
            color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          >
            How It Works ?
          </Text>
        </MotionBox>

        {/* Divider for How It Works */}
        <MotionBox
          variants={underlineAnimation}
          initial="hidden"
          animate="visible"
          transition={{ duration: 2, when: "afterChildren" }}
        >
          <Divider
            mt="2"
            mb="2"
            borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
            borderWidth="4px"
            mx="auto" // Set equal margins on both sides
            w={dividerWidth}
          />
        </MotionBox>

        {/* Steps Cards */}
        <MotionBox
          mt={8}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <Flex justify="center" wrap="wrap">
            {/* Added wrap prop for responsiveness */}
            {[
              {
                step: "User Registration and Profile Creation",
                description:
                  "To get started, users have to register and create a profile. This personalized account provides access to powerful features, allowing them to post details about lost or found items.",
                imageSrc: Img7,
                delay: 0.5,
              },
              {
                step: "Effortless Item Posting and Seamless Item Discovery",
                description:
                  "After logging in, users can post comprehensive details about lost or found items. The system's smart search and discovery feature enables efficient browsing, helping users find what they're looking for.",
                imageSrc: Img2,
                delay: 1.0,
              },
              {
                step: "Real-time Notifications and Secure Communication",
                description:
                  "Stay updated with real-time notifications about posted items and matches. The integrated messaging system ensures secure communication between item owners and finders, facilitating the return process.",
                imageSrc: Img8,
                delay: 1.5,
              },
              {
                step: "User-Friendly Account Management and Community Engagement",
                description:
                  "Easily manage user profiles, log in, and register. Personalize profiles to enhance the lost and found experience and engage with the community in an interactive forum dedicated to sharing experiences and tips.",
                imageSrc: Img9,
                delay: 2.0,
              },
              {
                step: "Location-Based Services for Targeted Results",
                description:
                  "Leverage location-based services to narrow down search results based on geographical proximity. Whether looking for items locally or globally, users can easily find what they need through our intuitive system.",
                imageSrc: Img10,
                delay: 2.5,
              },
            ].map((card, index) => (
              <div key={index} style={{ height: "675px", margin: "10px" }}>
                <ProjectObjectiveCard
                  objective={card.step}
                  description={card.description}
                  imageSrc={card.imageSrc}
                  variants={{
                    visible: { transition: { delay: card.delay } },
                  }}
                />
              </div>
            ))}
          </Flex>
        </MotionBox>
      </Box>

      {/* "Get Started" Button */}
      <Flex justify="center" mt={8}>
        <Button
          size="lg"
          colorScheme={colorMode === "dark" ? "teal" : "blue"}
          variant="outline"
          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
          backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"} // Adjust background color
          _hover={{
            backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
            color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
          }}
          onClick={navigateToRegister}
        >
          Get Started
        </Button>
      </Flex>
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default Home;