import React, { useState, useEffect } from "react";
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
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Checkbox,
  VStack,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import ScrollToTopButton from "../../components/ScrollUp";
import { ArrowBackIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import axios from "axios";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const AdminSingleItem = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const dividerWidth = useBreakpointValue({ base: "30%", md: "15%" });
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const toast = useToast();

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    fetchItemData();
  }, [itemId]);

  const fetchItemData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/admin/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Item data:", response.data);
      setItem(response.data);
      prepareImageUrls(response.data);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  const prepareImageUrls = (itemData) => {
    const validAdditionalImages = itemData.additionalImages.filter(
      (image) => image !== (null || "")
    );
    const allImages = [itemData.mainImage, ...validAdditionalImages];
    setImageUrls(allImages);
  };

  const handleBackButtonClick = () => {
    navigate("/admin-items");
  };

  const handleLeftArrowClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleRightArrowClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const openReviewModal = () => setReviewModalOpen(true);
  const closeReviewModal = () => setReviewModalOpen(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const openRejectModal = () => setRejectModalOpen(true);
  const closeRejectModal = () => setRejectModalOpen(false);
  const openMessageModal = () => setMessageModalOpen(true);
  const closeMessageModal = () => {
    setMessageModalOpen(false);
    setRejectModalOpen(false);
    setReviewModalOpen(false);
  };

  const handleSendMessage = async () => {
    try {
      // Check if the message is empty
      if (!message || message.trim() === "") {
        toast({
          title: "Error",
          description: "Message cannot be empty.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      // Get the checked checkboxes
      const checkedCheckboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      const checkedFields = Array.from(checkedCheckboxes).map(
        (checkbox) => checkbox.value
      );

      // Build the fieldsToUpdate object with empty values for the checked fields
      const fieldsToUpdate = checkedFields.reduce((acc, field) => {
        acc[field] = "";
        return acc;
      }, {});

      // Log the updated form data
      console.log("Fields to Update:", fieldsToUpdate);

      // Retrieve token from local storage
      const token = localStorage.getItem("token");

      // Get the user ID associated with the item
      const userIdResponse = await axios.get(
        `http://localhost:5000/api/admin/get-user-id/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userId = userIdResponse.data.userId;

      // Update the item model with the checked fields
      await axios.put(
        `http://localhost:5000/api/admin/update-item/${itemId}`,
        fieldsToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store the message
      await axios.post(
        `http://localhost:5000/api/admin/store-message/${userId}`,
        {
          userId,
          adminMessage: message,
          rejectionType: "itemPostingVerification",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store a notification
      await axios.post(
        `http://localhost:5000/api/admin/store-notification/${userId}`,
        {
          userId,
          message: "Your item verification request has been rejected.",
          type: "itemVerification",
          isRead: false, // Assuming notifications are initially unread
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast({
        title: "Item Rejected",
        description: "Message sent to user successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      // Close the message modal
      closeMessageModal();

      // Refresh the window after the success toast disappears
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating item or storing message:", error);

      // Show failure toast
      toast({
        title: "Error",
        description: "Failed to update item or send message.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleVerifyItem = async () => {
    try {
      // Retrieve token from local storage
      const token = localStorage.getItem("token");

      const userIdResponse = await axios.get(
        `http://localhost:5000/api/admin/get-user-id/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userId = userIdResponse.data.userId;

      // Update the item to set verified to true
      await axios.put(
        `http://localhost:5000/api/admin/update-item/${itemId}`,
        {
          verified: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Send notification to the user
      await axios.post(
        `http://localhost:5000/api/admin/store-notification/${userId}`,
        {
          userId,
          itemId,
          message: "Your item verification request has been approved.",
          type: "itemVerification",
          isRead: false, // Assuming notifications are initially unread
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast({
        title: "Success",
        description: "Item verified successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      // Close the review modal
      closeReviewModal();

      // Refresh the window after the success toast disappears
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error verifying item:", error);

      // Show failure toast
      toast({
        title: "Error",
        description: "Failed to verify item.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteItem = async () => {
    try {
      // Retrieve token from local storage
      const token = localStorage.getItem("token");

      const userIdResponse = await axios.get(
        `http://localhost:5000/api/admin/get-user-id/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userId = userIdResponse.data.userId;

      // Update the item to set deleted to true
      await axios.put(
        `http://localhost:5000/api/admin/update-item/${itemId}`,
        {
          deleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Send notification to the user
      await axios.post(
        `http://localhost:5000/api/admin/store-notification/${userId}`,
        {
          userId,
          itemId,
          message: "Your item has been deleted.",
          type: "itemDeletion",
          isRead: false, // Assuming notifications are initially unread
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast({
        title: "Success",
        description: "Item deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      // Close the delete modal
      closeDeleteModal();

      // Refresh the window after the success toast disappears
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error deleting item:", error);

      // Show failure toast
      toast({
        title: "Error",
        description: "Failed to delete item.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />

        <Box mb={4}>
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
            variants={fadeInAnimation}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1.25 }}
          >
            Item Info
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

          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection={{ base: "column", md: "column", lg: "row" }}
            p={{ base: 4, md: 8, lg: 12 }} // Added padding for different screen sizes
          >
            {item ? (
              <>
                <Box
                  flex="1"
                  p={4}
                  mb={4}
                  height={{ base: "auto", md: "500px" }}
                  width={{ base: "100%", md: "90%", lg: "900px" }}
                  overflow="hidden"
                  position="relative"
                >
                  {imageUrls.length > 1 && (
                    <>
                      <Box
                        position="absolute"
                        top="50%"
                        left="0"
                        transform="translateY(-50%)"
                        zIndex="1"
                        visibility={
                          currentImageIndex === 0 ? "hidden" : "visible"
                        }
                      >
                        <ArrowLeftIcon
                          boxSize={10}
                          color="gray.400"
                          cursor="pointer"
                          onClick={handleLeftArrowClick}
                        />
                      </Box>
                      <Box
                        position="absolute"
                        top="50%"
                        right="0"
                        transform="translateY(-50%)"
                        zIndex="1"
                        visibility={
                          currentImageIndex === imageUrls.length - 1
                            ? "hidden"
                            : "visible"
                        }
                      >
                        <ArrowRightIcon
                          boxSize={10}
                          color="gray.400"
                          cursor="pointer"
                          onClick={handleRightArrowClick}
                        />
                      </Box>
                    </>
                  )}
                  <motion.img
                    key={currentImageIndex}
                    src={imageUrls[currentImageIndex]}
                    alt="Item Image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                </Box>

                <Box
                  flex="1"
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  height={{ base: "auto", md: "500px" }}
                  width={{ base: "100%", md: "90%", lg: "600px" }}
                  mb={2}
                  overflowY="auto"
                  ml={{ lg: 16 }}
                >
                  <Box mb={4}>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Item Name:</strong> {item.itemName || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Category:</strong> {item.category || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Description:</strong> {item.description || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Location:</strong> {item.location || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Item Type:</strong> {item.itemType || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Security Question:</strong>{" "}
                      {item.securityQuestion || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Lost/Found Date:</strong>{" "}
                      {formatDate(item.lostFoundDate)}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Date Posted:</strong>{" "}
                      {formatDate(item.datePosted)}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Brand:</strong> {item.brand || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Item Color:</strong> {item.itemColor || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Verified:</strong> {item.verified ? "Yes" : "No"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Claimed:</strong> {item.claimed || "N/A"}
                    </Box>
                    <Box
                      mb={2}
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    >
                      <strong>Deleted:</strong> {item.deleted ? "Yes" : "No"}
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box
                  flex="1"
                  p={4}
                  mb={4}
                  height={{ base: "auto", md: "500px" }}
                  width={{ base: "100%", md: "90%", lg: "900px" }}
                  overflow="hidden"
                  position="relative"
                >
                  <Skeleton height="100%" />
                </Box>

                <Box
                  flex="1"
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  height={{ base: "auto", md: "500px" }}
                  width={{ base: "100%", md: "90%", lg: "600px" }}
                  mb={2}
                  overflowY="auto"
                  ml={{ lg: 16 }}
                >
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                  <Skeleton height="20px" mb={4} />
                </Box>
              </>
            )}
          </Flex>
        </Box>

        <Flex
          width="100%"
          mb={{ base: 4, md: 8 }}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "space-around" }}
          alignItems="center"
          maxW="100%"
          mx="auto"
        >
          {item ? (
            <>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                width={{ base: "30%", md: "20%" }}
                mb={{ base: 2, md: 0 }}
              >
                Message User
              </Button>
              {!item.deleted && (
                <>
                  {!item.verified && (
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
                      width={{ base: "30%", md: "20%" }}
                      mt={{ base: 3, md: 0 }}
                      mb={{ base: 2, md: 0 }}
                      onClick={openReviewModal}
                    >
                      Review Item
                    </Button>
                  )}
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
                    width={{ base: "30%", md: "20%" }}
                    mt={{ base: 3, md: 0 }}
                    mb={{ base: 4, md: 0 }}
                    onClick={openDeleteModal}
                  >
                    Delete Item
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Skeleton
                height="40px"
                width={{ base: "30%", md: "20%" }}
                mb={2}
              />
              <Skeleton
                height="40px"
                width={{ base: "30%", md: "20%" }}
                mt={3}
                mb={2}
              />
              <Skeleton
                height="40px"
                width={{ base: "30%", md: "20%" }}
                mt={3}
                mb={4}
              />
            </>
          )}
        </Flex>

        <AdminFooter />

        <ScrollToTopButton />

        <Modal isOpen={isReviewModalOpen} onClose={closeReviewModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Review Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Ask admin whether to verify the item or not */}
              Do you want to verify this item?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                ml={3}
                onClick={handleVerifyItem}
              >
                Verify
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                ml={3}
                onClick={openRejectModal}
              >
                Reject
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isRejectModalOpen} onClose={closeRejectModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reject Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>Reason for rejection:</FormLabel>
              <VStack alignItems="flex-start">
                <Checkbox value="itemName">Item Name</Checkbox>
                <Checkbox value="category">Category</Checkbox>
                <Checkbox value="description">Description</Checkbox>
                <Checkbox value="location">Location</Checkbox>
                <Checkbox value="itemType">Item Type</Checkbox>
                <Checkbox value="securityQuestion">Security Question</Checkbox>
                <Checkbox value="lostFoundDate">Lost or Found Date</Checkbox>
                <Checkbox value="mainImage">Main Image</Checkbox>
                <Checkbox value="additionalImages">Additional Images</Checkbox>
                <Checkbox value="brand">Brand</Checkbox>
                <Checkbox value="itemColor">Item Color</Checkbox>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={closeRejectModal}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                ml={3}
                onClick={openMessageModal}
              >
                Continue
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isMessageModalOpen} onClose={closeMessageModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Message Item Owner</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>Message:</FormLabel>
              <Textarea
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={closeMessageModal}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                ml={3}
                onClick={() => handleSendMessage(message)}
              >
                Send Message
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Are you sure you want to delete this item?</ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                  color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
                }}
                ml={3}
                onClick={handleDeleteItem}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default AdminSingleItem;
