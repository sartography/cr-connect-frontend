import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public apiUrl: string;
  public development: boolean;
  public testing: boolean;
  public mirroring: boolean;
  public production: boolean;
  public dummy: boolean;

  fromProperties(props) {
    for (const propName in props) {
      if (props.hasOwnProperty(propName)) {
        this[propName] = props[propName];
      }
    }
  }
}
