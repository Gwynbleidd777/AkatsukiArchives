import React, { useState } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  Input,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import Sidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";

const Profile = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { colorMode } = useColorMode();
  const buttonColor = colorMode === "dark" ? "#00DFC0" : "#385A64";
  const buttonBgColor = colorMode === "dark" ? "#2D3748" : "#00DFC0";
  const buttonHoverBgColor = colorMode === "dark" ? "#385A64" : "#2D3748";
  const borderColor = "#00DFC0";

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { text: newMessage, isUser: true }]);
    setNewMessage("");
    // Call function to handle sending message to chatbot service
    // handleSendToChatbot(newMessage);
  };

  return (
    <Box>
      {isLargerThan768 && <Sidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <ProfileNavbar />
        <Flex direction="column" align="center" mt={4} mb={4}>
          <Box
            width="1250px"
            height="550px"
            maxWidth="98%"
            maxHeight="98%"
            borderRadius="15px"
            border="1px"
            borderColor={borderColor}
            p={4}
            boxShadow="md"
            bg={colorMode === "light" ? "gray.100" : "gray.900"}
          >
            <Flex direction="column" height="100%">
              {/* Display "How can I help you today?" text if there are no messages */}
              {messages.length === 0 && (
                <Box
                  position="absolute"
                  top="50%"
                  left="58%"
                  transform="translate(-50%, -50%)"
                  zIndex="1"
                  textAlign="center"
                  fontSize="3xl"
                  fontWeight="bold"
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  mb={4}
                >
                  How can I help you today?
                </Box>
              )}

              {/* Chat messages */}
              <Flex direction="column" flex="1" overflowY="auto">
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    alignSelf={msg.isUser ? "flex-end" : "flex-start"}
                    bg={
                      msg.isUser
                        ? colorMode === "dark"
                          ? "#00DFC0"
                          : "#385A64"
                        : "gray.200"
                    }
                    color={msg.isUser ? "white" : "black"}
                    borderRadius="md"
                    p={2}
                    mt={2}
                    maxW="70%"
                  >
                    {msg.text}
                  </Box>
                ))}
              </Flex>

              {/* Input box for new message */}
              <Flex mt={4}>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  borderRadius="10px"
                  focusBorderColor={
                    colorMode === "dark" ? "#00DFC0" : "#385A64"
                  }
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />

                <Button
                  ml={2}
                  colorScheme="teal"
                  variant="outline"
                  color={buttonColor}
                  backgroundColor={buttonBgColor}
                  _hover={{
                    backgroundColor: buttonHoverBgColor,
                    color: buttonColor,
                  }}
                  onClick={handleSendMessage}
                  borderRadius="10px"
                >
                  Send
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <ProfileFooter />
    </Box>
  );
};

export default Profile;
