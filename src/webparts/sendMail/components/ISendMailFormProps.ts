import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ICorreoConfig } from "../models/ICorreoConfig";

export interface ISendMailFormProps {
  context: WebPartContext;
  configs: ICorreoConfig[];
}