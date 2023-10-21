import { Request, Response } from "express";
import { dao } from "../../../dao";
import { JsonResponse } from "../../../utils/jsonResponse";
import { SendMail } from "../../../services/mail.service";

export const addStudent = async (req: Request, res: Response) => {
  try {
    const { email, name, mobile, password } = req.body;
    const rollNumber = await dao.student.addRollNo(name);

    const data = await dao.student.getProfileByEmail(email).exec();
    if (data) {
      return JsonResponse(res, {
        status: "error",
        statusCode: 400,
        message: "student already exists",
        title: "Data not inserted",
      });
    }
    const inserted = await dao.student.addStudent({
      email,
      name,
      mobile,
      rollNumber,
      password,
    });

    if (!inserted) {
      return JsonResponse(res, {
        status: "error",
        statusCode: 400,
        message: "student not added",
        title: "Data not inserted",
        data: {},
      });
    } else {
      const sendEmail = {
        to: email,
        subject: "Login credentials",
        html: `<h3>Login credentials</h3><p>Hii ${name} this is your login credentials</p><p><b>User Name: ${rollNumber}</b></p> <p><b>Password: ${password}</b></p>`,
      };
      SendMail(sendEmail);
      if (!SendMail) {
        return JsonResponse(res, {
          status: "error",
          statusCode: 400,
          message: "Login credentials not send",
          title: "Login credentials not sent successfully",
        });
      } else {
        return JsonResponse(res, {
          status: "success",
          statusCode: 200,
          message: "student added and Login credentials sent successfully",
          title: "Data inserted and Login credentials sent successfully",
        });
      }
    }
  } catch (error: any) {
    return JsonResponse(res, {
      status: "error",
      statusCode: 500,
      message: error.message,
      title: "Something went wrong",
    });
  }
};
