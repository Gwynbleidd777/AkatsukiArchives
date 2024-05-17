import React from "react";
import { Box, Heading, Text, Link, useColorMode } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollUp";

const Terms = () => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Navbar />
      <Box p={8} maxWidth="70%" mx="auto" mt={{ base: 8, md: 20 }}>
        <Heading
          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
          fontSize="5xl"
          textAlign="center"
        >
          Terms & Policies
        </Heading>
        <Heading
          mb={50}
          mt={100}
          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
          fontSize="4xl"
          textAlign="left"
        >
          Table of Contents: 
        </Heading>
        <Text color={colorMode === "light" ? "#385A64" : "#00DFC0"}>
          {/* Your terms content goes here */}
          <ol>
            <li>
              <Link href="#section1">Acceptance of Terms</Link>
            </li>
            <li>
              <Link href="#section2">Eligibility</Link>
            </li>
            <li>
              <Link href="#section3">Lost Item Submission</Link>
            </li>
            <li>
              <Link href="#section4">Found Item Reporting</Link>
            </li>
            <li>
              <Link href="#section5">Ownership Verification</Link>
            </li>
            <li>
              <Link href="#section6">Privacy</Link>
            </li>
            <li>
              <Link href="#section7">Use of Information</Link>
            </li>
            <li>
              <Link href="#section8">Disclaimer of Liability</Link>
            </li>
            <li>
              <Link href="#section9">Disclaimer of Liability</Link>
            </li>
            <li>
              <Link href="#section10">Changes to Terms</Link>
            </li>
            {/* Add more points here */}
          </ol>


          <Heading
          mb={0}
          mt={100}
          color={colorMode === "light" ? "#385A64" : "#00DFC0"}
          fontSize="4xl"
          textAlign="left"
        >
          Terms of use: 
        </Heading>
          <section id="section1" style={{ marginTop: "50px" }}>
            <Heading as="h2" size="md" my={4}>
              1. Acceptance of Terms
            </Heading>
            <Text>
               By accessing and using our website, you agree to abide by these terms and conditions.
            </Text>
          </section>
          <section id="section2">
            <Heading as="h2" size="md" my={4}>
              2. Eligibility
            </Heading>
            <Text>
                Users must be at least 18 years of age to use our website. By using the website, 
                you confirm that you are of legal age to enter into this agreement.
            </Text>
          </section>
          <section id="section3">
          <Heading as="h2" size="md" my={4}>
              3. Lost Item Submission
            </Heading>
            <Text>
            Users may submit details about lost items through our website, including descriptions, photos, and contact information. 
            All submitted information must be accurate and truthful.
            </Text>
          </section>

          <section id="section4">
          <Heading as="h2" size="md" my={4}>
              4. Found Item Reporting
            </Heading>
            <Text>
            If a user finds an item and wishes to report it on our website, they must provide accurate details about the found item, including its location and a description. 
            Users must also agree to make a reasonable effort to return found items to their rightful owners.
            </Text>
          </section>
          
          <section id="section5">
          <Heading as="h2" size="md" my={4}>
              5. Ownership Verification
            </Heading>
            <Text>
            Users submitting a claim for a lost item must provide sufficient evidence to verify ownership, such as a detailed description, photos, or proof of purchase.
            </Text>
          </section>

          <section id="section6">
          <Heading as="h2" size="md" my={4}>
              6. Privacy
            </Heading>
            <Text>
            We respect the privacy of our users. Any personal information collected through the website will be handled in accordance with our Privacy Policy.
            </Text>
          </section>

          <section id="section7">
          <Heading as="h2" size="md" my={4}>
              7. Use of Information
            </Heading>
            <Text>
            Information submitted to our website may be shared with relevant parties involved in the lost and found process, including but not limited to the owner of a found item and local authorities.
            </Text>
          </section>

          <section id="section8">
          <Heading as="h2" size="md" my={4}>
              8. Disclaimer of Liability
            </Heading>
            <Text>
            We are not responsible for any lost or found items, nor are we liable for any damages or losses incurred as a result of using our website or services. Users utilize the website at their own risk.
            </Text>
          </section>

          <section id="section9">
          <Heading as="h2" size="md" my={4}>
              9. Moderation and Removal
            </Heading>
            <Text>
            We reserve the right to moderate and remove any content submitted to our website that violates these terms and conditions or is otherwise deemed inappropriate.
            </Text>
          </section>

          <section id="section10">
          <Heading as="h2" size="md" my={4}>
              10. Changes to Terms
            </Heading>
            <Text>
            We may update these terms and conditions from time to time. Users are responsible for regularly reviewing the terms and agreeing to any changes.
            </Text>
          </section>
          {/* Add more sections for other points */}
        </Text>
      </Box>
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default Terms;