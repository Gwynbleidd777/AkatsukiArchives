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
  Text,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Grid,
  useToast,
  CircularProgress,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import SingleItemNavbar from "./SingleItemNavbar";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import { ArrowBackIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const SingleItem = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { itemId } = useParams();
  const dividerWidth = useBreakpointValue({ base: "30%", md: "15%" });
  const toast = useToast();

  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isSecurityQuestionModalOpen, setIsSecurityQuestionModalOpen] =
    useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isShowClaimerInfoModalOpen, setIsShowClaimerInfoModalOpen] =
    useState(false);
  const [isShowPosterInfoModalOpen, setIsShowPosterInfoModalOpen] =
    useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [itemClaim, setItemClaim] = useState(null);
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [mainImageEmbedding, setMainImageEmbedding] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isItemVerified, setIsItemVerified] = useState(false);
  const [isItemComplete, setIsItemComplete] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [claimProcessOngoing, setClaimProcessOngoing] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const [claimUserId, setClaimUserId] = useState(null);
  const [allItemClaims, setAllItemClaims] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedClaimer, setSelectedClaimer] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);

  const [additionalImageUrls, setAdditionalImageUrls] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [additionalImageEmbeddings, setAdditionalImageEmbeddings] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [selectedAdditionalImages, setSelectedAdditionalImages] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [originalAdditionalImageUrls, setOriginalAdditionalImageUrls] =
    useState([null, null, null, null]);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openClaimModal = () => setIsClaimModalOpen(true);
  const closeClaimModal = () => setIsClaimModalOpen(false);

  const openSecurityQuestionModal = () => setIsSecurityQuestionModalOpen(true);
  const closeSecurityQuestionModal = () => {
    setIsClaimModalOpen(false);
    setIsSecurityQuestionModalOpen(false);
  };

  const openValidateModal = (claimId) => {
    setSelectedClaimId(claimId);
    setIsValidateModalOpen(true);
  };
  const closeValidateModal = () => setIsValidateModalOpen(false);

  const openShowClaimerInfoModal = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/show-claimer-info/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedClaimer(response.data); // Set the selected user info in state
      setIsShowClaimerInfoModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const closeShowClaimerInfoModal = () => setIsShowClaimerInfoModalOpen(false);

  const openShowPosterInfoModal = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/show-poster-info/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedPoster(response.data); // Set the selected user info in state
      setIsShowPosterInfoModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const closeShowPosterInfoModal = () => setIsShowPosterInfoModalOpen(false);

  const categoryOptions = [
    { value: "Watch", label: "Watch" },
    { value: "Purse/Money Bag", label: "Purse/Money Bag" },
    { value: "Cards", label: "Cards" },
    { value: "Phone", label: "Phone" },
    { value: "Phone Cover", label: "Phone Cover" },
    { value: "Earphones", label: "Earphones" },
    { value: "Books", label: "Books" },
    {
      value: "Keyboard/Mouse/Charger/Other Similar Gadgets",
      label: "Keyboard/Mouse/Charger/Other Similar Gadgets",
    },
    {
      value: "Glasses/Spectacles/Goggles",
      label: "Glasses/Spectacles/Goggles",
    },
    { value: "Speakers", label: "Speakers" },
    { value: "Lunch Box/Bottle", label: "Lunch Box/Bottle" },
    {
      value: "Pen Drive/USB/Similar Gadgets",
      label: "Pen Drive/USB/Similar Gadgets",
    },
    { value: "Make-Up Kit", label: "Make-Up Kit" },
    {
      value: "Jewellery/Chains/Rings/Similar Items",
      label: "Jewellery/Chains/Rings/Similar Items",
    },
    { value: "Outfit", label: "Outfit" },
    { value: "Others", label: "Others" },
  ];

  const [formData, setFormData] = useState({
    user: "",
    itemName: "",
    category: "",
    description: "",
    location: "",
    itemType: "",
    securityQuestion: "",
    lostFoundDate: "",
    mainImage: "",
    additionalImages: [],
    brand: "",
    itemColor: "Others",
    mainImageEmbedding: [],
    additionalImagesEmbeddings: [],
  });

  const handleSecurityAnswerChange = (event) => {
    setSecurityAnswer(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const newImageUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedMainImage(e.target.files[0]);
      setMainImageUrl(newImageUrl); // Update preview URL
    }
  };

  const handleRemoveImage = () => {
    setSelectedMainImage(null);
    setMainImageUrl(originalImageUrl);
  };

  const handleAdditionalImageChange = (e, index) => {
    if (e.target.files[0]) {
      const newImageUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedAdditionalImages((prev) => {
        const newImages = [...prev];
        newImages[index] = e.target.files[0];
        return newImages;
      });
      setAdditionalImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls[index] = newImageUrl;
        return newUrls;
      });
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    setSelectedAdditionalImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
    setAdditionalImageUrls((prev) => {
      const newUrls = [...prev];
      newUrls[index] = originalAdditionalImageUrls[index];
      return newUrls;
    });
  };

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
    checkOwnership();
    checkItemVerification();
    checkItemCompletion();
    fetchAdminMessage();
    fetchItemClaim();
    fetchAllItemClaims();
  }, []);

  const checkOwnership = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/item/${itemId}/ownership`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsOwner(response.data.isOwner);
    } catch (error) {
      console.error("Error checking item ownership:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    navigate("/all-items");
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

  const fetchItemData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Item data:", response.data);

      const itemData = response.data; // Store the fetched item data

      // Set item data to the state
      setItem(itemData);

      setFormData({
        ...itemData,
        mainImageUrl: itemData.mainImage || "",
        mainImageEmbedding: itemData.mainImageEmbedding || [],
      });

      setOriginalImageUrl(itemData.mainImage);
      setMainImageUrl(itemData.mainImage);
      setSelectedMainImage(itemData.mainImage);
      setLoading(false);

      // Update additional image states
      setAdditionalImageUrls(itemData.additionalImages);
      setAdditionalImageEmbeddings(itemData.additionalImagesEmbeddings);

      // Call prepareImageUrls with the fetched item data
      prepareImageUrls(itemData);
    } catch (error) {
      console.error("Error fetching item data:", error);
      setLoading(false);
    }
  };

  const prepareImageUrls = (itemData) => {
    const validAdditionalImages = itemData.additionalImages.filter(
      (image) => image !== (null || "")
    );
    const allImages = [itemData.mainImage, ...validAdditionalImages];
    setImageUrls(allImages);
  };

  const uploadMainImageToCloudinary = async (file) => {
    if (!file) {
      console.error("No main image selected.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "AkatsukiArchives");
    formData.append("cloud_name", "mohit777");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/mohit777/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const imageData = await response.json();
      console.log("Main image uploaded to Cloudinary:", imageData);
      return imageData.url;
    } catch (error) {
      console.error("Error uploading main image:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload main image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  const generateEmbedding = async (imageFile) => {
    console.log("Loading model...");
    const model = await mobilenet.load();
    console.log("Model loaded, processing image...");

    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(imageFile);

    return new Promise((resolve, reject) => {
      imageElement.onload = async () => {
        const tensor = tf.browser
          .fromPixels(imageElement)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();

        console.log("Generating embedding...");
        const embedding = model.infer(tensor, true); // Get embeddings
        console.log("Embedding generated.");

        resolve(embedding.arraySync()[0]);
      };

      imageElement.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadAdditionalImageToCloudinary = async (file) => {
    if (!file) {
      console.error("No additional image selected.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "AkatsukiArchives");
    formData.append("cloud_name", "mohit777");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/mohit777/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const imageData = await response.json();
      console.log("Additional image uploaded to Cloudinary:", imageData);
      return imageData.url;
    } catch (error) {
      console.error("Error uploading additional image:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload additional image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  const generateAdditionalImageEmbedding = async (imageFile) => {
    console.log("Loading model...");
    const model = await mobilenet.load();
    console.log("Model loaded, processing image...");

    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(imageFile);

    return new Promise((resolve, reject) => {
      imageElement.onload = async () => {
        const tensor = tf.browser
          .fromPixels(imageElement)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();

        console.log("Generating embedding...");
        const embedding = model.infer(tensor, true); // Get embeddings
        console.log("Embedding generated.");

        resolve(embedding.arraySync()[0]);
      };

      imageElement.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);

    // Required fields
    const requiredFields = [
      "user",
      "itemName",
      "category",
      "description",
      "location",
      "itemType",
      "securityQuestion",
      "lostFoundDate",
      "mainImage",
    ];

    // Check for empty required fields
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        toast({
          title: "Error",
          description: "Mandatory fields required.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }
    }

    console.log("itemId:", itemId);
    console.log("Form Data before update:", formData);

    try {
      const token = localStorage.getItem("token");

      // Handle main image upload and embedding generation
      let mainImageUrl = formData.mainImage;
      let mainImageEmbedding = formData.mainImageEmbedding;
      if (selectedMainImage instanceof File) {
        mainImageUrl = await uploadMainImageToCloudinary(selectedMainImage);
        if (mainImageUrl) {
          formData.mainImage = mainImageUrl;
          mainImageEmbedding = await generateEmbedding(selectedMainImage);
          formData.mainImageEmbedding = mainImageEmbedding;
          console.log("Main image uploaded and embedding generated.");
        } else {
          throw new Error("Failed to upload main image");
        }
      } else {
        console.log("Using original main image URL and embedding.");
        mainImageUrl = originalImageUrl;
        mainImageEmbedding = formData.mainImageEmbedding;
      }

      // Handle additional images upload and embedding generation
      for (let i = 0; i < selectedAdditionalImages.length; i++) {
        if (selectedAdditionalImages[i] instanceof File) {
          // Image file exists, upload to Cloudinary and generate embedding
          const uploadedUrl = await uploadAdditionalImageToCloudinary(
            selectedAdditionalImages[i]
          );
          formData.additionalImages[i] = uploadedUrl;
          if (uploadedUrl) {
            formData[`additionalImage${i}`] = uploadedUrl;
            const embedding = await generateAdditionalImageEmbedding(
              selectedAdditionalImages[i]
            );
            formData.additionalImagesEmbeddings[i] = embedding;
            formData[`additionalImageEmbedding${i}`] = embedding;
            console.log(
              `Additional image ${i + 1} uploaded and embedding generated.`
            );
          } else {
            throw new Error(`Failed to upload additional image ${i + 1}`);
          }
        } else if (
          !additionalImageUrls[i] ||
          additionalImageUrls[i].startsWith("blob:")
        ) {
          // Image is null, empty or a local URL, update formData with empty value
          formData.additionalImages[i] = "";
          formData[`additionalImage${i}`] = "";
          formData.additionalImagesEmbeddings[i] = "";
          formData[`additionalImageEmbedding${i}`] = "";
          console.log(`Additional image ${i + 1} set to empty.`);
        } else {
          // Image URL exists and is not a local URL, update formData for safety
          formData.additionalImages[i] = additionalImageUrls[i];
          formData[`additionalImage${i}`] = additionalImageUrls[i];
          formData.additionalImagesEmbeddings[i] = additionalImageEmbeddings[i];
          formData[`additionalImageEmbedding${i}`] =
            additionalImageEmbeddings[i];
          console.log(`Additional image ${i + 1} URL and embedding updated.`);
        }
      }

      // Construct the updated form data
      const updatedFormData = {
        ...formData,
      };

      console.log("Updated Form Data before PUT request:", updatedFormData);

      // Send a PUT request to update the item
      const response = await axios.put(
        `http://localhost:5000/api/auth/update-item/${itemId}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Item Updated Successfully",
          description: "Redirecting you to the updated item page.",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });

        setIsSubmitting(false);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error.message);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again later.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/auth/delete-item/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Item Deleted",
          description: "The item has been deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        closeDeleteModal();
        window.location.reload(); // Reload the page
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkItemVerification = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/item/${itemId}/verification-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsItemVerified(response.data.isVerified);
    } catch (error) {
      console.error("Error checking item verification:", error);
    }
  };

  const checkItemCompletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/item/${itemId}/completion-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsItemComplete(response.data.isComplete);
    } catch (error) {
      console.error("Error checking item completion:", error);
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
        data.data.rejectionType === "itemPostingVerification" // Check rejection type
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

  const handleSecurityAnswerSubmit = async () => {
    try {
      if (!securityAnswer) {
        toast({
          title: "Error",
          description: "Please enter your answer.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/auth/submit-security-answer/${itemId}`,
        {
          answer: securityAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);

      // await axios.post(
      //   `http://localhost:5000/api/auth/store-item-claim-notification/${itemId}`,
      //   {
      //     itemId,
      //     message: "You have a new item claim.",
      //     type: "itemClaim",
      //     isRead: false,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      toast({
        title: "Success",
        description: "Your security answer has been submitted successfully.",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });

      // Reload the window after the toast duration
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3000 milliseconds matches the toast duration
    } catch (error) {
      console.error("Error submitting security answer:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your security answer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchItemClaim = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/item-claims/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const {
        attempts,
        claimProcessOngoing,
        claimSuccess,
        userIdFromToken,
        userId,
      } = response.data;
      console.log("Response Data of Claim Process: ", response.data);
      setAttempts(attempts);
      setClaimProcessOngoing(claimProcessOngoing);
      setClaimSuccess(claimSuccess);
      setUserIdFromToken(userIdFromToken);
      setClaimUserId(userId);
    } catch (error) {
      console.error("Error fetching item claim:", error);
    }
  };

  const fetchAllItemClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/item-claims/all/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllItemClaims(response.data);
    } catch (error) {
      console.error("Error fetching all item claims:", error);
    }
  };

  const handleReject = async (claimId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/reject-item-claim/${claimId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast({
        title: "Item Claim Rejected",
        description: "The item claim has been rejected successfully.",
        status: "success",
        duration: 3000, // Optional duration
        isClosable: true, // Optional close button
        position: "top", // Top position
      });

      // Optionally, you can update the state or perform any other actions after successful rejection
      console.log("Item claim rejected successfully");

      // Reload the window after the toast duration
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Assuming toast duration is 3000 milliseconds
    } catch (error) {
      console.error("Error rejecting item claim:", error);
      // Show error toast
      toast({
        title: "Error",
        description: "An error occurred while rejecting the item claim.",
        status: "error",
        duration: 3000, // Optional duration
        isClosable: true, // Optional close button
        position: "top", // Top position
      });
      // Handle error, display message, etc.
    }
  };

  const handleVerify = async (claimId, itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/verify-item-claim/${claimId}`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast({
        title: "Item Claim Verified",
        description: "The item claim has been verified successfully.",
        status: "success",
        duration: 3000, // Optional duration
        isClosable: true, // Optional close button
        position: "top", // Top position
      });

      // Optionally, you can update the state or perform any other actions after successful verification
      console.log("Item claim verified successfully");

      // Reload the window after the toast duration
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Assuming toast duration is 3000 milliseconds
    } catch (error) {
      console.error("Error verifying item claim:", error);
      // Show error toast
      toast({
        title: "Error",
        description: "An error occurred while verifying the item claim.",
        status: "error",
        duration: 3000, // Optional duration
        isClosable: true, // Optional close button
        position: "top", // Top position
      });
      // Handle error, display message, etc.
    }
  };

  return (
    <Box>
      <SingleItemNavbar />
      <Box>
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
                    <strong>Lost/Found Date:</strong>{" "}
                    {formatDate(item.lostFoundDate)}
                  </Box>
                  <Box
                    mb={2}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  >
                    <strong>Date Posted:</strong> {formatDate(item.datePosted)}
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
        flexWrap="wrap" // Allow items to wrap to the next line if needed
      >
        {loading ? (
          <>
            <Skeleton height="50px" width="80%" mb={4} />
          </>
        ) : (
          <>
            {!formData.deleted && isOwner && (
              <>
                <Text fontSize="sm" color="gray.500">
                  {isItemComplete ? (
                    isItemVerified ? (
                      <Text style={{ color: "green" }}>
                        Your item has been verified and is now available to
                        other users for viewing.
                      </Text>
                    ) : (
                      <Text style={{ color: "yellow" }}>
                        Your item verification is under process. Once verified,
                        your item will be available to other users for viewing.
                      </Text>
                    )
                  ) : (
                    <Text>
                      <strong>Note:</strong> Please ensure all required fields
                      are filled before submitting your item for verification.
                      Providing wrong or false info may result in verification
                      rejection. Posting false items for quite a few times may
                      result in permanent account deletion. The more details you
                      provide, the more authentic your item becomes. If you
                      don't have any image of the item then provide a similar
                      image from the internet which has a close match to the
                      original item.
                    </Text>
                  )}
                </Text>

                {adminMessage && (
                  <>
                    <Text fontSize="sm" color="gray.500">
                      Your verification request for this item has been denied by
                      the admin.
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.500">
                      Admin Message: {adminMessage}
                    </Text>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Flex>

      <Flex
        width="100%"
        mb={{ base: 4, md: 8 }}
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-around" }}
        alignItems="center"
        maxW="100%"
        mx="auto"
        flexWrap="wrap" // Allow items to wrap to the next line if needed
      >
        {loading ? (
          <>
            <Skeleton height="50px" width="80%" mb={4} />
            <Skeleton height="200px" width="90%" />
          </>
        ) : (
          <>
            {!formData.deleted && (
              <>
                {isOwner ? (
                  <>
                    <Box mb={{ base: 4, md: 0 }} textAlign="center">
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
                        width={{ base: "80%", md: "100%" }}
                        mb={{ base: 2, md: 0 }}
                        onClick={openEditModal}
                      >
                        Edit Item
                      </Button>
                    </Box>
                    <Box mb={{ base: 4, md: 0 }} textAlign="center">
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
                        width={{ base: "80%", md: "100%" }}
                        mt={{ base: 3, md: 0 }}
                        mb={{ base: 2, md: 0 }}
                        onClick={openDeleteModal}
                      >
                        Delete Item
                      </Button>
                    </Box>
                    <Box width="90%" mx="auto" mt={10}>
                      <Box
                        borderWidth="1px"
                        borderRadius="md"
                        p={4}
                        minHeight="200px"
                      >
                        <Text
                          fontSize="3xl"
                          mb={4}
                          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                        >
                          Responses
                        </Text>
                        {allItemClaims.length === 0 ? (
                          <Text
                            textAlign="center"
                            mt="auto"
                            mb="auto"
                            color={
                              colorMode === "light" ? "#385A64" : "#00DFC0"
                            }
                          >
                            No responses yet
                          </Text>
                        ) : (
                          allItemClaims.map((claim) => (
                            <Box
                              key={claim._id}
                              borderWidth="1px"
                              borderRadius="md"
                              p={4}
                              mb={4}
                              backgroundColor={
                                colorMode === "light" ? "gray.100" : "gray.700"
                              }
                              display="flex"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color={
                                    colorMode === "light" ? "gray.800" : "white"
                                  }
                                >
                                  Claimed By: {claim.userId.fullName}
                                </Text>
                                <Text
                                  fontSize="md"
                                  color={
                                    colorMode === "light"
                                      ? "gray.600"
                                      : "gray.300"
                                  }
                                >
                                  Security Question: {claim.securityQuestion}
                                </Text>
                                <Text
                                  fontSize="md"
                                  color={
                                    colorMode === "light"
                                      ? "gray.600"
                                      : "gray.300"
                                  }
                                >
                                  Security Answer: {claim.securityAnswer}
                                </Text>
                                <Text
                                  fontSize="md"
                                  color={
                                    colorMode === "light"
                                      ? "gray.600"
                                      : "gray.300"
                                  }
                                >
                                  Claimed On: {formatDate(claim.createdAt)}
                                </Text>
                                <Text
                                  fontSize="md"
                                  color={
                                    colorMode === "light"
                                      ? "gray.600"
                                      : "gray.300"
                                  }
                                >
                                  Attempts: {claim.attempts}
                                </Text>
                              </Box>
                              <Box display="flex" alignItems="center">
                                {claim.claimSuccess ? (
                                  <Button
                                    colorScheme="teal"
                                    variant="outline"
                                    color={
                                      colorMode === "dark"
                                        ? "#00DFC0"
                                        : "#385A64"
                                    }
                                    backgroundColor={
                                      colorMode === "dark"
                                        ? "#2D3748"
                                        : "#00DFC0"
                                    }
                                    _hover={{
                                      backgroundColor:
                                        colorMode === "dark"
                                          ? "#385A64"
                                          : "#2D3748",
                                      color:
                                        colorMode === "dark"
                                          ? "#00DFC0"
                                          : "#00DFC0",
                                    }}
                                    onClick={() => openShowClaimerInfoModal()}
                                  >
                                    Show Info
                                  </Button>
                                ) : (
                                  <Button
                                    colorScheme="teal"
                                    variant="outline"
                                    color={
                                      colorMode === "dark"
                                        ? "#00DFC0"
                                        : "#385A64"
                                    }
                                    backgroundColor={
                                      colorMode === "dark"
                                        ? "#2D3748"
                                        : "#00DFC0"
                                    }
                                    _hover={{
                                      backgroundColor:
                                        colorMode === "dark"
                                          ? "#385A64"
                                          : "#2D3748",
                                      color:
                                        colorMode === "dark"
                                          ? "#00DFC0"
                                          : "#00DFC0",
                                    }}
                                    onClick={() => openValidateModal(claim._id)}
                                  >
                                    Validate
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    {userIdFromToken === claimUserId ? (
                      <>
                        <Box textAlign="center">
                          {claimProcessOngoing && !claimSuccess && (
                            <Box mb={4}>
                              <Text color="yellow.500">
                                Your claim has been submitted to the user who
                                posted the item. You will soon receive updates
                                after the user responds to your claim.
                              </Text>
                            </Box>
                          )}
                          {!claimProcessOngoing &&
                            attempts >= 1 &&
                            !claimSuccess && (
                              <Box mb={4}>
                                <Text color="red.500">
                                  Your item claim has been rejected.
                                </Text>
                              </Box>
                            )}
                          {claimSuccess && (
                            <>
                              <Box mb={4}>
                                <Text color="green.500">
                                  Your item claim has been approved by the user.
                                </Text>
                              </Box>
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
                                    colorMode === "dark"
                                      ? "#385A64"
                                      : "#2D3748",
                                  color:
                                    colorMode === "dark"
                                      ? "#00DFC0"
                                      : "#00DFC0",
                                }}
                                onClick={() => openShowPosterInfoModal()}
                              >
                                Show Info
                              </Button>
                            </>
                          )}
                          {attempts < 3 &&
                            !claimProcessOngoing &&
                            !claimSuccess && (
                              <Box mb={4}>
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
                                      colorMode === "dark"
                                        ? "#385A64"
                                        : "#2D3748",
                                    color:
                                      colorMode === "dark"
                                        ? "#00DFC0"
                                        : "#00DFC0",
                                  }}
                                  width={{ base: "80%", md: "100%" }}
                                  onClick={openClaimModal}
                                >
                                  Claim Item
                                </Button>
                              </Box>
                            )}
                        </Box>
                      </>
                    ) : (
                      <>
                        {attempts < 3 &&
                          !claimProcessOngoing &&
                          !claimSuccess && (
                            <Box textAlign="center" mb={4}>
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
                                    colorMode === "dark"
                                      ? "#385A64"
                                      : "#2D3748",
                                  color:
                                    colorMode === "dark"
                                      ? "#00DFC0"
                                      : "#00DFC0",
                                }}
                                width={{ base: "80%", md: "50%" }}
                                onClick={openClaimModal}
                              >
                                Claim Item
                              </Button>
                            </Box>
                          )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Flex>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent maxW="4xl">
          <ModalHeader>Edit Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl>
                <FormLabel>
                  Item Name<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input
                  type="text"
                  name="itemName"
                  placeholder="Enter Item Name"
                  value={formData.itemName || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Category<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select
                  name="category"
                  placeholder="Select Category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <FormControl mt={4}>
              <FormLabel>
                Description<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Textarea
                name="description"
                placeholder="Enter Description Of The Item"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>
                Location<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Input
                name="location"
                placeholder="Enter Location"
                value={formData.location || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>
                Item Type<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Select
                name="itemType"
                placeholder="Select Item Type"
                value={formData.itemType || ""}
                onChange={handleInputChange}
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>
                Security Question<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Input
                name="securityQuestion"
                placeholder="Provide A Security Question That You Want To Ask"
                value={formData.securityQuestion || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>
                Lost/Found Date<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Input
                name="lostFoundDate"
                type="date"
                placeholder="Enter Lost/Found Date"
                value={
                  formData.lostFoundDate
                    ? formData.lostFoundDate.substring(0, 10)
                    : ""
                }
                onChange={handleInputChange}
              />
            </FormControl>

            <Flex flexWrap="wrap" mt={4}>
              <FormControl mt={4}>
                <FormLabel>
                  Main Image<span style={{ color: "red" }}>*</span>
                </FormLabel>
                {mainImageUrl ? (
                  <Box
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                  >
                    <Box as="h3" fontWeight="bold" mb={2}>
                      Preview Box
                    </Box>
                    <Box
                      style={{
                        display: "table",
                        margin: "0 auto",
                        width: "300px",
                      }}
                    >
                      <Box
                        as="img"
                        src={mainImageUrl}
                        alt="Main Item Image"
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                          padding: "5px",
                        }}
                      />
                      <Flex justify="center" mt={2} gap={4}>
                        <label htmlFor="fileInput">
                          <Button
                            as="span"
                            colorScheme="teal"
                            variant="outline"
                            color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                            backgroundColor={
                              colorMode === "dark" ? "#2D3748" : "#00DFC0"
                            }
                            _hover={{
                              backgroundColor:
                                colorMode === "dark" ? "#385A64" : "#2D3748",
                              color: "#00DFC0",
                            }}
                          >
                            Replace Image
                          </Button>
                          <input
                            type="file"
                            id="fileInput"
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleImageChange}
                            hidden
                          />
                        </label>
                        {selectedMainImage &&
                          selectedMainImage !== originalImageUrl && (
                            <Button
                              onClick={handleRemoveImage}
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
                                color: "#00DFC0",
                              }}
                            >
                              Remove Image
                            </Button>
                          )}
                      </Flex>
                    </Box>
                  </Box>
                ) : (
                  <label htmlFor="fileInput">
                    <Flex direction="column" align="center">
                      <Button
                        as="span"
                        colorScheme="teal"
                        variant="outline"
                        color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                        backgroundColor={
                          colorMode === "dark" ? "#2D3748" : "#00DFC0"
                        }
                        _hover={{
                          backgroundColor:
                            colorMode === "dark" ? "#385A64" : "#2D3748",
                          color: "#00DFC0",
                        }}
                      >
                        <input
                          type="file"
                          id="fileInput"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={handleImageChange}
                          hidden
                        />
                        Select an Image
                      </Button>
                    </Flex>
                  </label>
                )}
              </FormControl>
            </Flex>

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <FormControl mt={4}>
                <FormLabel>Brand (If Known)</FormLabel>
                <Input
                  name="brand"
                  placeholder="Enter Brand Of The Item"
                  value={formData.brand || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Item Color (If Known)</FormLabel>
                <Select
                  name="itemColor"
                  placeholder="Select Color"
                  value={formData.itemColor || ""}
                  onChange={handleInputChange}
                >
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Orange">Orange</option>
                  <option value="Purple">Purple</option>
                  <option value="Pink">Pink</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Gray">Gray</option>
                  <option value="Brown">Brown</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Others">Others</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>
              {[0, 1, 2, 3].map((index) => (
                <FormControl key={index} mt={4}>
                  <FormLabel>Additional Image {index + 1}</FormLabel>
                  {additionalImageUrls[index] ? (
                    <Box
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={4}
                      textAlign="center"
                    >
                      <Box as="h3" fontWeight="bold" mb={2}>
                        Preview Box
                      </Box>
                      <Box
                        style={{
                          display: "table",
                          margin: "0 auto",
                          width: "300px",
                        }}
                      >
                        <Box
                          as="img"
                          src={additionalImageUrls[index]}
                          alt={`Additional Item Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            padding: "5px",
                          }}
                        />
                        <Flex justify="center" mt={2} gap={4}>
                          <label htmlFor={`fileInput-${index}`}>
                            <Button
                              as="span"
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
                                color: "#00DFC0",
                              }}
                            >
                              Replace Image
                            </Button>
                            <input
                              type="file"
                              id={`fileInput-${index}`}
                              accept="image/jpeg, image/png, image/jpg"
                              onChange={(e) =>
                                handleAdditionalImageChange(e, index)
                              }
                              hidden
                            />
                          </label>
                          <Button
                            onClick={() => handleRemoveAdditionalImage(index)}
                            colorScheme="teal"
                            variant="outline"
                            color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                            backgroundColor={
                              colorMode === "dark" ? "#2D3748" : "#00DFC0"
                            }
                            _hover={{
                              backgroundColor:
                                colorMode === "dark" ? "#385A64" : "#2D3748",
                              color: "#00DFC0",
                            }}
                          >
                            Remove Image
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  ) : (
                    <label htmlFor={`fileInput-${index}`}>
                      <Flex direction="column" align="center">
                        <Button
                          as="span"
                          colorScheme="teal"
                          variant="outline"
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                          backgroundColor={
                            colorMode === "dark" ? "#2D3748" : "#00DFC0"
                          }
                          _hover={{
                            backgroundColor:
                              colorMode === "dark" ? "#385A64" : "#2D3748",
                            color: "#00DFC0",
                          }}
                        >
                          <input
                            type="file"
                            id={`fileInput-${index}`}
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={(e) =>
                              handleAdditionalImageChange(e, index)
                            }
                            hidden
                          />
                          Select an Image
                        </Button>
                      </Flex>
                    </label>
                  )}
                </FormControl>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={closeEditModal}
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
            >
              Close
            </Button>
            <Button
              onClick={handleUpdate}
              isLoading={isSubmitting}
              colorScheme="teal"
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
            >
              {isSubmitting ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                "Save"
              )}
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
            <Button
              colorScheme="red"
              mr={3}
              onClick={closeDeleteModal}
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={handleDelete}
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isClaimModalOpen} onClose={closeClaimModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Claim Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to claim this item?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={closeClaimModal}
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
            >
              Close
            </Button>
            <Button
              variant="ghost"
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
              onClick={openSecurityQuestionModal} // Add this onClick event
            >
              Claim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSecurityQuestionModalOpen}
        onClose={closeSecurityQuestionModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Security Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>{formData.securityQuestion}</Text>
            <Input
              type="text"
              placeholder="Enter your answer"
              value={securityAnswer}
              onChange={handleSecurityAnswerChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={closeSecurityQuestionModal}
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
            >
              Cancel
            </Button>
            {/* Chakra UI Button for Submit */}
            <Button
              colorScheme="teal"
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
              onClick={handleSecurityAnswerSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isValidateModalOpen} onClose={closeValidateModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Validate Security Answer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Do you want to verify or reject the item claim? Verifying it will
              automatically reject all other item claims.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="ghost"
              mr={3}
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color="#00DFC0"
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
              onClick={() => handleVerify(selectedClaimId, itemId)}
            >
              Verify
            </Button>
            <Button
              variant="ghost"
              bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              borderRadius="md"
              border={`2px solid ${
                colorMode === "dark" ? "#385A64" : "#00DFC0"
              }`}
              color="#00DFC0"
              _hover={{
                bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                color: colorMode === "dark" ? "#00DFC0" : "#385A64",
              }}
              onClick={() => handleReject(selectedClaimId)}
            >
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isShowClaimerInfoModalOpen}
        onClose={closeShowClaimerInfoModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedClaimer && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Name: {selectedClaimer.fullName}
                </Text>
                <Text fontSize="md">Email: {selectedClaimer.email}</Text>
                <Text fontSize="md">
                  Phone Number: {selectedClaimer.phoneNumber}
                </Text>
              </>
            )}
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
              mr={3}
              onClick={closeShowClaimerInfoModal}
            >
              Close
            </Button>
            {/* Message button */}
            <Button
              colorScheme="teal"
              variant="outline"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
              _hover={{
                backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
              }}
              onClick={() => navigate(`/messages/${selectedClaimer._id}`)}
            >
              Message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isShowPosterInfoModalOpen}
        onClose={closeShowPosterInfoModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPoster && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Name: {selectedPoster.fullName}
                </Text>
                <Text fontSize="md">Email: {selectedPoster.email}</Text>
                <Text fontSize="md">
                  Phone Number: {selectedPoster.phoneNumber}
                </Text>
              </>
            )}
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
              mr={3}
              onClick={closeShowPosterInfoModal}
            >
              Close
            </Button>
            {/* Message button */}
            <Button
              colorScheme="teal"
              variant="outline"
              color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
              backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
              _hover={{
                backgroundColor: colorMode === "dark" ? "#385A64" : "#2D3748",
                color: colorMode === "dark" ? "#00DFC0" : "#00DFC0",
              }}
              onClick={() => navigate(`/messages/${selectedPoster._id}`)}
            >
              Message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default SingleItem;
