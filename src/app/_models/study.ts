import {GenericType} from './generic-type';

export interface Study extends GenericType {
  id: number;
  title: string;
  type_id: number;
}
