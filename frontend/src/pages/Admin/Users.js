import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  useMediaQuery,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useColorMode,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { SearchIcon, ViewIcon } from "@chakra-ui/icons";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import ScrollToTopButton from "../../components/ScrollUp";
import axios from "axios";

const AdminUsers = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Backend response:", response.data); // Log backend response
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = () => {};

  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />

        {/* Search Box */}
        <Box
          width={{ base: "90%", md: "60%" }}
          mt={8}
          mb={8}
          ml="auto"
          mr="auto"
        >
          <InputGroup alignItems="center" mb={4}>
            <Input
              placeholder="Search users..."
              variant="filled"
              bgColor={colorMode === "dark" ? "gray.900" : "gray.100"}
              _placeholder={{
                color: colorMode === "dark" ? "gray.400" : "gray.600",
              }}
              size="sm"
              height="10"
              borderRadius="md"
              focusBorderColor={colorMode === "dark" ? "#00DFC0" : "#385A64"}
            />
            <InputRightElement height="100%" display="flex" alignItems="center">
              <Box
                bg={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                borderRadius="md"
                border={`2px solid ${
                  colorMode === "dark" ? "#385A64" : "#00DFC0"
                }`}
                _hover={{
                  bg: colorMode === "dark" ? "#385A64" : "#00DFC0",
                }}
              >
                <IconButton
                  icon={<SearchIcon />}
                  variant="ghost"
                  aria-label="Search"
                  color={colorMode === "dark" ? "#385A64" : "#00DFC0"}
                  size="md"
                  _hover={{
                    color: colorMode === "dark" ? "#00DFC0" : "#385A64",
                  }}
                  onClick={handleSearch}
                />
              </Box>
            </InputRightElement>
          </InputGroup>
        </Box>

        {/* Table */}
        <Box
          width={{ base: "90%", md: "90%" }}
          ml="auto"
          mr="auto"
          mb={8}
          overflowX="auto"
        >
          <Table
            variant="simple"
            size="sm"
            fontSize="md"
            borderRadius="lg"
            borderWidth="1px"
          >
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>User Name</Th>
                <Th>Email</Th>
                <Th>User Type</Th> {/* New column for User Type */}
                <Th>Gender</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(
                (
                  user,
                  index // Add index parameter
                ) => (
                  <Tr key={index + 1}>
                    {" "}
                    {/* Use index + 1 as the key */}
                    <Td whiteSpace="normal" wordWrap="break-word">
                      {index + 1}
                    </Td>{" "}
                    {/* Display sequential numbers starting from 1 */}
                    <Td whiteSpace="normal" wordWrap="break-word">
                      {user.fullName}
                    </Td>
                    <Td whiteSpace="normal" wordWrap="break-word">
                      {user.email}
                    </Td>
                    <Td whiteSpace="normal" wordWrap="break-word">
                      {user.admin ? "Admin" : "User"}
                    </Td>{" "}
                    {/* Show User Type */}
                    <Td whiteSpace="normal" wordWrap="break-word">
                      {user.gender}
                    </Td>
                    <Td>
                      <Link to={`/admin-single-user/${user.userId}`}>
                        {" "}
                        {/* Update to use user.userId */}
                        <IconButton
                          icon={<ViewIcon />}
                          variant="ghost"
                          aria-label="View"
                          color={colorMode === "dark" ? "#00DFC0" : "#385A64"}
                          size="sm"
                          _hover={{ color: "blue.700" }}
                        />
                      </Link>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </Box>

        <AdminFooter />
      </Box>

      <ScrollToTopButton />
    </Box>
  );
};

export default AdminUsers;
