export class Preferences {

  constructor(public showAdminTools: boolean) {}

  static default() {
    return new Preferences(false);
  }
}
