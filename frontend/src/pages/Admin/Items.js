import React from "react";
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

const AdminItems = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();

  const handleSearch = () => {
    // Handle search functionality here
  };

  // Dummy function to generate unique sets of values
  const generateDummySets = () => {
    const dummyData = [
      {
        id: 1,
        itemName: "Apple Watch",
        category: "Watch",
        itemType: "Lost",
      },
      {
        id: 2,
        itemName: "Laptop",
        category: "Electronics",
        itemType: "Found",
      },
      {
        id: 3,
        itemName: "Wallet",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 4,
        itemName: "Sunglasses",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 5,
        itemName: "Backpack",
        category: "Bags",
        itemType: "Found",
      },
      {
        id: 6,
        itemName: "Mobile Phone",
        category: "Electronics",
        itemType: "Lost",
      },
      {
        id: 7,
        itemName: "Headphones",
        category: "Electronics",
        itemType: "Found",
      },
      {
        id: 8,
        itemName: "Keys",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 9,
        itemName: "Book",
        category: "Books",
        itemType: "Found",
      },
      {
        id: 10,
        itemName: "Umbrella",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 11,
        itemName: "Water Bottle",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 12,
        itemName: "Jacket",
        category: "Clothing",
        itemType: "Found",
      },
      {
        id: 13,
        itemName: "Glasses",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 14,
        itemName: "Notebook",
        category: "Stationery",
        itemType: "Found",
      },
      {
        id: 15,
        itemName: "Charger",
        category: "Electronics",
        itemType: "Lost",
      },
      {
        id: 16,
        itemName: "Watch",
        category: "Accessories",
        itemType: "Found",
      },
      {
        id: 17,
        itemName: "Bag",
        category: "Bags",
        itemType: "Lost",
      },
      {
        id: 18,
        itemName: "Wallet",
        category: "Accessories",
        itemType: "Lost",
      },
      {
        id: 19,
        itemName: "Mobile Phone",
        category: "Electronics",
        itemType: "Found",
      },
      {
        id: 20,
        itemName: "Headphones",
        category: "Electronics",
        itemType: "Lost",
      },
    ];

    return dummyData;
  };

  const dummyData = generateDummySets();

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
        <Box width={{ base: "90%", md: "90%" }} ml="auto" mr="auto" mb={8}>
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
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dummyData.map((data) => (
                <Tr key={data.id}>
                  <Td>{data.id}</Td>
                  <Td>{data.itemName}</Td>
                  <Td>{data.category}</Td>
                  <Td>{data.itemType}</Td>
                  <Td>
                    <Link to="/admin-single-item">
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
