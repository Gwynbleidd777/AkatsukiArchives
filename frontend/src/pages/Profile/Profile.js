import { React, useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  Avatar,
  Heading,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
  useColorMode,
  Select,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useBreakpointValue,
  Image,
  Text,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { EmailIcon, PhoneIcon, CalendarIcon, Icon } from "@chakra-ui/icons";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaTransgenderAlt,
  FaRegAddressCard,
} from "react-icons/fa";
import { MdOutlineNumbers } from "react-icons/md";
import { RxIdCard } from "react-icons/rx";
import axios from "axios";
import Sidebar from "./ProfileSidebar";
import ProfileNavbar from "./ProfileNavbar";
import ProfileFooter from "./ProfileFooter";

const Profile = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isEditing, setIsEditing] = useState(true);
  const [buttonText, setButtonText] = useState("Edit");
  const [avatarSrc, setAvatarSrc] = useState("https://bit.ly/broken-link");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [userData, setUserData] = useState({});
  const [idImageUrl, setIdImageUrl] = useState("");
  const [idFileName, setIdFileName] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(false);
  const [userVerification, setUserVerification] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const { colorMode } = useColorMode();
  const avatarColor = colorMode === "dark" ? "#00DFC0" : "#385A64";
  const buttonColor = colorMode === "dark" ? "#00DFC0" : "#385A64";
  const buttonBgColor = colorMode === "dark" ? "#2D3748" : "#00DFC0";
  const buttonHoverBgColor = colorMode === "dark" ? "#385A64" : "#2D3748";
  const borderColor = "#00DFC0";
  const profileInfoColor = colorMode === "dark" ? "#00DFC0" : "#385A64";
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const buttonWidth = useBreakpointValue({ base: "35%", md: "20%" });

  useEffect(() => {
    fetchUserData();
    fetchUserProfileImage();
  }, [profileUpdated]);

  useEffect(() => {
    checkProfileCompletion();
    checkUserVerification();
    fetchAdminMessage();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      const userDataResponse = response.data;
      setUserData(userDataResponse);
      setName(userData.fullName);
      setEmail(userData.email);

      const {
        address,
        phoneNumber,
        dateOfBirth,
        gender,
        idType,
        idNumber,
        idImageUrl,
        idFileName,
      } = userDataResponse;

      setPhoneNumber(phoneNumber);
      if (dateOfBirth) {
        const formattedDob = new Date(dateOfBirth).toISOString().split("T")[0];
        setDob(formattedDob);
      }
      setGender(gender);
      setAddress(address);
      setIdType(idType);
      setIdNumber(idNumber);
      setIdImageUrl(idImageUrl);
      setIdFileName(idFileName);

      if (
        userData.address &&
        userData.phoneNumber &&
        userData.dateOfBirth &&
        userData.gender &&
        userData.idType &&
        userData.idNumber &&
        userData.idImageUrl &&
        userData.idFileName // Check if idFileName exists in userData
      ) {
        setAddress(userData.address);
        setPhoneNumber(userData.phoneNumber);
        const formattedDob = new Date(userData.dateOfBirth)
          .toISOString()
          .split("T")[0];
        setDob(formattedDob);
        setGender(userData.gender);
        setIdType(userData.idType);
        setIdNumber(userData.idNumber);
        setIdImageUrl(userData.idImageUrl);
        setIdFileName(userData.idFileName); // Set idFileName state
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response && error.response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to view this page.",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const fetchAdminMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      console.log("Fetching admin message...");

      const response = await axios.get(
        "http://localhost:5000/api/auth/get-message",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response);

      const { data } = response;
      console.log("Data:", data);

      if (
        data &&
        data.message === "Message retrieved successfully" &&
        data.data.rejectionType === "profileVerification" // Check rejection type
      ) {
        console.log(
          "Admin message retrieved successfully:",
          data.data.adminMessage
        );
        setAdminMessage(data.data.adminMessage);
      } else {
        console.log(
          "Message not retrieved successfully or rejection type is not 'itemPostingVerification'"
        );
      }
    } catch (error) {
      console.error("Error fetching admin message:", error);
    }
  };

  const handleButtonClick = () => {
    setIsEditing(!isEditing);
    setButtonText(isEditing ? "Update" : "Edit");
    setProfileUpdated(true);
  };

  const fetchUserProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/auth/userProfileImage",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.profileImage) {
        setAvatarSrc(response.data.profileImage.imageUrl);
        setImageUploaded(true);
      }
    } catch (error) {
      console.error("Error fetching user profile image:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("File selected:", e.target.files[0]);
    if (file) {
      const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload only JPG or PNG files.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "AkatsukiArchives");
        formData.append("cloud_name", "mohit777");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/mohit777/image/upload",
          {
            method: "post",
            body: formData,
          }
        );
        const imageData = await response.json();
        console.log("Image uploaded to Cloudinary:", imageData);

        saveImageUrlToBackend(imageData.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const saveImageUrlToBackend = async (imageUrl) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/saveImageUrl",
        { imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);

      // Show toast for profile image updated
      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Reload the page after the toast ends
      setTimeout(() => {
        window.location.reload();
      }, 5000); // 5000 milliseconds = 5 seconds (duration of the toast)
    } catch (error) {
      console.error("Error saving image URL:", error);
      toast({
        title: "Save Error",
        description: "Failed to save image URL.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/removeImageUrl",
        { imageUrl: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);

      // Show warning-colored toast for profile image removed
      toast({
        title: "Profile Image Removed",
        description: "Your profile image has been removed successfully.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });

      // Reload the page after the toast ends
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 5000 milliseconds = 5 seconds (duration of the toast)
    } catch (error) {
      console.error("Error removing image URL:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile pic.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleConfirmRemove = () => {
    handleRemoveImage();
    onClose();
  };

  const handleProfileUpdate = async () => {
    try {
      setIsUpdatingProfile(true);

      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.error("Token is missing");
        return;
      }

      if (address.length < 20) {
        toast({
          title: "Error",
          description: "Address must be at least 20 characters long.",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
        toast({
          title: "Error",
          description: "Enter a valid number.",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const dobDate = new Date(dob);
      const today = new Date();
      const minAge = 15;
      today.setFullYear(today.getFullYear() - minAge);

      if (dobDate >= today) {
        toast({
          title: "Error",
          description: `You must be at least ${minAge} years old.`,
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!gender) {
        toast({
          title: "Error",
          description: "Please select your gender.",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!idType) {
        toast({
          title: "Error",
          description: "Please select ID type.",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      let profileData = {
        address: address,
        phoneNumber: phoneNumber,
        dateOfBirth: dob,
        gender: gender,
        idType: idType,
        idNumber: idNumber,
        idImageUrl: idImageUrl,
        idFileName: idFileName,
      };

      // Save ID image to backend if selectedFile is present
      if (selectedFile) {
        const newIdImageUrl = await saveIdImageToBackend(selectedFile);
        setIdImageUrl(newIdImageUrl);
        profileData = { ...profileData, idImageUrl: newIdImageUrl };

        // Send profile data to backend for updating
        await axios.put("http://localhost:5000/api/auth/profile", profileData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Delete the rejection message after profile update with new ID image URL
        await axios.delete(`http://localhost:5000/api/auth/delete-message`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileUpdated(true);
        setIsUpdatingProfile(false);

        toast({
          title: "Success",
          description: "Profile updated successfully.",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Refresh page after toast duration ends
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Adjust the timeout according to toast duration
      } else {
        // Update profile without new ID image
        await axios.put("http://localhost:5000/api/auth/profile", profileData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileUpdated(true);
        setIsUpdatingProfile(false);

        toast({
          title: "Success",
          description: "Profile updated successfully.",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Refresh page after toast duration ends
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Adjust the timeout according to toast duration
      }
    } catch (error) {
      setIsUpdatingProfile(false);
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setIsPreviewDialogOpen(true);
  };

  const handlePreviewDialogClose = () => {
    setIsPreviewDialogOpen(false);
  };

  const handleFileAttach = async () => {
    try {
      // Logic to attach the selected file
      // This function needs to be implemented according to your requirements
      setIsPreviewDialogOpen(false);

      // Update the idImageUrl state with the file name
      setIdFileName(selectedFile.name);
    } catch (error) {
      // Your existing code for error handling
    }
  };

  const saveIdImageToBackend = async (idImageFile) => {
    try {
      // Upload ID image to Cloudinary
      const formData = new FormData();
      formData.append("file", idImageFile);
      formData.append("upload_preset", "AkatsukiArchives");
      formData.append("cloud_name", "mohit777");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/mohit777/image/upload",
        {
          method: "post",
          body: formData,
        }
      );
      const imageData = await response.json();
      console.log("ID Image uploaded to Cloudinary:", imageData);

      // Return the image URL
      return imageData.url;
    } catch (error) {
      console.error("Error uploading ID image to Cloudinary:", error);
      throw new Error("Failed to upload ID image");
    }
  };

  const checkProfileCompletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/check-profile-completion",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile completion status");
      }

      const data = await response.json();
      setProfileCompletion(data.complete);
    } catch (error) {
      console.error("Error checking profile completion:", error);
    }
  };

  const checkUserVerification = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/check-user-verification",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user verification status");
      }

      const data = await response.json();
      setUserVerification(data.verified);
    } catch (error) {
      console.error("Error checking user verification:", error);
    }
  };

  return (
    <Box>
      {isLargerThan768 && <Sidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <ProfileNavbar />
        <Box
          mt={8}
          mb={7}
          ml={7}
          mr={7}
          border="1px"
          borderColor={borderColor}
          borderRadius="15px"
          p={20}
        >
          <Flex direction={{ base: "column", md: "row" }} align="center">
            <Box flex="1" textAlign="center" pr={{ base: 0, md: 8 }}>
              <Flex direction="column" align="center">
                <Box
                  position="relative"
                  width="300px"
                  height="300px"
                  borderRadius="full"
                  overflow="hidden"
                  boxShadow="md"
                  bg="#f0f0f0"
                  mb={4}
                >
                  <Avatar
                    size="full"
                    src={avatarSrc}
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg={avatarColor}
                  />
                </Box>
                {avatarSrc === "https://bit.ly/broken-link" && ( // Conditionally render based on avatarSrc
                  <label htmlFor="upload-button">
                    <Button
                      as="span"
                      colorScheme="teal"
                      variant="outline"
                      color={buttonColor}
                      backgroundColor={buttonBgColor}
                      _hover={{
                        backgroundColor: buttonHoverBgColor,
                        color: buttonColor,
                      }}
                      width="100%"
                    >
                      Upload Photo
                    </Button>
                  </label>
                )}
                {avatarSrc !== "https://bit.ly/broken-link" && ( // Conditionally render based on avatarSrc
                  <>
                    <Button
                      onClick={onOpen}
                      colorScheme="teal"
                      variant="outline"
                      color={buttonColor}
                      backgroundColor={buttonBgColor}
                      _hover={{
                        backgroundColor: buttonHoverBgColor,
                        color: buttonColor,
                      }}
                      mt={"15px"}
                    >
                      Remove Photo
                    </Button>
                    <AlertDialog
                      motionPreset="slideInBottom"
                      leastDestructiveRef={cancelRef}
                      onClose={onClose}
                      isOpen={isOpen}
                      isCentered
                    >
                      <AlertDialogOverlay />
                      <AlertDialogContent>
                        <AlertDialogHeader
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                        >
                          Confirm Removal
                        </AlertDialogHeader>
                        <AlertDialogCloseButton
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                        />
                        <AlertDialogBody
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                        >
                          Are You Sure You Want To Remove Your Profile Picture?
                          You Need A Complete Profile For Item Posting Or
                          Retrieval !
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button
                            ref={cancelRef}
                            onClick={onClose}
                            color={buttonColor}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            ml={3}
                            onClick={handleConfirmRemove}
                          >
                            Remove
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <input
                  type="file"
                  id="upload-button"
                  style={{ display: "none" }}
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </Flex>
            </Box>

            {isLargerThan768 ? null : (
              <>
                <Divider
                  mt={7}
                  mb={7}
                  borderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                />
              </>
            )}

            <Box flex="1">
              <Flex direction="column" align="center">
                <Heading
                  size="md"
                  mb={4}
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                >
                  Profile Information
                </Heading>
                <VStack
                  spacing={4}
                  align="flex-start"
                  width="100%"
                  maxWidth="400px"
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon
                        as={FaUserCircle}
                        color={profileInfoColor}
                        boxSize={5}
                      />
                    </InputLeftElement>
                    <Input
                      placeholder="Name"
                      value={name}
                      color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                      readOnly
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={EmailIcon} color={profileInfoColor} />
                    </InputLeftElement>
                    <Input
                      placeholder="Email"
                      value={email}
                      color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                      readOnly
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon
                        as={FaMapMarkerAlt}
                        color={profileInfoColor}
                        boxSize={5}
                      />
                    </InputLeftElement>
                    <Input
                      placeholder="Address"
                      value={address}
                      color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                      onChange={(e) => setAddress(e.target.value)}
                      readOnly={isEditing}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={PhoneIcon} color={profileInfoColor} />
                    </InputLeftElement>
                    <Input
                      placeholder="Phone Number"
                      value={phoneNumber}
                      color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      readOnly={isEditing}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={CalendarIcon} color={profileInfoColor} />
                    </InputLeftElement>
                    <Input
                      type="date"
                      placeholder="Date of Birth"
                      value={dob}
                      color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                      onChange={(e) => setDob(e.target.value)}
                      readOnly={isEditing}
                    />
                  </InputGroup>

                  {!isEditing && (
                    <Box display="flex" alignItems="center">
                      <Box width="15%">
                        {" "}
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon
                              as={FaTransgenderAlt}
                              color={profileInfoColor}
                              boxSize={5}
                            />
                          </InputLeftElement>
                          <Input readOnly />
                        </InputGroup>
                      </Box>
                      <Box width="85%" ml={2}>
                        {" "}
                        <Select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                          width="100%"
                        >
                          <option value="">Select Your Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                          <option value="Prefer Not To Say">
                            Prefer Not To Say
                          </option>
                        </Select>
                      </Box>
                    </Box>
                  )}

                  {!isEditing && (
                    <>
                      <>
                        <Box display="flex" alignItems="center">
                          <Box width="15%">
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <Icon
                                  as={FaRegAddressCard}
                                  color={profileInfoColor}
                                  boxSize={5}
                                />
                              </InputLeftElement>
                              <Input readOnly />
                            </InputGroup>
                          </Box>
                          <Box width="85%" ml={2}>
                            {userData.idType ? ( // Check if idType exists in userData
                              <Select
                                value={idType}
                                isReadOnly // Make the Select read-only
                                color={
                                  colorMode === "dark" ? "#00DFC0" : "#385A64"
                                }
                                placeholder="Select ID Type"
                              >
                                <option value={userData.idType}>
                                  {userData.idType}
                                </option>
                              </Select>
                            ) : (
                              <Select
                                value={idType}
                                onChange={(e) => setIdType(e.target.value)}
                                color={
                                  colorMode === "dark" ? "#00DFC0" : "#385A64"
                                }
                                placeholder="Select ID Type"
                              >
                                <option value="Aadhaar Card">
                                  Aadhaar Card
                                </option>
                                <option value="Voter Card">Voter Card</option>
                                <option value="Pan Card">Pan Card</option>
                                <option value="Others">Others</option>
                              </Select>
                            )}
                          </Box>
                        </Box>

                        {/* ID Number */}
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon
                              as={MdOutlineNumbers}
                              color={profileInfoColor}
                            />
                          </InputLeftElement>
                          <Input
                            placeholder="ID Number"
                            value={idNumber}
                            readOnly={!!userData.idNumber} // Make the Input read-only if idNumber exists in userData
                            onChange={(e) => setIdNumber(e.target.value)}
                            color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                          />
                        </InputGroup>
                      </>

                      {/* ID Image Upload */}
                      <>
                        <label htmlFor="id-upload-button">
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={RxIdCard} color={profileInfoColor} />
                            </InputLeftElement>
                            <Input
                              placeholder="Upload ID Image"
                              readOnly
                              value={idFileName ? idFileName : ""}
                              color={
                                colorMode === "dark" ? "#00DFC0" : "#385A64"
                              }
                              width="300px"
                              mr={3}
                            />
                            {idImageUrl ? (
                              <Button
                                colorScheme="teal"
                                variant="outline"
                                color={buttonColor}
                                backgroundColor={buttonBgColor}
                                _hover={{
                                  backgroundColor: buttonHoverBgColor,
                                  color: buttonColor,
                                }}
                                onClick={() => setIsPreviewDialogOpen(true)}
                              >
                                Preview
                              </Button>
                            ) : (
                              <Button
                                as="span"
                                colorScheme="teal"
                                variant="outline"
                                color={buttonColor}
                                backgroundColor={buttonBgColor}
                                _hover={{
                                  backgroundColor: buttonHoverBgColor,
                                  color: buttonColor,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  document
                                    .getElementById("id-upload-button")
                                    .click();
                                }}
                              >
                                Upload
                              </Button>
                            )}
                          </InputGroup>
                        </label>
                        <input
                          type="file"
                          id="id-upload-button"
                          style={{ display: "none" }}
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileSelection}
                        />
                        <AlertDialog
                          isOpen={isPreviewDialogOpen} // Always show the dialog when it's open
                          onClose={handlePreviewDialogClose}
                        >
                          <AlertDialogOverlay />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              {idImageUrl ? "Preview" : "Upload ID Image"}
                            </AlertDialogHeader>
                            <AlertDialogCloseButton />
                            <AlertDialogBody>
                              {/* Content for previewing or uploading image */}
                              {idImageUrl ? (
                                <Image src={idImageUrl} />
                              ) : selectedFile &&
                                selectedFile.type.includes("image/") ? (
                                <Image
                                  src={URL.createObjectURL(selectedFile)}
                                />
                              ) : selectedFile &&
                                selectedFile.type.includes(
                                  "application/pdf"
                                ) ? (
                                <embed
                                  src={URL.createObjectURL(selectedFile)}
                                  type="application/pdf"
                                  width="100%"
                                  height="500px"
                                />
                              ) : (
                                <Box>File preview not available</Box>
                              )}
                            </AlertDialogBody>
                            <AlertDialogFooter>
                              {!idImageUrl && (
                                <Button
                                  onClick={handleFileAttach}
                                  colorScheme="teal"
                                  color={buttonColor}
                                  backgroundColor={buttonBgColor}
                                  _hover={{
                                    backgroundColor: buttonHoverBgColor,
                                    color: buttonColor,
                                  }}
                                >
                                  Attach
                                </Button>
                              )}
                              <Button onClick={handlePreviewDialogClose} ml={3}>
                                Close
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>

                      <Text mt={4} fontSize="sm" color="gray.500">
                        {profileCompletion ? (
                          userVerification ? (
                            <Text style={{ color: "green" }}>
                              Your profile has been verified and you can now
                              post and claim items.
                            </Text>
                          ) : (
                            <Text style={{ color: "yellow" }}>
                              Your profile verification is under process. Once
                              verified, you will be able to post and claim
                              items.
                            </Text>
                          )
                        ) : (
                          <Text>
                            <strong>Note:</strong> The id fields and uploaded
                            image will be used for user verification and cannot
                            be changed afterwards. So make sure to check every
                            detail before updating your profile. Please ensure
                            the image is clear and properly scanned to avoid
                            verification issues.
                          </Text>
                        )}
                      </Text>

                      {adminMessage && (
                        <>
                          <Text mt={4} fontSize="sm" color="gray.500">
                            Your verification request has been denied by the
                            admin.
                          </Text>
                          <Text mt={2} fontSize="sm" color="gray.500">
                            Admin Message: {adminMessage}
                          </Text>
                        </>
                      )}
                    </>
                  )}

                  <Box
                    position="relative"
                    width={useBreakpointValue({
                      base: "100%",
                      md: buttonWidth,
                    })}
                    left={useBreakpointValue({
                      base: "0%",
                      md: isEditing ? "0%" : "calc(100% - 20%)",
                    })}
                    transition="left 0.3s ease-in-out"
                  >
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      color={buttonColor}
                      backgroundColor={buttonBgColor}
                      _hover={{
                        backgroundColor: buttonHoverBgColor,
                        color: buttonColor,
                      }}
                      width="100%"
                      onClick={
                        isEditing ? handleButtonClick : handleProfileUpdate
                      }
                      disabled={profileUpdated || isUpdatingProfile} // Disable button while profile is updating
                    >
                      {isUpdatingProfile ? ( // Show spinner only when profile is updating
                        <BeatLoader size={8} color="white" />
                      ) : (
                        buttonText // Show button text if not updating
                      )}
                    </Button>
                  </Box>
                </VStack>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <ProfileFooter />
      </Box>
    </Box>
  );
};

export default Profile;
