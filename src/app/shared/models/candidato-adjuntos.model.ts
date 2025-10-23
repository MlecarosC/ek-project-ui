import { Adjunto } from "./adjunto.model";
import { Candidato } from "./candidato.model";


export interface CandidatoConAdjuntos extends Candidato {
  adjuntos: Adjunto[];
}