import React, { useState } from "react";
import { Box, Input, Button, Flex } from "@chakra-ui/react";

const TypingBar = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <Flex
    >
      <Input
        flex="1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <Button ml={2} onClick={handleSend} colorScheme="teal">
        Send
      </Button>
    </Flex>
  );
};

export default TypingBar;
