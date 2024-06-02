import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Flex,
  Text,
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Image,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Divider,
  useBreakpointValue,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { EmailIcon, LockIcon, ViewIcon } from "@chakra-ui/icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import Img from "../../Logo/Img13.png";
import GoImg from "../../Logo/g1.png";
import axios from "axios";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionImage = motion(Image);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFloating, setIsFormFloating] = useState(false);
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const avatarColor = colorMode === "light" ? "#385A64" : "teal.300";
  const iconColor = colorMode === "light" ? "#385A64" : "#00DFC0";
  const dividerWidth = useBreakpointValue({ base: "40%", md: "30%" });

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const formFloatingAnimation = {
    floating: { scale: 1.05 },
    normal: { scale: 1 },
  };

  const handleFormFloating = (isFloating) => {
    setIsFormFloating(isFloating);
  };

  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast({
          title: "Empty Fields",
          description: "Please enter both email and password.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const token = response.data.token;

        // Store the token in local storage
        localStorage.setItem("token", token);
        console.log("Received token:", token);

        // Check if the user is an admin
        const isAdmin = response.data.isAdmin;

        // Redirect based on user role
        if (isAdmin) {
          // Redirect to admin dashboard for admin user
          navigate("/admin-dashboard");
        } else {
          // Redirect to all-items for normal users
          navigate("/all-items");
        }

        toast({
          title: "Login Successful",
          description: "Welcome to your account!",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      <Navbar />
      <Flex
        align="center"
        justify="center"
        mt="10"
        minHeight="80vh"
        flexDirection={isSmallScreen ? "column" : "row"}
      >
        {isSmallScreen ? (
          <>
            <MotionBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={8}
              mt={50}
              mb={4}
              width="100%"
            >
              <MotionBox mb={{ base: 4, md: 0 }}>
                <MotionImage
                  src={Img}
                  alt="Image"
                  borderRadius={{ base: 8, md: 0 }}
                  variants={fadeInAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                />
              </MotionBox>
            </MotionBox>

            <MotionBox
              p={8}
              width="100%"
              maxWidth={{ base: "400px", md: "600px" }}
              borderRadius={{ base: 25, md: 25 }}
              boxShadow="xl"
              bg={colorMode === "light" ? "white" : "gray.700"}
              border="1px"
              borderColor={colorMode === "light" ? "#385A64" : "#00DFC0"}
              variants={formFloatingAnimation}
              animate={isFormFloating ? "floating" : "normal"}
              transition={{ duration: 0.25 }}
            >
              <MotionHeading
                mb={4}
                textAlign={{ base: "center", md: "center" }}
                color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                variants={fadeInAnimation}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1.25 }}
              >
                Sign In
              </MotionHeading>

              <MotionBox
                variants={underlineAnimation}
                initial="hidden"
                animate="visible"
                transition={{ duration: 2 }}
              >
                <Divider
                  mt="-2"
                  mb="10"
                  borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
                  borderWidth="4px"
                  mx="auto"
                  w={dividerWidth}
                />
              </MotionBox>

              <form>
                <FormControl maxWidth={{ base: "100%", md: "100%" }} mb={4}>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  >
                    Email
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color={avatarColor} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      width="100%"
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      focusBorderColor={
                        colorMode === "light" ? "#385A64" : "#00DFC0"
                      }
                      onFocus={() => handleFormFloating(true)}
                      onBlur={() => handleFormFloating(false)}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl maxWidth={{ base: "100%", md: "100%" }} mb={4}>
                  <FormLabel color={iconColor}>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color={avatarColor} />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      width="100%"
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      focusBorderColor={
                        colorMode === "light" ? "#385A64" : "#00DFC0"
                      }
                      onFocus={() => handleFormFloating(true)}
                      onBlur={() => handleFormFloating(false)}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        onClick={togglePasswordVisibility}
                        icon={<ViewIcon color={iconColor} />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Text
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  textAlign="right"
                  fontSize="sm"
                  textDecoration="underline"
                >
                  <Link to="/forgot-password">Forgot Password?</Link>
                </Text>

                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleFormSubmit}
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  mt={7}
                  width="100%"
                >
                  Sign In
                </Button>

                <Flex
                  align="center"
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  mt={3}
                >
                  <Divider
                    flex="1"
                    borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  />
                  <Text mx={2}>OR</Text>
                  <Divider
                    flex="1"
                    borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  />
                </Flex>

                <Button
                  colorScheme="teal"
                  variant="outline"
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  mt={3}
                  width="100%"
                >
                  <Image
                    src={GoImg}
                    alt="Google Icon"
                    boxSize="6"
                    marginRight="2"
                  />
                  Continue with Google
                </Button>
              </form>
            </MotionBox>
          </>
        ) : (
          <>
            <MotionBox
              p={8}
              mt={{ base: "4%", md: -50 }}
              mb={{ base: "4%", md: 0 }}
              width={{ base: "100%", md: "50%" }}
              maxWidth={{ base: "400px", md: "600px" }}
              borderRadius={{ base: 25, md: 25 }}
              boxShadow="xl"
              bg={colorMode === "light" ? "white" : "gray.700"}
              border="1px"
              borderColor={colorMode === "light" ? "#385A64" : "#00DFC0"}
              variants={formFloatingAnimation}
              animate={isFormFloating ? "floating" : "normal"}
              transition={{ duration: 0.25 }}
            >
              <MotionHeading
                mb={4}
                textAlign={{ base: "center", md: "center" }}
                color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                variants={fadeInAnimation}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1.25 }}
              >
                Sign In
              </MotionHeading>

              <MotionBox
                variants={underlineAnimation}
                initial="hidden"
                animate="visible"
                transition={{ duration: 2 }}
              >
                <Divider
                  mt="-2"
                  mb="10"
                  borderColor={colorMode === "dark" ? "#00DFC0" : "#00DFC0"}
                  borderWidth="4px"
                  mx="auto"
                  w={dividerWidth}
                />
              </MotionBox>

              <form>
                <FormControl maxWidth={{ base: "100%", md: "100%" }} mb={4}>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  >
                    Email
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color={avatarColor} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      width="100%"
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      focusBorderColor={
                        colorMode === "light" ? "#385A64" : "#00DFC0"
                      }
                      onFocus={() => handleFormFloating(true)}
                      onBlur={() => handleFormFloating(false)}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl maxWidth={{ base: "100%", md: "100%" }} mb={4}>
                  <FormLabel color={iconColor}>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color={avatarColor} />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      width="100%"
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      focusBorderColor={
                        colorMode === "light" ? "#385A64" : "#00DFC0"
                      }
                      onFocus={() => handleFormFloating(true)}
                      onBlur={() => handleFormFloating(false)}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        onClick={togglePasswordVisibility}
                        icon={<ViewIcon color={iconColor} />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Text
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  textAlign="right"
                  fontSize="sm"
                  textDecoration="underline"
                >
                  <Link to="/forgot-password">Forgot Password?</Link>
                </Text>

                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleFormSubmit}
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  mt={7}
                  width="100%"
                >
                  Sign In
                </Button>

                {/* <Flex
                  align="center"
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  mt={3}
                >
                  <Divider
                    flex="1"
                    borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  />
                  <Text mx={2}>OR</Text>
                  <Divider
                    flex="1"
                    borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  />
                </Flex>

                <Button
                  colorScheme="teal"
                  variant="outline"
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                  }}
                  mt={3}
                  width="100%"
                >
                  <Image
                    src={GoImg}
                    alt="Google Icon"
                    boxSize="6"
                    marginRight="2"
                  />
                  Continue with Google
                </Button> */}
              </form>
            </MotionBox>

            <MotionBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={8}
              mt={{ base: "4%", md: 50 }}
              mb={{ base: "4%", md: 0 }}
              width={{ base: "100%", md: "50%" }}
              height="100%"
            >
              <MotionBox mb={{ base: 4, md: 0 }}>
                <MotionImage
                  src={Img}
                  alt="Image"
                  borderRadius={{ base: 8, md: 0 }}
                  variants={fadeInAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                />
              </MotionBox>
            </MotionBox>
          </>
        )}
      </Flex>
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default Login;
