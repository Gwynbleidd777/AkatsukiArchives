import React from "react";
import {
  Box,
  useMediaQuery,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  StatArrow,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"; // Import Recharts components
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import ScrollToTopButton from "../../components/ScrollUp";

const AdminDashboard = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const backgroundColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />
        <Box p={8}>
          {/* Analytics Content */}
          <Flex
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* Total Users Box */}
            <HoverBox
              width={{ base: "100%", md: "45%", lg: "20%" }}
              mb={4}
              bg={backgroundColor}
              p={4}
              borderRadius="lg"
              height="10%" // Increase the height
              textAlign="center"
            >
              <Stat>
                <StatLabel color={textColor}>Total Users</StatLabel>
                <StatNumber color={textColor}>937</StatNumber>
                {/* Arrow increase symbol with percentage increase */}
                <Text fontSize="sm" color={textColor}>
                  <StatArrow type="increase" />
                  10%
                </Text>
              </Stat>
            </HoverBox>
            {/* Total Items Box */}
            <HoverBox
              width={{ base: "100%", md: "45%", lg: "20%" }}
              mb={4}
              bg={backgroundColor}
              p={4}
              borderRadius="lg"
              height="10%" // Increase the height
              textAlign="center"
            >
              <Stat>
                <StatLabel color={textColor}>Total Items</StatLabel>
                <StatNumber color={textColor}>1049</StatNumber>
                {/* Arrow increase symbol with percentage increase */}
                <Text fontSize="sm" color={textColor}>
                  <StatArrow type="increase" />
                  5%
                </Text>
              </Stat>
            </HoverBox>
            {/* Total Messages Box */}
            <HoverBox
              width={{ base: "100%", md: "45%", lg: "20%" }}
              mb={4}
              bg={backgroundColor}
              p={4}
              borderRadius="lg"
              height="10%" // Increase the height
              textAlign="center"
            >
              <Stat>
                <StatLabel color={textColor}>Total Messages</StatLabel>
                <StatNumber color={textColor}>659</StatNumber>
                {/* Arrow increase symbol with percentage increase */}
                <Text fontSize="sm" color={textColor}>
                  <StatArrow type="increase" />
                  8%
                </Text>
              </Stat>
            </HoverBox>
            {/* Total Activities Box */}
            <HoverBox
              width={{ base: "100%", md: "45%", lg: "20%" }}
              mb={4}
              bg={backgroundColor}
              p={4}
              borderRadius="lg"
              height="10%" // Increase the height
              textAlign="center"
            >
              <Stat>
                <StatLabel color={textColor}>Total Activities</StatLabel>
                <StatNumber color={textColor}>69</StatNumber>
                {/* Arrow increase symbol with percentage increase */}
                <Text fontSize="sm" color={textColor}>
                  <StatArrow type="increase" />
                  12%
                </Text>
              </Stat>
            </HoverBox>
          </Flex>

          <Flex
            flexWrap={{ base: "wrap", md: "nowrap" }}
            justifyContent={{ base: "center", md: "space-between" }}
            mt={6}
            mb={6}
          >
            {/* Bar Chart */}
            <Box width={{ base: "100%", md: "30%" }} mt={{ base: 8, md: 0 }}>
              <Text fontSize="xl" color={textColor} mb={4} textAlign="center">
                Users Registration Over Months in 2024
              </Text>
              <RechartsBarChart />
            </Box>
            {/* Line Chart */}
            <Box width={{ base: "100%", md: "30%" }} mt={{ base: 8, md: 0 }}>
              <Text fontSize="xl" color={textColor} mb={4} textAlign="center">
                Item Postings Over Months in 2024
              </Text>
              <RechartsLineChart />
            </Box>
            {/* Pie Chart */}
            <Box width={{ base: "100%", md: "30%" }} mt={{ base: 8, md: 0 }}>
              <Text fontSize="xl" color={textColor} mb={4} textAlign="center">
                Status of Items
              </Text>
              <RechartsPieChart />
            </Box>
          </Flex>
        </Box>
        <AdminFooter />
        <ScrollToTopButton />
      </Box>
    </Box>
  );
};

const HoverBox = ({ children, ...rest }) => {
  return (
    <Box
      _hover={{
        transform: "scale(1.1)",
        transition: "transform 0.3s ease-in-out",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

const RechartsBarChart = () => {
  const data = [
    { month: "January", users: 57 },
    { month: "February", users: 84 },
    { month: "March", users: 125 },
    { month: "April", users: 231 },
    { month: "May", users: 37 }, // Lesser value for May as it just started
  ];

  return (
    <BarChart width={350} height={300} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Bar dataKey="users" fill="#0088FE" />
    </BarChart>
  );
};

const RechartsLineChart = () => {
  const data = [
    { month: "January", items: 111 },
    { month: "February", items: 132 },
    { month: "March", items: 157 },
    { month: "April", items: 189 },
    { month: "May", items: 49 }, // Lesser value for May as it just started
  ];

  return (
    <LineChart width={350} height={300} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Line type="monotone" dataKey="items" stroke="#FF0000" />
    </LineChart>
  );
};

const RechartsPieChart = () => {
  const data = [
    { name: "Claimed Items", value: 104 },
    { name: "Unclaimed Items", value: 54 },
    { name: "Deleted Items", value: 39 },
    { name: "Unverified Items", value: 23 },
  ];

  const pieColors = ["#66CCFF", "#FF9900", "#FF3333", "#339933"];

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" nameKey="name">
        {data.map((entry, index) => (
          <Cell key={index} fill={pieColors[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        align="center"
        iconSize={10}
        iconType="circle"
        layout="horizontal"
        verticalAlign="bottom"
        payload={data.map((entry, index) => ({
          value: entry.name,
          type: "circle",
          color: pieColors[index],
        }))}
      />
    </PieChart>
  );
};

export default AdminDashboard;
