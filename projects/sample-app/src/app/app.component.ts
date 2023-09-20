import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  EmojiPickerContext,
  CustomTemplatesService,
  ThemeService,
  AvatarContext,
} from 'stream-chat-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  isMenuOpen = false;
  isThreadOpen = false;
  @ViewChild('emojiPickerTemplate')
  emojiPickerTemplate!: TemplateRef<EmojiPickerContext>;
  @ViewChild('avatar') avatarTemplate!: TemplateRef<AvatarContext>;
  themeVersion: '1' | '2';
  theme$: Observable<string>;
  counter = 0;

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private customTemplateService: CustomTemplatesService,
    themeService: ThemeService
  ) {
    void this.chatService.init(
      environment.apiKey,
      environment.userId,
      environment.userToken
    );
    void this.channelService.init({
      type: 'messaging',
      members: { $in: [environment.userId] },
      // id: { $eq: '1af49475-b988-479e-9444-2a10aab707f0' },
    });
    this.streamI18nService.setTranslation();
    this.channelService.activeParentMessage$
      .pipe(map((m) => !!m))
      .subscribe((isThreadOpen) => (this.isThreadOpen = isThreadOpen));
    this.themeVersion = themeService.themeVersion;
    this.theme$ = themeService.theme$;

    // setInterval(() => this.counter++, 1000);
  }

  ngAfterViewInit(): void {
    this.customTemplateService.emojiPickerTemplate$.next(
      this.emojiPickerTemplate
    );
    // this.customTemplateService.avatarTemplate$.next(this.avatarTemplate);
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
