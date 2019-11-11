import {GenericType} from './generic_type';

export interface Study extends GenericType {
  id: number;
  title: string;
  type_id: number;
}
