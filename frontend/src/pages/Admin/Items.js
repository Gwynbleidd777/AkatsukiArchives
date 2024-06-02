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

const AdminItems = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Backend response:", response.data); // Log backend response
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
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
              placeholder="Search items..."
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
                <Th>Item Name</Th>
                <Th>Category</Th>
                <Th>Item Type</Th>
                <Th>Location</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr key={index + 1}>
                  <Td whiteSpace="normal" wordWrap="break-word">
                    {index + 1}
                  </Td>
                  <Td whiteSpace="normal" wordWrap="break-word">
                    {item.itemName}
                  </Td>
                  <Td whiteSpace="normal" wordWrap="break-word">
                    {item.category}
                  </Td>
                  <Td whiteSpace="normal" wordWrap="break-word">
                    {item.itemType}
                  </Td>
                  <Td whiteSpace="normal" wordWrap="break-word">
                    {item.location}
                  </Td>
                  <Td>
                    <Link to={`/admin-single-item/${item._id}`}>
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
              ))}
            </Tbody>
          </Table>
        </Box>

        <AdminFooter />
      </Box>

      <ScrollToTopButton />
    </Box>
  );
};

export default AdminItems;
