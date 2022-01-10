import {Component, Inject} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AppEnvironment, FileType, GoogleAnalyticsService} from 'sartography-workflow-lib';
import {LocationStrategy} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private googleAnalyticsService: GoogleAnalyticsService,
    private router: Router,
    private location: LocationStrategy,
  ) {
    // const navEnd = this.router.events.pipe(filter(e => e instanceof NavigationEnd));
    // navEnd.subscribe(_ => this.googleAnalyticsService.init(this.environment.googleAnalyticsKey));

    this.disableBack();
    const fileTypes = Object.values(FileType);
    fileTypes.forEach(t => {
      const url = this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/file_types/${t}.svg`)
      this.matIconRegistry.addSvgIconInNamespace('crc', t, url);
    });
    this.titleService.setTitle(this.environment.title);
  }

  reload() {
    this.loading = true;
    setTimeout(() => this.loading = false, 300);
  }

  disableBack() {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      alert('Please use the in-application navigation.');
      history.pushState(null, null, window.location.href);
    })
  }
}
