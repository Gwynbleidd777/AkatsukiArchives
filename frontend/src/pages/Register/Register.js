import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
  Checkbox,
  Link,
  useToast,
  HStack,
  PinInputField,
  PinInput,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";
import { EmailIcon, LockIcon, ViewIcon, Icon } from "@chakra-ui/icons";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import Img from "../../Logo/Img12.png";
import { Link as RouterLink } from "react-router-dom";
import GoImg from "../../Logo/g1.png";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionImage = motion(Image);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFloating, setIsFormFloating] = useState(false);
  const { colorMode } = useColorMode();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consentChecked, setConsentChecked] = useState(true);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOTPSent] = useState(false);
  const toast = useToast();
  const avatarColor = colorMode === "light" ? "#385A64" : "teal.300";
  const iconColor = colorMode === "light" ? "#385A64" : "#00DFC0";
  const dividerWidth = useBreakpointValue({ base: "40%", md: "30%" });
  const location = useLocation();
  const isRegisterRoute = location.pathname === "/register";

  const handlePinInputChange = (index, value) => {
    let updatedOTP = enteredOTP;
    updatedOTP =
      updatedOTP.substring(0, index) + value + updatedOTP.substring(index + 1);
    setEnteredOTP(updatedOTP);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const handleRegister = async () => {
    try {
      if (!fullName || !email || !password || !confirmPassword) {
        toast({
          title: "Empty Fields",
          description: "Please Fill In All The Fields ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (fullName.length < 3) {
        toast({
          title: "Invalid Full Name",
          description: "Name Must Be At Least 3 Characters Long ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!fullName.trim().includes(" ")) {
        toast({
          title: "Invalid Full Name",
          description: "Please Enter Your Full Name ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!email.includes("@") || !email.includes(".com")) {
        toast({
          title: "Invalid Email",
          description: "Email Must Contain '@' And '.com' ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords Do Not Match ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast({
          title: "Invalid Password",
          description:
            "A Valid Password Must Contain More Than 8 Characters, An Uppercase Letter, A Lowercase Letter, A Number And A Special Character ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!consentChecked) {
        toast({
          title: "Terms and Policy Consent",
          description: "Please Consent To The Terms & Privacy Policy ☹",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const checkUserResponse = await fetch(
        "http://localhost:5000/api/auth/check-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const userData = await checkUserResponse.json();

      if (checkUserResponse.ok) {
        toast({
          title: "User already registered",
          description: "You are already registered in the system.",
          status: "info",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      } else {
        const otpResponse = await fetch(
          "http://localhost:5000/api/otpRoutes/generate-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        const otpData = await otpResponse.json();

        if (otpResponse.ok) {
          setOTPSent(true);
          toast({
            title: "OTP Sent 📬",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Failed to send OTP ☹",
            description: otpData.message || "Something went wrong",
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOTPVerification = async () => {
    try {
      const otpVerificationResponse = await fetch(
        "http://localhost:5000/api/otpRoutes/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: enteredOTP,
            email,
          }),
        }
      );

      const otpVerificationData = await otpVerificationResponse.json();

      console.log("Entered OTP:", enteredOTP);

      if (otpVerificationResponse.ok) {
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName,
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "OTP Verified ✅ Registration Successful 🥳",
            description: "Wait! We are redirecting you to the login page.",
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);

          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          toast({
            title: "Registration Failed ☹",
            description: data.message || "Something went wrong",
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
          });
          setIsLoading(false);
        }
      } else {
        toast({
          title: "OTP Verification Failed ☹",
          description: otpVerificationData.message || "Incorrect OTP",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Flex
        align="center"
        justify="center"
        mt="16"
        minHeight="80vh"
        flexDirection={{ base: "column", md: "row" }}
      >
        <MotionBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={8}
          mt={{ base: "4%", md: "4%" }}
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

        <MotionBox
          p={8}
          mt={{ base: "4%", md: "4%" }}
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
            Register
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
              <FormLabel color={colorMode === "light" ? "#385A64" : "#00DFC0"}>
                Full Name
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUserCircle} color={avatarColor} boxSize={6} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Enter Your Full Name"
                  width="100%"
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  focusBorderColor={
                    colorMode === "light" ? "#385A64" : "#00DFC0"
                  }
                  onFocus={() => handleFormFloating(true)}
                  onBlur={() => handleFormFloating(false)}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl maxWidth={{ base: "100%", md: "100%" }} mb={4}>
              <FormLabel color={colorMode === "light" ? "#385A64" : "#00DFC0"}>
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

            <FormControl maxWidth={{ base: "100%", md: "100%" }} mb={4}>
              <FormLabel color={iconColor}>Confirm Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color={avatarColor} />
                </InputLeftElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Your Password"
                  width="100%"
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  focusBorderColor={
                    colorMode === "light" ? "#385A64" : "#00DFC0"
                  }
                  onFocus={() => handleFormFloating(true)}
                  onBlur={() => handleFormFloating(false)}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <FormControl
              maxWidth={{ base: "100%", md: "100%" }}
              mt={{ base: 3, md: 5 }}
            >
              <Checkbox
                defaultChecked
                size={{ base: "md", md: "lg" }}
                colorScheme="teal"
                fontSize={{ base: "sm", md: "lg" }}
                onChange={(e) => setConsentChecked(e.target.checked)}
              >
                I consent to the{" "}
                <Link
                  as={RouterLink}
                  to="/terms"
                  target="_blank"
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  textDecoration="underline"
                  _hover={{
                    color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                  }}
                >
                  Terms & Privacy Policy.
                </Link>
              </Checkbox>
            </FormControl>

            <Button
              isLoading={otpSent}
              spinner={<BeatLoader size={8} color="white" />}
              colorScheme="teal"
              variant="outline"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
              _hover={{
                backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
              }}
              mt={7}
              width="100%"
              onClick={handleRegister}
            >
              Register Now
            </Button>

            <FormControl
              maxWidth={{ base: "100%", md: "100%" }}
              mt={{ base: 3, md: 5 }}
            >
              {otpSent ? (
                <>
                  <Text
                    mt={3}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  >
                    If a valid email was given, then you will soon receive an
                    OTP on it.
                  </Text>
                  <FormControl
                    maxWidth={{ base: "100%", md: "100%" }}
                    mt={6}
                    mb={4}
                  >
                    <FormLabel
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      Enter OTP
                    </FormLabel>
                    <HStack justifyContent="center" spacing={10} mt={7}>
                      <PinInput>
                        {[0, 1, 2, 3].map((index) => (
                          <PinInputField
                            key={index}
                            size="lg"
                            borderRadius="md"
                            borderWidth="2px"
                            borderColor={
                              colorMode === "light" ? "#385A64" : "#00DFC0"
                            }
                            color={
                              colorMode === "light" ? "#385A64" : "#00DFC0"
                            }
                            focusBorderColor={
                              colorMode === "light" ? "#385A64" : "#00DFC0"
                            }
                            _focus={{
                              borderColor:
                                colorMode === "light" ? "#385A64" : "#00DFC0",
                              boxShadow: `0 0 0 2px ${
                                colorMode === "light" ? "#385A64" : "#00DFC0"
                              }`,
                            }}
                            onChange={(e) =>
                              handlePinInputChange(index, e.target.value)
                            }
                          />
                        ))}
                      </PinInput>
                    </HStack>
                  </FormControl>
                  <Button
                    isLoading={isLoading}
                    loadingText="Verifying"
                    colorScheme="teal"
                    variant="outline"
                    color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                    backgroundColor={
                      colorMode === "dark" ? "#2D3748" : "#00DFC0"
                    }
                    _hover={{
                      backgroundColor:
                        colorMode === "dark" ? "#385A64" : "#2D3748",
                      color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                    }}
                    mt={4}
                    width="100%"
                    onClick={() => {
                      setIsLoading(true);
                      handleOTPVerification();
                    }}
                  >
                    Verify OTP
                  </Button>
                </>
              ) : (
                <>
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
                    backgroundColor={
                      colorMode === "dark" ? "#2D3748" : "#00DFC0"
                    }
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
                </>
              )}
            </FormControl>
          </form>
        </MotionBox>
      </Flex>
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default Register;
