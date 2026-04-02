import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp/behaviors/spfx";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { ICorreoConfig } from "../models/ICorreoConfig";

export class CorreoService {

  private _sp: SPFI;
  private context: WebPartContext;

constructor(context: WebPartContext) {
  this.context = context; // 🔥 guardar contexto

  this._sp = spfi().using(SPFx(context));
}

  /**
   * Obtiene todas las configuraciones activas
   */
  public async obtenerConfiguraciones(): Promise<ICorreoConfig[]> {

    const items = await this._sp.web.lists
      .getByTitle("ConfiguracionCorreos")
      .items
      .filter("Activo eq 1")();

    if (!items || items.length === 0) {
      throw new Error("No hay configuraciones activas");
    }

    return items as ICorreoConfig[];
  }

  public async guardarHistorial(data: {
  asunto: string;
  plantilla: string;
  destinatarios: string;
  correoOrigen: string;
  cuerpoHTML: string;
}): Promise<void> {

  await this._sp.web.lists
    .getByTitle("HistorialEnvios")
    .items.add({
      Title: data.asunto,
      Plantilla: data.plantilla,
      Destinatarios: data.destinatarios,
      FechaEnvio: new Date(),
      CorreoOrigen: data.correoOrigen,
      CuerpoHTML: data.cuerpoHTML,

      // 🔥 campo persona correcto
      EnviadoPorId: this.context.pageContext.legacyPageContext.userId
    });
}

}