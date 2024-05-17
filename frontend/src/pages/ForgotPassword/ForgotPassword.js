import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Flex,
  Text,
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Image,
  InputGroup,
  InputLeftElement,
  Divider,
  useBreakpointValue,
  useColorMode,
  InputRightElement,
  IconButton,
  Stack,
  Stepper,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  useSteps,
  Button,
  useToast,
  HStack,
  PinInputField,
  PinInput,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon } from "@chakra-ui/icons";
import { BeatLoader } from "react-spinners";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import Img from "../../Logo/Img18.png";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionImage = motion(Image);

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isFormFloating, setIsFormFloating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { colorMode } = useColorMode();
  const location = useLocation();
  const avatarColor = colorMode === "light" ? "#385A64" : "teal.300";
  const iconColor = colorMode === "light" ? "#385A64" : "#00DFC0";
  const dividerWidth = useBreakpointValue({ base: "80%", md: "60%" });
  const stepperActiveColor = "#00DFC0";
  const stepperInactiveColor = "#385A64";
  const toast = useToast();

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

  const handlePinInputChange = (index, value) => {
    let updatedOTP = enteredOTP;
    updatedOTP =
      updatedOTP.substring(0, index) + value + updatedOTP.substring(index + 1);
    setEnteredOTP(updatedOTP);
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);

      if (!email) {
        toast({
          title: "Empty Email",
          description: "Please Enter Your Email",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
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

      if (!checkUserResponse.ok) {
        toast({
          title: "User not found",
          description: "The entered email is not registered.",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

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
        setActiveStep(activeStep + 1);
      } else {
        toast({
          title: "Failed to send OTP ☹",
          description: otpData.message || "Something went wrong",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    try {
      setIsLoading(true);

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

      if (otpVerificationResponse.ok) {
        toast({
          title: "OTP Verified ✅",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        setOTPVerified(true);
        setActiveStep(activeStep + 1);
      } else {
        toast({
          title: "OTP Verification Failed ☹",
          description: otpVerificationData.message || "Something went wrong",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        toast({
          title: "Empty Fields",
          description: "Please enter both new password and confirm password.",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
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

      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description:
            "Please make sure the new password and confirm password match.",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const updatePasswordResponse = await fetch(
        "http://localhost:5000/api/auth/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const updatePasswordData = await updatePasswordResponse.json();

      if (updatePasswordResponse.ok) {
        toast({
          title: "Password updated successfully",
          description: "Wait ! Redirecting you to login page !",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        toast({
          title: "Failed to update password",
          description: updatePasswordData.message || "Something went wrong",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: "First", description: "Enter Your Email" },
    { title: "Second", description: "Enter Received OTP" },
    { title: "Third", description: "Change Password" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const activeStepText = steps[activeStep].description;

  return (
    <Box>
      <Navbar />
      <Flex
        align="center"
        justify="center"
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
            Forgot Password?
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

          <Stack>
            <Stepper size="lg" colorScheme="green" index={activeStep} gap="0">
              {steps.map((step, index) => (
                <Step key={index} isCompleted={index < activeStep} gap="0">
                  <StepIndicator>
                    <StepStatus
                      complete={`✅`}
                      incomplete={`⏳`}
                      active={`✍🏻`}
                      color={
                        index === activeStep
                          ? stepperActiveColor
                          : stepperInactiveColor
                      }
                    />
                  </StepIndicator>
                  <StepSeparator _horizontal={{ ml: "0" }} />
                </Step>
              ))}
            </Stepper>

            <Text
              style={{ color: colorMode === "light" ? "#385A64" : "#00DFC0" }}
            >
              Step {activeStep + 1}:{" "}
              <b
                style={{ color: colorMode === "light" ? "#385A64" : "#00DFC0" }}
              >
                {activeStepText}
              </b>
            </Text>
          </Stack>

          <form>
            <FormControl maxWidth={{ base: "100%", md: "100%" }}>
              {activeStep === 0 && (
                <>
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
                  <Button
                    isLoading={otpSent}
                    loadingText="Sending OTP"
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
                    mt={7}
                    width="100%"
                    onClick={handleSendOTP}
                  >
                    Send OTP
                  </Button>
                </>
              )}

              {activeStep === 1 && otpSent && (
                <>
                  <Text
                    mt={3}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  >
                    Check Out Your Entered Mail For The OTP !
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
                    disabled={otpVerified}
                  >
                    Verify OTP
                  </Button>
                </>
              )}

              {activeStep === 2 && otpVerified && (
                <>
                  <FormControl
                    maxWidth={{ base: "100%", md: "100%" }}
                    mt={{ base: 3, md: 5 }}
                  >
                    <FormLabel
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      New Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color={avatarColor} />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        width="100%"
                        color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                        focusBorderColor={
                          colorMode === "light" ? "#385A64" : "#00DFC0"
                        }
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                    <FormLabel
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      Confirm Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color={avatarColor} />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        width="100%"
                        color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                        focusBorderColor={
                          colorMode === "light" ? "#385A64" : "#00DFC0"
                        }
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

                  <Button
                    isLoading={isLoading}
                    loadingText="Updating"
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
                      handlePasswordUpdate();
                    }}
                  >
                    Update Password
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

export default ForgotPassword;
