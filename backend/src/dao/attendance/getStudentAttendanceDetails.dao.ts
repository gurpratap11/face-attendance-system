import { PipelineStage } from "mongoose";
import { paginated } from "../../middleware/paginate/paginated.middleware";
import { models } from "../../models";
import { ObjectId } from "mongodb";
import moment from "moment";

interface IGetRequestParams {
  studentId: string;
}

const aggregationArray = (params: IGetRequestParams): PipelineStage[] => {
  const aggregate: PipelineStage[] = [];
  const { studentId } = params;

  const currentDate = moment();
  const startOfMonth = currentDate.startOf("month").toDate();
  const endOfMonth = currentDate.endOf("month").toDate();

  aggregate.push({
    $match: {
      studentID: new ObjectId(studentId),
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    },
  });

  aggregate.push({
    $group: {
      _id: "$studentID",
      totalAttendance: {
        $sum: 1,
      },
      onTimeCount: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "on time"],
            },
            1,
            0,
          ],
        },
      },
      absentCount: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "absent"],
            },
            1,
            0,
          ],
        },
      },
      lateCount: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "late"],
            },
            1,
            0,
          ],
        },
      },
    },
  });
  aggregate.push(
    {
      $lookup: {
        from: "student-users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: {
        path: "$student",
        preserveNullAndEmptyArrays: true,
      },
    }
  );
  aggregate.push({
    $unwind: {
      path: "$student",
      preserveNullAndEmptyArrays: true,
    },
  });
  aggregate.push({
    $project: {
      totalAttendance: 1,
      onTimeCount: 1,
      absentCount: 1,
      lateCount: 1,
      name: "$student.name",
      email: "$student.email",
    },
  });

  return aggregate;
};

export const getStudentAttendanceDetails = async (
  params: IGetRequestParams
) => {
  const data = await models.AttendanceSheet.aggregate(aggregationArray(params));

  const attendanceData = data.length > 0 ? data[0] : {};
  let { totalAttendance, onTimeCount, absentCount, lateCount, name, email } =
    attendanceData;

  const percentageOnTime = (onTimeCount / totalAttendance) * 100;
  const percentageAbsent = (absentCount / totalAttendance) * 100;
  const percentageLate = (lateCount / totalAttendance) * 100;
  totalAttendance = onTimeCount + lateCount;
  return {
    totalAttendance,
    percentageOnTime,
    percentageAbsent,
    percentageLate,
    name,
    email,
  };
};
