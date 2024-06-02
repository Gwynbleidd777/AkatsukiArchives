import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Divider,
  useBreakpointValue,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowBackIcon } from "@chakra-ui/icons";
import AuthenticatedNavbar from "../../components/AuthNav";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const AddItem = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const dividerWidth = useBreakpointValue({ base: "98%", md: "30%" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(Array(4).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackButtonClick = () => {
    navigate("/all-items");
  };

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

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    itemType: "",
    securityQuestion: "",
    lostFoundDate: "",
    brand: "",
    itemColor: "",
    mainImage: "",
    additionalImages: ["", "", "", ""],
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({ ...formData, mainImage: file });
    } else {
      setSelectedImage(null);
      console.error(
        "Invalid file type. Please select an image (jpg, jpeg, or png)."
      );
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData({ ...formData, mainImage: "" });
  };

  const handleImageChanges = (index, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...selectedImages];
        newImages[index] = reader.result;
        setSelectedImages(newImages);
        setFormData({
          ...formData,
          additionalImages: newImages,
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.error(
        "Invalid file type. Please select an image (jpg, jpeg, or png)."
      );
    }
  };

  const handleRemoveImages = (index) => {
    const newImages = [...selectedImages];
    newImages[index] = null;
    setSelectedImages(newImages);
  };

  const uploadMainImageToCloudinary = async () => {
    const file = formData.mainImage;
    if (!file) {
      console.error("No main image selected.");
      return null;
    }

    const formDataCopy = new FormData();
    formDataCopy.append("file", file);
    formDataCopy.append("upload_preset", "AkatsukiArchives");
    formDataCopy.append("cloud_name", "mohit777");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/mohit777/image/upload",
        {
          method: "POST",
          body: formDataCopy,
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

  const uploadAdditionalImagesToCloudinary = async (additionalImages) => {
    const uploadedAdditionalImages = [];

    for (let i = 0; i < additionalImages.length; i++) {
      const image = additionalImages[i];
      if (image) {
        const formDataCopy = new FormData();
        formDataCopy.append("file", image);
        formDataCopy.append("upload_preset", "AkatsukiArchives");
        formDataCopy.append("cloud_name", "mohit777");

        try {
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/mohit777/image/upload",
            {
              method: "post",
              body: formDataCopy,
            }
          );
          const imageData = await response.json();
          uploadedAdditionalImages.push(imageData.url);
          console.log("Uploaded additional image:", imageData.url);
        } catch (error) {
          console.error("Error uploading additional image:", error);
          uploadedAdditionalImages.push(null);
        }
      } else {
        uploadedAdditionalImages.push(null);
      }
    }

    return uploadedAdditionalImages;
  };

  const generateEmbedding = async (imageElement) => {
    console.log("Loading model...");
    const model = await mobilenet.load();
    console.log("Model loaded, processing image...");

    const tensor = tf.browser
      .fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    console.log("Generating embedding...");
    const embedding = model.infer(tensor, true); // Get embeddings
    console.log("Embedding generated.");
    return embedding.arraySync()[0];
  };

  const fetchImageElement = async (imageUrl) => {
    console.log("Fetching image:", imageUrl);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    console.log("Image fetched:", imageUrl);
    return img;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const profileResponse = await fetch(
        "http://localhost:5000/api/auth/check-profile-completion",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to check profile completion");
      }

      const profileCompletionResult = await profileResponse.json();

      const verificationResponse = await fetch(
        "http://localhost:5000/api/auth/check-user-verification",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!verificationResponse.ok) {
        throw new Error("Failed to check user verification");
      }

      const verificationResult = await verificationResponse.json();

      if (!profileCompletionResult.complete && !verificationResult.verified) {
        toast({
          title: "Profile Incomplete & Unverified",
          description: "Complete and verify your profile before posting.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      if (!profileCompletionResult.complete) {
        toast({
          title: "Profile Incomplete",
          description: "Complete your profile before posting.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      if (!verificationResult.verified) {
        toast({
          title: "Profile Unverified",
          description: "Verify your profile before posting.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      if (!selectedImage) {
        toast({
          title: "Main Image Missing",
          description: "Upload the main image for your item.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Uploading main image to Cloudinary...");
      const mainImageUrl = await uploadMainImageToCloudinary();
      console.log("Main Image URL:", mainImageUrl);
      if (!mainImageUrl) {
        console.error("Failed to upload main image to Cloudinary");
        setIsSubmitting(false);
        return;
      }

      console.log("Uploading additional images to Cloudinary...");
      const uploadedAdditionalImages = await uploadAdditionalImagesToCloudinary(
        formData.additionalImages
      );
      console.log("Uploaded Additional Images:", uploadedAdditionalImages);

      // Filter out null values from the uploadedAdditionalImages array
      const validAdditionalImages = uploadedAdditionalImages.filter(
        (url) => url !== null
      );
      console.log("Valid Additional Images:", validAdditionalImages);

      console.log("Fetching and processing main image...");
      const mainImageElement = await fetchImageElement(mainImageUrl);
      const mainImageEmbedding = await generateEmbedding(mainImageElement);

      console.log("Fetching and processing additional images...");
      const additionalImagesEmbeddings = await Promise.all(
        validAdditionalImages.map(async (url) => {
          const imgElement = await fetchImageElement(url);
          return generateEmbedding(imgElement);
        })
      );

      const updatedFormData = {
        ...formData,
        mainImage: mainImageUrl,
        additionalImages: validAdditionalImages,
        mainImageEmbedding,
        additionalImagesEmbeddings,
      };

      console.log("Submitting form data...");
      const postResponse = await fetch(
        "http://localhost:5000/api/auth/post-items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (!postResponse.ok) {
        throw new Error("Failed to submit form data");
      }

      console.log("Form data submitted successfully");
      setIsSubmitting(false);

      toast({
        title: "Item Posted Successfully",
        description: "Redirecting You To The All Items Page.",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/all-items");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to post item. Please try again later.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <AuthenticatedNavbar />
      <Box padding={4}>
        <Button variant="ghost" onClick={handleBackButtonClick} mr={4}>
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
          Add Lost Or Found Item
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

        <Box px={{ base: 2, md: 20 }}>
          <Box
            borderWidth="1px"
            borderRadius="md"
            p={4}
            mt={4}
            borderColor={colorMode === "light" ? "#385A64" : "#00DFC0"}
          >
            <form onSubmit={handleSubmit}>
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                mb={4}
              >
                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Item Name<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    name="itemName"
                    placeholder="Enter Item Name"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Category<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    name="category"
                    placeholder="Select Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <FormControl mb={4}>
                <FormLabel
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  className="required-label"
                >
                  Description<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Textarea
                  name="description"
                  placeholder="Enter Description Of The Item"
                  value={formData.description}
                  onChange={handleInputChange}
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  focusBorderColor={
                    colorMode === "light" ? "#385A64" : "#00DFC0"
                  }
                />
              </FormControl>

              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                mb={4}
              >
                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Location<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Input
                    name="location"
                    placeholder="Enter Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Item Type<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    name="itemType"
                    placeholder="Select Item Type"
                    value={formData.itemType}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                mb={4}
              >
                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Security Question<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Input
                    name="securityQuestion"
                    placeholder="Provide A Security Question That You Want To Ask"
                    value={formData.securityQuestion}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Lost/Found Date<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Input
                    name="lostFoundDate"
                    type="date"
                    placeholder="Enter Lost/Found Date"
                    value={formData.lostFoundDate}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  />
                </FormControl>
              </Grid>

              <FormControl mb={4}>
                <FormLabel
                  color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                  className="required-label"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Item Image<span style={{ color: "red" }}>*</span>
                  </span>
                </FormLabel>
                {selectedImage ? (
                  <Box
                    style={{
                      display: "table",
                      margin: "0 auto",
                      width: "300px",
                    }}
                  >
                    <Box
                      as="img"
                      src={selectedImage}
                      alt="Selected Item Image"
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        border: `1px solid ${
                          colorMode === "dark" ? "#00DFC0" : "#385A64"
                        }`,
                        padding: "5px",
                      }}
                    />
                    <Flex justify="center" mt={2}>
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
                          color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                        }}
                        width="50%"
                        onClick={handleRemoveImage}
                      >
                        Remove Image
                      </Button>
                    </Flex>
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
                          color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                        }}
                        width={{ base: "30%", md: "15%" }}
                      >
                        <input
                          type="file"
                          id="fileInput"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={handleImageChange}
                          hidden
                        />
                        Upload Image
                      </Button>
                    </Flex>
                  </label>
                )}
              </FormControl>

              <Divider
                mt={10}
                mb={10}
                borderColor={colorMode === "light" ? "#385A64" : "#00DFC0"}
                w="95%"
                mx="auto"
              />

              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                mb={4}
              >
                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Brand(If Known)
                  </FormLabel>
                  <Input
                    name="brand"
                    placeholder="Enter Brand Of The Item"
                    value={formData.brand}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    className="required-label"
                  >
                    Item Color (If Known)
                  </FormLabel>
                  <Select
                    name="itemColor"
                    placeholder="Select Color"
                    value={formData.itemColor}
                    onChange={handleInputChange}
                    color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                    focusBorderColor={
                      colorMode === "light" ? "#385A64" : "#00DFC0"
                    }
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

              <Flex flexWrap="wrap">
                {selectedImages.map((image, index) => (
                  <FormControl
                    key={index}
                    mb={4}
                    flexBasis={{ base: "100%", md: "50%" }}
                  >
                    <FormLabel
                      color={colorMode === "light" ? "#385A64" : "#00DFC0"}
                      className="required-label"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        Additional Image {index + 2}
                      </span>
                    </FormLabel>
                    {image ? (
                      <Box
                        style={{
                          display: "table",
                          margin: "0 auto",
                          width: "300px",
                        }}
                      >
                        <Box
                          as="img"
                          src={image}
                          alt={`Selected Item Image ${index + 2}`}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            border: `1px solid ${
                              colorMode === "dark" ? "#00DFC0" : "#385A64"
                            }`,
                            padding: "5px",
                          }}
                        />
                        <Flex justify="center" mt={2}>
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
                              color:
                                colorMode === "dark" ? "#00DFC0" : "#385A64",
                            }}
                            width="50%"
                            onClick={() => handleRemoveImages(index)}
                          >
                            Remove Image
                          </Button>
                        </Flex>
                      </Box>
                    ) : (
                      <label
                        htmlFor={`fileInput-${index}`}
                        style={{ clear: "both", display: "block" }}
                      >
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
                              color:
                                colorMode === "dark" ? "#00DFC0" : "#385A64",
                            }}
                            width={{ base: "30%", md: "30%" }}
                          >
                            <input
                              type="file"
                              id={`fileInput-${index}`}
                              accept="image/jpeg, image/png, image/jpg"
                              onChange={(e) => handleImageChanges(index, e)}
                              hidden
                            />
                            Upload Image
                          </Button>
                        </Flex>
                      </label>
                    )}
                  </FormControl>
                ))}
              </Flex>

              <Divider
                mt={10}
                mb={5}
                borderColor={colorMode === "light" ? "#385A64" : "#00DFC0"}
                w="95%"
                mx="auto"
              />

              <Flex direction="column" align="center">
                <Button
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                  colorScheme="teal"
                  variant="outline"
                  color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                  backgroundColor={colorMode === "dark" ? "#2D3748" : "#00DFC0"}
                  _hover={{
                    backgroundColor:
                      colorMode === "dark" ? "#385A64" : "#2D3748",
                    color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                  }}
                  width="40%"
                  mb={5}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting" : "Submit"}
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>
      </Box>
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default AddItem;
