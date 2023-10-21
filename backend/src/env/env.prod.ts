class EnvProd implements EnvironmentVariable {
  baseUrl: string = "localhost";
  resetLinkBaseUrl: string =
    "https://ms-student-attander-admin.dev.mshosting.in/";

  mondoDbUrl: string =
    "mongodb+srv://msAttendance:ELqqgwRapzUIqfvM@ms-attendance.rvbvpih.mongodb.net/prod";
  jwtSecret: string =
    "$2a$10$YKnL4ZCPUsddsf2iJpnmNdtWxtO1YWw8AWg48ESn2zx.DLOZ3pV62soZdS";
  headerKey: string = "authorization";
  senderEmail: string = "kakarott.priyanshu@gmail.com";
  senderPassword: string = "idvbistwzqmcugih";
}

export default new EnvProd();
