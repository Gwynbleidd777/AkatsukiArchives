import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  Divider,
  Heading,
  useBreakpointValue,
  useMediaQuery,
  Image,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import ScrollToTopButton from "../../components/ScrollUp";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import axios from "axios";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const AdminSingleUser = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const dividerWidth = useBreakpointValue({ base: "30%", md: "15%" });
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [verifiedStatus, setverifiedStatus] = useState(null);
  const [deletedStatus, setdeletedStatus] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [isMOpen, setIsMOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageLoaded(true);
    }, 3000); // Change the duration as needed (in milliseconds)

    // Clear the timeout on component unmount or when the image is loaded
    return () => clearTimeout(timeout);
  }, []);

  const handleOpenConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleOpenMessageModal = () => {
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsConfirmationModalOpen(false);
    setIsMessageModalOpen(false);
  };

  const handleMessageSend = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!message || message.trim() === "") {
        toast({
          title: "Error",
          description: "Enter the reason for user verification rejection.",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/admin/update-profile/${userId}`,
        {
          idType: "",
          idNumber: "",
          idImageUrl: "",
          idFileName: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the profile update was successful
      if (response.data.message === "Profile updated successfully") {
        // Send the rejection message
        const rejectionMessageResponse = await axios.post(
          `http://localhost:5000/api/admin/store-message/${userId}`,
          {
            userId,
            adminMessage: message, // Assuming 'message' contains the rejection reason
            rejectionType: "profileVerification", // Add rejectionType field
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the rejection message was sent successfully
        if (
          rejectionMessageResponse.data.message ===
          "Message stored successfully"
        ) {
          // Store the notification
          const notificationResponse = await axios.post(
            `http://localhost:5000/api/admin/store-notification/${userId}`,
            {
              userId,
              message: "Your profile verification request has been rejected.", // Modify this message as needed
              type: "userVerification",
              isRead: false, // Set isRead to false initially
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Check if the notification was stored successfully
          if (
            notificationResponse.data.message ===
            "Notification stored successfully"
          ) {
            console.log("Notification stored successfully");
          } else {
            console.error(
              "Error storing notification:",
              notificationResponse.data.message
            );
          }
        } else {
          console.error(
            "Error sending rejection message:",
            rejectionMessageResponse.data.message
          );
        }

        // Close the message modal
        handleCloseMessageModal();

        // Show success toast notification
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully.",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Error updating profile:", response.data.message);
        // Show error toast notification
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again later.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error toast notification
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePreview = () => {
    setIsMOpen(true);
  };

  const handleClose = () => {
    setIsMOpen(false);
  };

  useEffect(() => {
    fetchUserInfo();
    fetchProfileCompletion();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/admin/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      console.log(response.data);

      const rawDate = new Date(response.data.dateOfBirth);
      const options = { day: "numeric", month: "long", year: "numeric" };

      // Format the date
      const formattedDate = rawDate.toLocaleDateString("en-GB", options);
      setFormattedDate(formattedDate);
      setverifiedStatus(response.data.verified);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchProfileCompletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/admin/check-profile-completion/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileCompletion(response.data);
    } catch (error) {
      console.error("Error checking profile completion:", error);
    }
  };

  const handleVerifyUser = async () => {
    try {
      const token = localStorage.getItem("token");

      // Step 1: Verify the user
      const response = await axios.put(
        `http://localhost:5000/api/admin/verify/${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // Update the verified status in the state
      setverifiedStatus(true);

      // Step 2: Send verification notification
      const notificationResponse = await axios.post(
        `http://localhost:5000/api/admin/store-notification/${userId}`,
        {
          userId,
          message: "Your profile verification request has been accepted.", // Modify this message as needed
          type: "userVerification",
          isRead: false, // Set isRead to false initially
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(notificationResponse.data);

      // Step 3: Delete any rejection message for the user
      const deleteMessageResponse = await axios.delete(
        `http://localhost:5000/api/admin/delete-message/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(deleteMessageResponse.data);

      // Show success toast notification
      toast({
        title: "User Verified",
        description: "The user has been successfully verified.",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });

      // Refresh the page
      fetchUserInfo();
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error verifying user:", error);

      // Show error toast notification
      toast({
        title: "Error",
        description: "Failed to verify user. Please try again later.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/admin/delete/${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setdeletedStatus(true);

      // Show success toast notification
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });

      // Refresh the page
      fetchUserInfo();
    } catch (error) {
      console.error("Error deleting user:", error);

      // Show error toast notification
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again later.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBackButtonClick = () => {
    navigate("/admin-users");
  };

  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />

        <Box mb={8}>
          <Button
            variant="ghost"
            onClick={handleBackButtonClick}
            mr={4}
            mt={4}
            ml={4}
          >
            <ArrowBackIcon
              boxSize={6}
              color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            />
          </Button>

          <MotionHeading
            mb={4}
            mt={4}
            textAlign={{ base: "center", md: "center" }}
            color={colorMode === "light" ? "#385A64" : "#00DFC0"}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25 }}
          >
            User Info
          </MotionHeading>

          <MotionBox
            initial={{ width: 0, x: "50%" }}
            animate={{ width: "100%", x: 0 }}
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

          <Box>
            {!user ? ( // Render skeleton layout if user data is not available
              <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection={{ base: "column", md: "row" }}
                p={{ base: 4, md: 8 }} // Add padding to the whole section
                gap={{ base: 8, md: 16 }} // Add gap between the sections
                mx={{ base: 4, md: "auto" }} // Add margin from the sides of the screen
              >
                <Box
                  p={4}
                  mb={{ base: 8, md: 0 }} // Add margin-bottom for better separation
                  height={{ base: "400px", md: "400px" }} // Reduce the height for smaller size
                  width={{ base: "400px", md: "400px" }} // Reduce the width for smaller size
                  overflow="hidden"
                  position="relative"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                >
                  <SkeletonCircle
                    height="100%"
                    width="100%"
                    borderRadius="full"
                  />
                </Box>

                <Box
                  p={4}
                  height={{ base: "auto", md: "400px" }} // Reduce the height for smaller size
                  width={{ base: "100%", md: "50%" }} // Set width to half on smaller screens
                  overflow="auto"
                  border="2px solid"
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                  borderRadius="md"
                >
                  <Box mb={4}>
                    <SkeletonText mt="4" noOfLines={6} spacing="4" />
                  </Box>
                </Box>
              </Flex>
            ) : (
              <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection={{ base: "column", md: "row" }}
                p={{ base: 4, md: 8 }} // Add padding to the whole section
                gap={{ base: 8, md: 16 }} // Add gap between the sections
                mx={{ base: 4, md: "auto" }} // Add margin from the sides of the screen
              >
                {/* Render user image */}
                <Box
                  p={4}
                  mb={{ base: 8, md: 0 }} // Add margin-bottom for better separation
                  height={{ base: "400px", md: "400px" }} // Reduce the height for smaller size
                  width={{ base: "400px", md: "400px" }} // Reduce the width for smaller size
                  overflow="hidden"
                  position="relative"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                >
                  {!imageLoaded && (
                    <SkeletonCircle
                      height="100%"
                      width="100%"
                      borderRadius="full"
                    />
                  )}
                  {imageLoaded && (
                    <Image
                      src={user.imageUrl}
                      alt="https://bit.ly/broken-link"
                      objectFit="cover"
                      height="100%"
                      width="100%"
                      borderRadius="full"
                      onLoad={() => setImageLoaded(true)} // Set the imageLoaded state to true when the image is loaded
                    />
                  )}
                </Box>

                <Box
                  p={4}
                  height={{ base: "auto", md: "400px" }} // Reduce the height for smaller size
                  width={{ base: "100%", md: "50%" }} // Set width to half on smaller screens
                  overflow="auto"
                  border="2px solid"
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                  borderRadius="md"
                >
                  <Box mb={4}>
                    {/* Render user details */}
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>User Name:</strong> {user.fullName}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Email:</strong> {user.email}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Address:</strong> {user.address}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Phone Number:</strong> {user.phoneNumber}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Date of Birth:</strong> {formattedDate}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Gender:</strong> {user.gender}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <Box
                        mb={2}
                        color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                        textAlign="left"
                      >
                        <strong>Id Type:</strong> {user.idType}
                      </Box>
                      <Box
                        mb={2}
                        color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                        textAlign="left"
                      >
                        <strong>Id Number:</strong> {user.idNumber}
                      </Box>
                      <Flex alignItems="center">
                        <Box
                          mb={2}
                          mr={3} // Add margin to create gap between "Id File Name" and its value
                          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                          textAlign="left"
                        >
                          <strong>Id File Name:</strong> {user.idFileName}
                        </Box>
                        <Box>
                          {user.idImageUrl && ( // Check if idImageUrl exists and is not null
                            <IconButton
                              aria-label="Preview Id File"
                              icon={<ViewIcon />}
                              color={
                                colorMode === "light" ? "#385A64" : "#00DFC0"
                              }
                              size="sm"
                              onClick={handlePreview}
                            />
                          )}
                        </Box>
                      </Flex>

                      <Box
                        mb={2}
                        color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                        textAlign="left"
                      >
                        <strong>Admin:</strong> {user.admin ? "Yes" : "No"}
                      </Box>
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      textAlign="left"
                    >
                      <strong>Deleted:</strong> {user.deleted ? "Yes" : "No"}
                    </Box>

                    {user.idImageUrl && ( // Check if user.idImageUrl exists and is not null
                      <Modal isOpen={isMOpen} onClose={handleClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>File Preview</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            {user.idImageUrl ? (
                              user.idImageUrl.toLowerCase().endsWith(".pdf") ? (
                                // Display PDF file
                                <embed
                                  src={user.idImageUrl}
                                  type="application/pdf"
                                  width="100%"
                                  height="500px"
                                />
                              ) : (
                                // Display image
                                <Image src={user.idImageUrl} alt="File" />
                              )
                            ) : (
                              <Box>File preview not available</Box>
                            )}
                          </ModalBody>

                          <ModalFooter>
                            <Button
                              colorScheme="teal"
                              variant="outline"
                              color={
                                colorMode === "dark" ? "#00DFC0" : "#385A64"
                              }
                              backgroundColor={
                                colorMode === "dark" ? "#2D3748" : "#00DFC0"
                              }
                              _hover={{
                                backgroundColor:
                                  colorMode === "dark" ? "#385A64" : "#2D3748",
                                color:
                                  colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                              }}
                              mr={3}
                              onClick={handleClose}
                            >
                              Close
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    )}
                  </Box>
                </Box>
              </Flex>
            )}
          </Box>

          {!deletedStatus && (
            <Flex
              justifyContent="space-around"
              width="100%"
              flexWrap={{ base: "wrap", md: "nowrap" }}
              mx={{ base: 4, md: "auto" }}
              mb={2}
            >
              <Flex
                width={{ base: "100%", md: "auto" }}
                mt={{ base: 4, md: 0 }}
                justifyContent="center"
              >
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
                  width={{ base: "40%", md: "100%" }}
                  mt={{ base: 4, md: 0 }}
                >
                  Message User
                </Button>
              </Flex>
              {profileCompletion &&
                profileCompletion.complete &&
                !verifiedStatus && (
                  <Flex
                    width={{ base: "100%", md: "auto" }}
                    mt={{ base: 4, md: 0 }}
                    justifyContent="center"
                  >
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
                      width={{ base: "40%", md: "100%" }}
                      mt={{ base: 4, md: 0 }}
                      onClick={handleOpenConfirmationModal}
                    >
                      Review User
                    </Button>
                  </Flex>
                )}

              {/* Confirmation Modal */}
              <Modal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseConfirmationModal}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Confirm User Verification</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Do you want to accept or reject the user's verification
                    request ?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="red"
                      mr={3}
                      onClick={handleOpenMessageModal}
                    >
                      Reject
                    </Button>
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
                      onClick={handleVerifyUser}
                    >
                      Accept
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={isMessageModalOpen}
                onClose={handleCloseMessageModal}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Send Message</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type the rejection reason message here..."
                        resize="none"
                        autoFocus
                      />
                    </Box>
                  </ModalBody>
                  <ModalFooter>
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
                      mr={3}
                      onClick={handleCloseMessageModal}
                    >
                      Cancel
                    </Button>
                    <Button colorScheme="teal" onClick={handleMessageSend}>
                      Send
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Flex
                width={{ base: "100%", md: "auto" }}
                mt={{ base: 4, md: 0 }}
                justifyContent="center"
              >
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
                  width={{ base: "40%", md: "100%" }}
                  mt={{ base: 4, md: 0 }}
                  onClick={() => setIsOpen(true)}
                >
                  Delete User
                </Button>
              </Flex>
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete User
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to delete this user? This action
                      cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={handleDeleteUser}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Flex>
          )}
        </Box>

        <AdminFooter />
      </Box>

      <ScrollToTopButton />
    </Box>
  );
};

export default AdminSingleUser;
