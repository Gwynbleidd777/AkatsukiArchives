import React from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";

const AdminFooter = () => {
    const { colorMode } = useColorMode();

  return (
    <>
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
          justify="center"
          maxW="container.xl"
          mx="auto"
        >
          <Text fontWeight="bold" color={colorMode === "dark" ? "" : "#385A64"}>© 2024 Akatsukiz</Text>
        </Flex>
      </Box>
    </>
  )
}

export default AdminFooter;
