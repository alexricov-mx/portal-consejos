import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp/behaviors/spfx";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { ICorreoConfig } from "../models/ICorreoConfig";

export class CorreoService {

  private _sp: SPFI;

  constructor(context: WebPartContext) {
    // 🔥 Nueva forma correcta de inicializar PnP
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
}