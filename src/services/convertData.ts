import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt';

export const convertData = (date: Date): string => {
  return format(date, `dd MMM yyyy`, { locale: ptBr });
};
