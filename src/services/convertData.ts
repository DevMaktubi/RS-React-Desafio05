import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBr });
};
