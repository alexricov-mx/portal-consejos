import * as React from "react";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { ISendMailFormProps } from "./ISendMailFormProps";
import { TextField, PrimaryButton, Stack, Dropdown, IDropdownOption } from "@fluentui/react";

/**
 * Componente principal para editar y enviar correo
 */
export const SendMailForm: React.FC<ISendMailFormProps> = ({ context, configs }) => {

  // 🔥 Estado: configuración seleccionada
  const [selectedConfig, setSelectedConfig] = React.useState(configs[0]);

  // 🔥 Estados del formulario
  const [subject, setSubject] = React.useState(selectedConfig.Asunto);
  const [body, setBody] = React.useState(selectedConfig.CuerpoHTML);
  const [to, setTo] = React.useState(selectedConfig.Destinatarios);

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
      .replace("{{FECHA}}", new Date().toLocaleDateString())
      .replace("{{LUGAR}}", "Sala A");
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

      alert("Correo enviado correctamente 🚀");

    } catch (error) {
      console.error(error);
      alert("Error al enviar correo");
    }
  };

  return (
    <Stack tokens={{ childrenGap: 15 }}>

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

      <PrimaryButton
        text="Enviar correo"
        onClick={sendMail}
      />

    </Stack>
  );
};