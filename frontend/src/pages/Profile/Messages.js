import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  useColorMode,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileSidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";
import TypingBar from "./MessageTypingBar";

const Profile = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { user1: userId, user2: localStorage.getItem("userId") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatId(response.data._id);
      fetchMessages(response.data._id);
    };

    const fetchMessages = async (chatId) => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/messages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
    };

    fetchChat();
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/message",
      { chatId, sender: localStorage.getItem("userId"), content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMessages((prevMessages) => [...prevMessages, response.data]);
  };

  const renderMessages = (messages) => {
    return messages.map((message, index) => (
      <Box
        key={index}
        bg={colorMode === "light" ? "gray.50" : "gray.950"}
        p={2}
        borderRadius="lg"
        textAlign={message.sender._id === localStorage.getItem("userId") ? "right" : "left"}
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
              borderColor="#00DFC0"
            >
              <Box
                flex="1"
                bg={colorMode === "light" ? "gray.50" : "gray.950"}
                borderTopRightRadius="15px"
                borderBottomRightRadius="15px"
                position="relative"
              >
                <Box
                  ref={chatContainerRef}
                  flex="1"
                  overflowY="auto"
                  padding="4"
                  mb={300}
                >
                  {renderMessages(messages)}
                </Box>
                <TypingBar sendMessage={sendMessage} />
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
