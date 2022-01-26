import { Component, Inject } from '@angular/core';
import {
  BaseObjectTypeField,
  CoreConfig,
  CoreInit,
  CORE_CONFIG,
  DmsService,
  OidcService,
  OpenIdConfig,
  SearchQuery,
  SearchService,
  UserService,
  YuvUser,
} from '@yuuvis/framework';

/** use whoami service for summer2021 */
const setupCookie = OidcService.prototype.setupCookie;
OidcService.prototype.setupCookie = function (viewer, path, headers) {
  return setupCookie.call(this, viewer, path.replace(/api\/.*/, 'api/users/whoami'), headers);
};

/** allows multi-download */
const downloadContent = DmsService.prototype.downloadContent;
DmsService.prototype.downloadContent = function(objects: {id: string, version?: number}[], withVersion?: boolean) {
  return objects.forEach((o, i) => setTimeout(() => downloadContent.call(this, [o] as any[], withVersion), i * 200));
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  static OIDC = 'app.oidc.config';

  targetHosts: OpenIdConfig[] = [
    {
      host: 'https://kolibri.enaioci.net',
      tenant: 'kolibri',
      issuer: 'https://kc001.auth.enaioci.net/auth/realms/kolibri',
      clientId: 'spa-client',
    },
    {
      host: 'https://eu.yuuvis.io',
      tenant: 'itelligence1',
      issuer: 'https://auth.eu.yuuvis.io/auth/realms/itelligence1',
      clientId: 'it-archive-client'
    },
    {
      host: 'https://eu.yuuvis.io',
      tenant: 'kyoto',
      issuer: 'https://auth.eu.yuuvis.io/auth/realms/kyoto',
      clientId: 'spa-client'
    },
  ];
  user: YuvUser | undefined;
  result: { id: string, title: string; description: string }[] = [];
  selected: { id: string, title: string; description: string } | undefined;

  constructor(
    private userService: UserService,
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
    private coreInit: CoreInit,
    private searchService: SearchService
  ) {
    this.userService.user$.subscribe((u) => (this.user = u));
  }

  login(target: OpenIdConfig) {
    this.coreConfig.oidc = {
      ...target
    };
    localStorage.setItem(AppComponent.OIDC, JSON.stringify(this.coreConfig.oidc));
    this.coreInit.initialize();
  }

  onQuickSearchQuery(query: SearchQuery) {
    this.searchService.search(query).subscribe(
      (res) => {
        console.log(res);
        this.result = res.items.map((i) => ({
          id: i.fields.get(BaseObjectTypeField.OBJECT_ID),
          title: i.fields.get('appClient:clienttitle'),
          description: i.fields.get('appClient:clientdescription'),
        }));
      },
      (err) => {
        console.error('SEARCH FAILED');
      }
    );
  }
  onQuickSearchReset() {
    this.result = [];
  }

  logout(removeOIDC = false) {
    removeOIDC && localStorage.removeItem(AppComponent.OIDC);
    this.userService.logout();
  }
}
