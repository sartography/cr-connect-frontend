import {Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {FileType, isSignedIn, User} from 'sartography-workflow-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CR Connect';
  user: User;
  isSignedIn = isSignedIn;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const fileTypes = Object.values(FileType);
    fileTypes.forEach(t => {
      const url = this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/file_types/${t}.svg`)
      this.matIconRegistry.addSvgIconInNamespace('crc', t, url);
    })
  }
}
