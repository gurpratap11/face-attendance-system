import { Router } from "express";
import { controllers } from "../../../controllers";

export const qrCodeQuery = (router: Router) => {
  router.get("/generate-qr", controllers.adminControllers.QR.QrString);
};
