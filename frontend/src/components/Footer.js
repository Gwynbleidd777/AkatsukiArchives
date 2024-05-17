// Footer.jsx
import React from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box
        as="footer"
        bgColor={colorMode === "dark" ? "gray.900" : "gray.100"}
        color={colorMode === "dark" ? "white" : "gray.800"}
        py="8"
        mt="12"
        px={{ base: 12, md: 4 }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          maxW="container.xl"
          mx="auto"
        >
          {/* Your Footer Content */}
          <Box flex={{ base: "1", md: "2" }}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"} // Set the color accordingly
            >
              Akatsuki Archives
            </Text>
            <Text mt="4" mb="4" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>
              Akatsuki Archives is a revolutionary digital platform that
              transforms lost and found experiences into shared narratives.
              Seamlessly blending technology with empathy, it introduces a
              symphony of innovation and compassion. The platform serves as a
              centralized hub for users to share details about lost or found
              items, fostering community-driven recovery. Users benefit from
              features like real-time notifications, smart search, and secure
              communication for swift item return. Beyond conventional
              functionalities, Akatsuki Archives offers a user-friendly
              environment for account management, community engagement, and
              personalized profiles. It is not just a tech project; it is a
              digital symphony harmonizing technology with the emotional
              narratives of lost items. Inspired by the mythical Akatsuki, the
              platform invites users to be part of a legendary quest,
              transforming the 'lost and found' narrative into an epic journey.
              Join Akatsuki Archives and make lost items the heroes of their own
              stories. 🚀🔍 #TheAkatsukiz
            </Text>
          </Box>

          <Flex mt={{ base: "4", md: "0" }}>
            <Flex direction="column" align="flex-start" mx="4">
              <Text fontWeight="bold" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>Explore</Text>
              <Link mt="2" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>Home</Link>
              <Link mt="2"color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>About Us</Link>
              <Link mt="2" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>Contact</Link>
            </Flex>

            <Flex direction="column" align="flex-start" mx="4">
              <Text fontWeight="bold" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>Connect</Text>
              <Link mt="2" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>Github</Link>
              <Link mt="2" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>LinkedIn</Link>
              <Link mt="2" color={colorMode === "dark" ? "#00DFC0" : "#385A64"}>Twitter</Link>
            </Flex>
          </Flex>
        </Flex>

      </Box>

      {/* Sub-Footer */}
      <Box
        as="footer"
        bgColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        color={colorMode === "dark" ? "white" : "gray.800"}
        py="2"
        px={{ base: 12, md: 4 }}
      >
        <Flex
          direction="row"
          align="center"
          justify="space-between"
          maxW="container.xl"
          mx="auto"
        >
          <Text fontWeight="bold" color={colorMode === "dark" ? "" : "#385A64"}>© 2024 Akatsukiz</Text>
          <Flex>
            {/* Social Icons on the right */}
            <IconButton
              as={Link}
              href="https://github.com/your-github"
              target="_blank"
              aria-label="GitHub"
              icon={<FaGithub />}
              mx="2"
              fontSize="xl"
            />
            <IconButton
              as={Link}
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
              mx="2"
              fontSize="xl"
            />
            <IconButton
              as={Link}
              href="https://twitter.com/your-twitter"
              target="_blank"
              aria-label="Twitter"
              icon={<FaTwitter />}
              mx="2"
              fontSize="xl"
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Footer;
