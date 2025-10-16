import { Candidato } from "./candidato.model";

export interface Adjunto {
  id: number;
  extension: string;
  nombreArchivo: string;
}

export interface ResponseAdjunto {
  candidato: Candidato;
  adjuntos: Adjunto[];
}
