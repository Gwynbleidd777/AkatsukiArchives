// ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import { Flex, Button, useColorMode } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scrolled = document.documentElement.scrollTop;
    setIsVisible(scrolled > window.innerHeight / 2);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    style={{
      position: "fixed",
      bottom: "2rem",
      right: "1rem", // Adjusted to position it near the left corner
    }}
  >
      <Button
        onClick={scrollToTop}
        colorScheme="teal"
        variant="solid"
        size="sm"
        bgColor={colorMode === "dark" ? "rgba(0,223,192,0.7)" : "rgba(56,90,100,0.7)"}
        color={colorMode === "dark" ? "white" : "black"}
        borderRadius="25%" // This makes the button rounded
      >
        <Flex align="center" justify="center">
          <ArrowUpIcon />
        </Flex>
      </Button>
    </motion.div>
  );
};

export default ScrollToTopButton;
