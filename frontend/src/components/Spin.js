import React from "react";
import { Spinner as ChakraSpinner, Box } from "@chakra-ui/react";

const Spinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <ChakraSpinner
        thickness="5px"
        speed="0.75s"
        emptyColor="gray.200"
        color="teal.500"
        size="lg"
      />
    </Box>
  );
};

export default Spinner;
