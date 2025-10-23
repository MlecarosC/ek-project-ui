import { Candidato } from './candidato.model';
import { Adjunto } from './adjunto.model';

export interface CandidatoView extends Candidato {
  avatarUrl: string;
  adjuntos: Adjunto[];
}

export interface ResponseCandidato {
  candidato: Candidato;
  adjuntos: Adjunto[];
}
