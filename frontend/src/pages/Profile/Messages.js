import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  useColorMode,
  Text,
  Avatar,
} from "@chakra-ui/react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";
import TypingBar from "./MessageTypingBar";

const Profile = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const buttonColor = colorMode === "dark" ? "#00DFC0" : "#385A64";
  const borderColor = "#00DFC0";

  const users = [
    { name: "Debabrata Barik", messages: [] },
    { name: "Dharamveer Kumar", messages: [] },
    { name: "Debraj Pal", messages: [] },
    { name: "Rajdeep Biswas", messages: [] },
    { name: "Manoj Gujjar", messages: [] },
  ];

  // Generate unique messages for each user
  users.forEach((user) => {
    for (let i = 0; i < 2; i++) {
      let message;
      if (i === 0) {
        message = `Hello, I am ${user.name}. Nice to meet you!`;
      } else {
        const itemType = i % 1 === 0 ? "lost" : "found";
        const itemName = itemType === "lost" ? "iPhone" : "iPhone";
        const location =
          itemType === "lost" ? "at your class" : "at your class";
        const importance = itemType === "lost" ? "very important" : "valuable";
        message = `I ${itemType} my ${itemName} ${location}. It's ${importance}. Have you seen it?`;
      }
      user.messages.push({ content: message, sender: i % 1 === 0 });
    }
  });

  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are loaded or updated
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [selectedUserMessages]);

  const renderUsers = () => {
    return users.map((user, index) => (
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
          setSelectedUserMessages(user.messages);
        }}
      >
        <Flex align="center">
          <Avatar size="md" name={user.name} />
          <Text ml={2}>{user.name}</Text>
        </Flex>
      </Box>
    ));
  };

  const renderMessages = (userMessages) => {
    return userMessages.map((message, index) => (
      <Box
        key={index}
        bg={colorMode === "light" ? "gray.50" : "gray.950"}
        p={2}
        borderRadius="lg"
        textAlign={message.sender ? "right" : "left"}
      >
        {message.content}
      </Box>
    ));
  };

  return (
    <Flex flexDirection="column" minHeight="100vh">
      {isLargerThan768 && <ProfileSidebar />}
      <ProfileNavbar />
      <Flex flexGrow={1}>
        <Box ml={isLargerThan768 ? "17%" : 0} flex="1">
          <Flex direction="column" height="100%" p={2}>
            <Flex
              flex="1"
              borderRadius="15px"
              border="1px"
              borderColor={borderColor}
            >
              {/* Left sidebar for users */}
              <Box
                w="20%"
                h="100%"
                bg={colorMode === "light" ? "gray.100" : "gray.900"}
                borderTopLeftRadius="15px"
                borderBottomLeftRadius="15px"
                p={2}
              >
                {/* Dummy users list */}
                {renderUsers()}
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
                <Box
                  ref={chatContainerRef}
                  flex="1"
                  overflowY="auto"
                  padding="4"
                  mb={300}
                >
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
                    mt={10}
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
          </Flex>
        </Box>
      </Flex>
      <ProfileFooter />
    </Flex>
  );
};

export default Profile;