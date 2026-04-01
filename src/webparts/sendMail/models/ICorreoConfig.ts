// Modelo que representa un registro de la lista ConfiguracionCorreos
export interface ICorreoConfig {
  Id: number;
  Title: string;
  CorreoOrigen: string;
  Destinatarios: string;
  Asunto: string;
  CuerpoHTML: string;
  Activo: boolean;
}