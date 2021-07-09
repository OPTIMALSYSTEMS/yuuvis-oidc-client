import { Component, Inject } from '@angular/core';
import {
  BaseObjectTypeField,
  CoreConfig,
  CoreInit,
  CORE_CONFIG,
  OpenIdConfig,
  SearchQuery,
  SearchService,
  UserService,
  YuvUser,
} from '@yuuvis/framework';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  targetHosts: OpenIdConfig[] = [
    {
      host: 'https://kolibri.enaioci.net',
      tenant: 'kolibri',
      issuer: 'https://auth.enaioci.net/auth/realms/kolibri',
      clientId: 'spa-client',
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
      ...target,
      postLogoutRedirectUri: window.location.origin,
    };
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

  logout() {
    this.userService.logout();
  }
}
