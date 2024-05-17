import React from "react";
import {
  Box,
  useMediaQuery,
  useColorMode,
  Divider,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import ScrollToTopButton from "../../components/ScrollUp";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const groupActivitiesByDate = (activities) => {
  const groupedActivities = {};
  activities.forEach((activity) => {
    const date = new Date(activity.timestamp);
    const formattedDate = date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedActivities[formattedDate]) {
      groupedActivities[formattedDate] = [];
    }
    groupedActivities[formattedDate].push(activity);
  });
  return groupedActivities;
};

const AdminHistory = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();

  const dividerWidth = useBreakpointValue({ base: "80%", md: "35%" });

  const underlineAnimation = {
    hidden: { width: 0, x: "50%" },
    visible: { width: "100%", x: 0 },
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  const adminActivities = [
    {
      id: 1,
      activity: "Updated user permissions",
      timestamp: "2024-04-25 10:30:00",
    },
    {
      id: 2,
      activity: "Created new admin account",
      timestamp: "2024-04-24 15:45:00",
    },
    {
      id: 3,
      activity: "Deleted expired user accounts",
      timestamp: "2024-04-23 09:20:00",
    },
    {
      id: 4,
      activity: "Modified site settings",
      timestamp: "2024-04-22 13:10:00",
    },
    {
      id: 5,
      activity: "Resolved user complaints",
      timestamp: "2024-04-21 11:55:00",
    },
    {
      id: 6,
      activity: "Reviewed system logs",
      timestamp: "2024-04-20 14:25:00",
    },
    {
      id: 7,
      activity: "Optimized database performance",
      timestamp: "2024-04-19 17:40:00",
    },
    {
      id: 8,
      activity: "Conducted security audit",
      timestamp: "2024-04-18 09:15:00",
    },
    {
      id: 9,
      activity: "Implemented new feature",
      timestamp: "2024-04-17 16:30:00",
    },
    {
      id: 10,
      activity: "Performed system backup",
      timestamp: "2024-04-16 10:50:00",
    },
  ];

  const groupedActivities = groupActivitiesByDate(adminActivities);

  return (
    <Box>
      {isLargerThan768 && <AdminSidebar />}
      <Box ml={isLargerThan768 ? "17%" : 0}>
        <AdminNavbar />
        <Box p={4}>
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
            Admin Activity History
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

          <Box
            borderRadius="md"
            bg={colorMode === "light" ? "gray.100" : "gray.900"}
            p={4}
            mx="auto"
            maxW="90%"
          >
            {Object.entries(groupedActivities).map(([date, activities]) => (
              <Box key={date} mb={4}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={colorMode === "dark" ? "gray.400" : "gray.600"}
                  mb={2}
                >
                  {date}
                </Text>
                <Divider
                  borderColor={colorMode === "dark" ? "gray.400" : "gray.600"}
                  mb={2}
                />
                <Box
                  ml={4} // Adjust the left margin for the box contents
                >
                  {activities.map((activity) => (
                    <Box key={activity.id} p={2} borderBottomWidth="1px">
                      <Text fontSize="md" fontWeight="semibold">
                        {activity.activity}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={colorMode === "dark" ? "gray.400" : "gray.600"}
                      >
                        {activity.timestamp}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <AdminFooter />
      </Box>

      <ScrollToTopButton />
    </Box>
  );
};

export default AdminHistory;
