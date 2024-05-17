import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  useColorMode,
  Text,
  Avatar,
} from "@chakra-ui/react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import ScrollToTopButton from "../../components/ScrollUp";
import AdminFooter from "./AdminFooter";
import TypingBar from "../Profile/MessageTypingBar";

const AdminMessages = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const buttonColor = colorMode === "dark" ? "#00DFC0" : "#385A64";
  const borderColor = "#00DFC0";

  const users = [
    { name: "Abhishek Tripati" },
    { name: "Animesh Kumar Sur" },
    { name: "Rajdeep Biswas" },
    { name: "Dip Kumar Chowdhury" },
    { name: "Krishanu Chakraborty" },
    { name: "Nilu Dutta" },
    { name: "Sujata Mondal" },
    { name: "Mohit Das" },
  ];

  const initialMessages = [
    "Hi, My name is ",
    "Hello ",
  ];

  // Generate unique messages for each user
  const generateMessages = () => {
    const messages = [];
    users.forEach((user, index) => {
      const message = [];
      initialMessages.forEach((msg, i) => {
        if (i === 0) {
          message.push({ content: msg + user.name + ".", sender: true });
        } else if (i === 1) {
          message.push({ content: "Hello " + user.name + ", how may I help you?", sender: false });
        } else {
          message.push({ content: msg, sender: true });
        }
      });
      messages.push({ name: user.name, messages: message });
    });
    return messages;
  };

  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are loaded or updated
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [selectedUserMessages]);

  const renderMessages = (userMessages) => {
    return userMessages.map((message, index) => (
      <Box
        key={index}
        bg={colorMode === "light" ? "gray.200" : "gray.700"}
        p={2}
        borderRadius="lg"
        textAlign={message.sender ? "left" : "right"}
        ml={message.sender ? "0" : "auto"}
        mr={message.sender ? "auto" : "0"}
        color={message.sender ? (colorMode === "light" ? "gray.700" : "white") : (colorMode === "light" ? "gray.700" : "white")}
      >
        {message.content}
      </Box>
    ));
  };

  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />
        <Box height="100vh" p={4}>
          {" "}
          {/* Adding padding to create a gap from all sides */}
          <Flex
            flex="1"
            borderRadius="15px"
            border="1px"
            borderColor={borderColor}
          >
            {/* Left sidebar for users */}
            <Box
              w="25%"
              h="665px"
              bg={colorMode === "light" ? "gray.100" : "gray.900"}
              borderTopLeftRadius="15px"
              borderBottomLeftRadius="15px"
              p={2}
            >
              {/* Dummy users list */}
              {users.map((user, index) => (
                <Box
                  key={index}
                  _hover={{
                    bg: colorMode === "light" ? "gray.200" : "gray.800",
                  }}
                  borderRadius="md"
                  cursor="pointer"
                  p={2}
                  mb={1}
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedUserMessages(generateMessages().find((msg) => msg.name === user.name).messages);
                  }}
                >
                  <Flex align="center">
                    <Avatar size="md" name={user.name} />
                    <Text ml={2}>{user.name}</Text>
                  </Flex>
                </Box>
              ))}
            </Box>

            <Box
              flex="1"
              bg={colorMode === "light" ? "gray.50" : "gray.950"}
              borderTopRightRadius="15px"
              borderBottomRightRadius="15px"
              position="relative"
            >
              {selectedUser && (
                <Flex
                  justify="center"
                  align="center"
                  bg={colorMode === "light" ? "gray.100" : "gray.900"}
                  borderTopRightRadius="15px"
                  p={2}
                  position="sticky"
                  top="0"
                  zIndex="sticky"
                >
                  <Avatar size="sm" name={selectedUser.name} />
                  <Text ml={2}>{selectedUser.name}</Text>
                </Flex>
              )}
              <Box ref={chatContainerRef} flex="1" overflowY="auto" padding="4" mb={350}>
                {/* Render messages */}
                {selectedUser ? (
                  renderMessages(selectedUserMessages)
                ) : (
                  <Text
                    color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="xl"
                    mt="25%"
                  >
                    Click On Any User Account To Open Their Chats
                  </Text>
                )}
              </Box>
              {/* Typing bar */}
              {selectedUser && (
                <TypingBar
                  buttonColor={buttonColor}
                  style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Flex>
        </Box>

        <AdminFooter />
      </Box>
      <ScrollToTopButton />
    </Box>
  );
};

export default AdminMessages;
