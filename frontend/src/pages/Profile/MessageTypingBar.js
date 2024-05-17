import React from "react";
import { Flex, Input, IconButton } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

const TypingBar = ({ buttonColor }) => {
  return (
    <Flex align="center" p={4} borderTop="1px" borderColor="gray.200">
      <Input placeholder="Type your message here..." flex="1" mr={2} />
      <IconButton
        aria-label="Send"
        icon={<FiSend />}
        colorScheme="blue"
        size="sm"
        color={buttonColor}
      />
    </Flex>
  );
};

export default TypingBar;
