import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  SimpleGrid,
  Card,
  Group,
  Center,
  Indicator,
  Box,
  Divider,
  createStyles,
} from "@mantine/core";
import { useGetStudentAttendance } from "../../../hooks/student-attendance/query/getAttendance.query";
import { CONSTANTS } from "../../../constant";
import { useParams } from "react-router-dom";
import moment from "moment";
import { totalTime } from "../../../utils/attendance/totalTime";
import ThemeLoader from "../../../component/loader/ThemeLoader";
import ThemePagination from "../../../component/table/pagination/ThemePagination";
import Header from "./Header";

const InfoCard = () => {
  const { classes } = useStyles();
  let { userId } = useParams();
  const [activePage, setActivePage] = useState(1);
  const [pagedData, setPagedData] = useState({
    total: 0,
  });
  const [queryDate, setQueryDate] = useState<Date | null>(null);
  const { refetch, data, isLoading } = useGetStudentAttendance({
    paging: {
      itemPerPage: CONSTANTS.PAGE_LIMIT,
      page: activePage,
    },
    date: queryDate,
    studentId: userId,
  });
  useEffect(() => {
    refetch();
  }, [queryDate, refetch]);

  const attendance: TAttendanceData[] = useMemo(() => {
    if (!isLoading && data) {
      setPagedData(data.pageData);
      return data.data;
    } else {
      return [];
    }
  }, [isLoading, data]);
  if (isLoading) {
    return <ThemeLoader loading={isLoading} />;
  }

  const features = attendance.map((item) => (
    <Card
      key={item.studentID}
      shadow="md"
      radius="md"
      className={
        item.status === "absent"
          ? `${classes.card} ${classes.cardAbsent}`
          : item.status === "on time"
          ? `${classes.card} ${classes.cardOnTime}`
          : `${classes.card} ${classes.cardLate}`
      }
      padding="lg"
    >
      <Group style={{ display: "flex", justifyContent: "space-between" }}>
        <Text fz="sm" fw={500} color="#667085">
          {moment(item.createdAt).format("ddd, MMM DD, YYYY ")}
        </Text>
        <Box
          className={
            item.status === "absent"
              ? `${classes.statusBox} ${classes.statusBoxAbsent}`
              : item.status === "on time"
              ? `${classes.statusBox} ${classes.statusBoxOnTime}`
              : `${classes.statusBox} ${classes.statusBoxLate}`
          }
        >
          <Center>
            <Indicator
              inline
              size={8}
              position="middle-start"
              {...(item.status === "absent"
                ? { color: "#FF0000" }
                : item.status === "on time"
                ? { color: "#53b1fd" }
                : { color: "#f79009" })}
            >
              <Text ml={10} size="xs" weight={500}>
                {item.status}
              </Text>
            </Indicator>
          </Center>
        </Box>
      </Group>
      <Divider my="sm" />
      <Group
        spacing="xl"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Text c="dimmed" weight={500} size="xs">
            Check In
          </Text>
          <Text fz="sm" weight={500}>
            {item.inTime ? moment(item.inTime).format("LT") : "---"}
          </Text>
        </Box>
        <Box>
          <Text c="dimmed" weight={500} size="xs">
            Check Out
          </Text>
          <Text fz="sm" weight={500}>
            {item.outTime ? moment(item.outTime).format("LT") : "---"}
          </Text>
        </Box>
        <Box>
          <Text c="dimmed" weight={500} size="xs">
            Total
          </Text>
          <Text fz="sm" weight={500}>
            {item.outTime ? totalTime(item.inTime, item.outTime) : "---"}
          </Text>
        </Box>
      </Group>
      <Divider my="sm" />
      <Group style={{ display: "flex", justifyContent: "space-between" }}>
        <Text fz="sm" fw={400} c="dimmed">
          Notes:
        </Text>

        <Text ml={10} size="xs" weight={500}>
          {item?.notes}
        </Text>
      </Group>
    </Card>
  ));
  return (
    <>
      <Header
        extraData={data?.extraData}
        queryDate={queryDate}
        setQueryDate={setQueryDate}
      />
      <SimpleGrid cols={3} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
      <ThemePagination setPage={setActivePage} totalPages={pagedData.total} />
    </>
  );
};
const useStyles = createStyles((theme) => ({
  card: {
    borderStyle: "solid",
    borderWidth: 0,
    borderLeftWidth: "4px",
    borderRadius: 0,
  },
  cardOnTime: {
    borderColor: "#53b1fd",
  },
  cardLate: {
    borderColor: "#f79009",
  },
  cardAbsent: {
    borderColor: "#FF0000",
    color: "#868e96",
  },
  statusBox: {
    paddingBlock: "0.3rem",
    paddingInline: "0.7rem",
    borderRadius: "0.4rem",
  },
  statusBoxOnTime: {
    backgroundColor: "#eff8ff",
    color: "#53b1fd",
  },
  statusBoxLate: {
    backgroundColor: "#fffaeb",
    color: "#f79009",
  },
  statusBoxAbsent: {
    backgroundColor: "#FFE5E5 ",
    color: "#FF0000",
  },
  absentDimmed: {
    visibility: "hidden",
  },
}));
export default InfoCard;
