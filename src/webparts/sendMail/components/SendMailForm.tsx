import * as React from "react";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { ISendMailFormProps } from "./ISendMailFormProps";
import { TextField, PrimaryButton, Stack, Dropdown, IDropdownOption } from "@fluentui/react";

/**
 * Componente principal para editar y enviar correo
 */
export const SendMailForm: React.FC<ISendMailFormProps> = ({ context, configs, correoService }) => {
  
  // 🔥 Estado: configuración seleccionada
  const [selectedConfig, setSelectedConfig] = React.useState(configs[0]);

  // 🔥 Estados del formulario
  const [subject, setSubject] = React.useState(selectedConfig.Asunto);
  const [body, setBody] = React.useState(selectedConfig.CuerpoHTML);
  const [to, setTo] = React.useState(selectedConfig.Destinatarios);

  const [fecha, setFecha] = React.useState("");
  const [lugar, setLugar] = React.useState("");

  /**
   * 🔽 OPCIONES DEL DROPDOWN (esto te faltaba)
   */
  const options: IDropdownOption[] = configs.map(c => ({
    key: c.Id,
    text: c.Title
  }));

  /**
   * 🔁 Cuando cambias de plantilla
   */
  const onChangeConfig = (event: any, option?: IDropdownOption) => {
    const config = configs.find(c => c.Id === option?.key);

    if (!config) return;

    setSelectedConfig(config);

    // 🔥 Actualiza formulario
    setSubject(config.Asunto);
    setBody(config.CuerpoHTML);
    setTo(config.Destinatarios);
  };

  /**
   * Reemplaza variables dinámicas en el HTML
   */
  const procesarTemplate = (html: string): string => {
    return html
      .replace("{{FECHA}}", fecha || "________")
      .replace("{{LUGAR}}", lugar || "________");
  };

  const validarCorreos = (lista: string): boolean => {
    const emails = lista.split(";");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emails.every(e => regex.test(e.trim()));
  };

  /**
   * Envía el correo usando Microsoft Graph
   */
  const sendMail = async () => {
    try {
      const client = await context.msGraphClientFactory.getClient("3");

      await client
        // 🔥 CORRECCIÓN: usar selectedConfig
        .api(`/users/${selectedConfig.CorreoOrigen}/sendMail`)
        .post({
          message: {
            subject: subject,
            body: {
              contentType: "HTML",
              content: procesarTemplate(body)
            },
            toRecipients: to.split(";").map(email => ({
              emailAddress: { address: email.trim() }
            }))
          }
        });

      if (!validarCorreos(to)) {
        alert("Hay correos inválidos");
        return;
      }

      alert("Correo enviado correctamente 🚀");

      await correoService.guardarHistorial({
        asunto: subject,
        plantilla: selectedConfig.Title,
        destinatarios: to,
        correoOrigen: selectedConfig.CorreoOrigen,
        cuerpoHTML: body
      });


    } catch (error) {
      console.error(error);
      alert("Error al enviar correo");
    }
  };

  return (
    <Stack tokens={{ childrenGap: 15 }}>

      <TextField
        label="Fecha"
        value={fecha}
        onChange={(_, v) => setFecha(v || "")}
      />

      <TextField
        label="Lugar"
        value={lugar}
        onChange={(_, v) => setLugar(v || "")}
      />

      {/* 🔽 DROPDOWN DE PLANTILLAS */}
      <Dropdown
        label="Plantilla de correo"
        options={options}
        selectedKey={selectedConfig.Id}
        onChange={onChangeConfig}
      />

      <TextField
        label="Destinatarios (separados por ;)"
        value={to}
        onChange={(_, v) => setTo(v || "")}
      />

      <TextField
        label="Asunto"
        value={subject}
        onChange={(_, v) => setSubject(v || "")}
      />

      <RichText
        value={body}
        onChange={(text: string) => {
          setBody(text);
          return text;
        }}
      />

      {/* 👀 PREVIEW DEL CORREO */}
      <div>
        <h3>Vista previa</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 15,
            backgroundColor: "#fff",
            maxHeight: "400px",
            overflow: "auto"
          }}
          dangerouslySetInnerHTML={{ __html: procesarTemplate(body) }}
        />
      </div>

      <PrimaryButton
        text="Enviar correo"
        onClick={sendMail}
      />

    </Stack>
  );
};