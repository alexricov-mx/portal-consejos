import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ICorreoConfig } from "../models/ICorreoConfig";
import { CorreoService } from "../services/correoService";

export interface ISendMailFormProps {
  context: WebPartContext;
  configs: ICorreoConfig[];
  correoService: CorreoService; // 🔥 Inyectamos el servicio
}
