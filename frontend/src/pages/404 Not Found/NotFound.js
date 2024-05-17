import React, { useState, useEffect } from "react";
import { Box, Text, Link, useColorMode, useToast } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AuthenticatedNavbar from "../../components/AuthNav"; // Import AuthenticatedNavbar
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";
import Img1 from "../../Logo/Img14.png";
import Img2 from "../../Logo/Img15.png";
import Img3 from "../../Logo/Img16.png";
import Img4 from "../../Logo/Img17.png";
import axios from "axios";

const images = [Img1, Img2, Img3, Img4];

const NotFound = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to store admin status

  useEffect(() => {
    // Fetch isAdmin status from localStorage
    const isAdminFromStorage = localStorage.getItem("isAdmin");
    setIsAdmin(isAdminFromStorage === "true");
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!redirecting) {
        redirectToCorrectPage();
      }
    }, 7000);

    return () => clearTimeout(timeoutId);
  }, [redirecting]);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const verifyUser = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
  
      // Make a GET request to backend route to verify authentication and admin status
      const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Return isAdmin status from backend response
      return response.data.isAdmin;
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., token expired, unauthorized)
      return false;
    }
  };
  
  // Usage in your component
  const redirectToCorrectPage = async () => {
    const isAuthenticated = !!localStorage.getItem('token');
    console.log('Is authenticated:', isAuthenticated);
  
    if (isAuthenticated) {
      const isAdmin = await verifyUser();
      console.log('Is admin:', isAdmin);
  
      if (isAdmin) {
        redirectToAdminDashboard(); // Redirect admin to admin dashboard
      } else {
        redirectToAllItems(); // Redirect regular user to all items page
      }
    } else {
      redirectToHome(); // Redirect to home if not authenticated
    }
  };

  const redirectToHome = () => {
    setRedirecting(true);
    toast({
      title: "Redirecting to Home 🤚🏻",
      description: "You are being redirected to the home page.",
      status: "info",
      position: "top",
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const redirectToAllItems = () => {
    setRedirecting(true);
    toast({
      title: "Redirecting to All Items 🤚🏻",
      description: "You are being redirected to the all items page.",
      status: "info",
      position: "top",
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      window.location.href = "/all-items";
    }, 2000);
  };

  const redirectToAdminDashboard = () => {
    setRedirecting(true);
    toast({
      title: "Redirecting to Admin Dashboard 🤚🏻",
      description: "You are being redirected to the admin dashboard.",
      status: "info",
      position: "top",
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      window.location.href = "/admin-dashboard";
    }, 2000);
  };

  return (
    <Box>
      {localStorage.getItem("token") ? <AuthenticatedNavbar /> : <Navbar />}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
        px={4}
        mt="20"
      >
        <img
          src={getRandomImage()}
          alt="Random Image"
          style={{
            borderRadius: "md",
            marginBottom: "4px",
            maxWidth: "600px",
            width: "100%",
            height: "auto",
            maxHeight: "600px",
          }}
        />

        <Text color={colorMode === "light" ? "#385A64" : "#00DFC0"} mb={4}>
          Looks Like There's Nothing To See Here 😕
        </Text>
        <Text color={colorMode === "light" ? "#385A64" : "#00DFC0"} mb={4}>
          Click{" "}
          <Link color="teal.500" onClick={redirectToCorrectPage}>
            Here
          </Link>{" "}
          To Redirect To The Main Page Right Now!
        </Text>
      </Box>
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default NotFound;
