import React from "react";
import {
  Box,
  Stack,
  Button,
  Divider,
  useToast,
  Image,
  Flex,
  useColorMode,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdShoppingBasket,
  MdMessage,
  MdHelp,
  MdFeedback,
  MdExitToApp,
  MdPerson,
} from "react-icons/md";
import Logo1 from "../../Logo/LogoB.png";
import Logo2 from "../../Logo/LogoW.png";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(
        "http://localhost:5000/api/auth/logout"
      );
      if (response.status === 200) {
        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/");
        }, 1000);

        setTimeout(() => {
          toast({
            title: "Logged Out Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Determine color values based on color mode
  const highlightColor = colorMode === "dark" ? "#00DFC0" : "#00DFC0";
  const textColor = colorMode === "dark" ? "#FFFFFF" : "#385A64";
  const hoverColor = colorMode === "dark" ? "#00DFC0" : "lightgrey";

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      w="17%"
      bg={colorMode === "dark" ? "#1A202C" : "#FFFFFF"}
      boxShadow="0 0px 6px 4px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
    >
      <Flex
        align="center"
        onClick={() => navigateTo("/all-items")}
        cursor="pointer"
      >
        <Image
          src={colorMode === "dark" ? Logo2 : Logo1}
          alt={colorMode === "dark" ? "Dark Logo" : "Light Logo"}
          style={{ width: "210px", height: "70px" }}
          mb={5}
        />
      </Flex>
      <Stack spacing={3} mt={4}>
        <SidebarItem
          icon={<MdPerson size={30} />}
          label="Profile"
          path="/profile"
          active={location.pathname === "/profile"}
          onClick={() => navigateTo("/profile")}
          highlightColor={highlightColor}
          textColor={textColor}
          hoverColor={hoverColor}
        />
        <Divider />

        {/* Interactions Section */}
        <Heading
          as="h2"
          size="md"
          fontSize="sm"
          pl={7}
          mt={2}
          color={textColor}
        >
          Interactions
        </Heading>
        <SidebarItem
          icon={<MdShoppingBasket size={30} />}
          label="My Items"
          path="/my-items"
          active={location.pathname === "/my-items"}
          onClick={() => navigateTo("/my-items")}
          highlightColor={highlightColor}
          textColor={textColor}
          hoverColor={hoverColor}
        />
        <SidebarItem
          icon={<MdMessage size={30} />}
          label="Messages"
          path="/messages"
          active={location.pathname === "/messages"}
          onClick={() => navigateTo("/messages")}
          highlightColor={highlightColor}
          textColor={textColor}
          hoverColor={hoverColor}
        />
        <Divider mt={4} />

        {/* Assistance & Feedback Section */}
        <Heading
          as="h2"
          size="md"
          fontSize="sm"
          pl={7}
          mt={2}
          color={textColor}
        >
          Assistance
        </Heading>
        <SidebarItem
          icon={<MdHelp size={30} />}
          label="Help & Support"
          path="/help"
          active={location.pathname === "/help"}
          onClick={() => navigateTo("/help")}
          highlightColor={highlightColor}
          textColor={textColor}
          hoverColor={hoverColor}
        />
        <SidebarItem
          icon={<MdFeedback size={30} />}
          label="Feedback"
          path="/feedback"
          active={location.pathname === "/feedback"}
          onClick={() => navigateTo("/feedback")}
          highlightColor={highlightColor}
          textColor={textColor}
          hoverColor={hoverColor}
        />
      </Stack>

      <Divider mt={4} />
      <Stack spacing={3} mt={4}>
        <Button
          leftIcon={<MdExitToApp size={30} />}
          variant="ghost"
          size="lg"
          color={textColor}
          onClick={handleLogout}
          _hover={{ color: hoverColor }}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
};

const SidebarItem = ({
  icon,
  label,
  active,
  onClick,
  highlightColor,
  textColor,
  hoverColor,
}) => {
  return (
    <Button
      leftIcon={React.cloneElement(icon, { color: textColor })}
      colorScheme="none"
      variant={active ? "solid" : "outline"}
      size="md"
      onClick={onClick}
      justifyContent="flex-start"
      fontWeight={active ? "bold" : "normal"}
      px={6}
      height="50px"
      border="none"
      bg={active ? highlightColor : "transparent"}
      color={textColor}
      _hover={{ bg: active ? null : hoverColor }}
      sx={{
        borderTopRightRadius: active ? "100px" : "0",
        borderBottomRightRadius: active ? "20px" : "0",
      }}
    >
      {label}
    </Button>
  );
};

export default Sidebar;