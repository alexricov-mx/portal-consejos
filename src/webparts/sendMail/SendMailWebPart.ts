import * as React from "react";
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import { SendMailForm } from "./components/SendMailForm";
import { CorreoService } from "./services/correoService";
import { ICorreoConfig } from "./models/ICorreoConfig";

export interface ISendMailWebPartState {
  config?: ICorreoConfig;
}

export default class SendMailWebPart extends BaseClientSideWebPart<{}> {

  private correoService: CorreoService;

  protected async onInit(): Promise<void> {
    this.correoService = new CorreoService(this.context);
  }

  public async render(): Promise<void> {

    try {
      const configs = await this.correoService.obtenerConfiguraciones();

      const element = React.createElement(SendMailForm, {
        context: this.context,
        configs: configs,
        correoService: this.correoService // 🔥 ESTE ES EL CAMBIO
      });

      ReactDom.render(element, this.domElement);

    } catch (error) {
      this.domElement.innerHTML = `<div style="color:red;">Error: ${error.message}</div>`;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}