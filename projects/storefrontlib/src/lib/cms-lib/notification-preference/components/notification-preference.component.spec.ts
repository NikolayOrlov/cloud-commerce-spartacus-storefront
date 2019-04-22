import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import {
  AuthService,
  UserToken,
  PageMetaService,
  PageMeta,
  PageRobotsMeta,
  UserService,
} from '@spartacus/core';
import { NotificationPreferenceComponent } from './notification-preference.component';
import { By } from '@angular/platform-browser';

class MockUserService {
  getNotificationPreferences() {
    return of();
  }
  loadNotificationPreferences(_userId: string) {
    return of();
  }
  updateNotificationPreferences(
    _userId: string,
    _preference: {
      preferences: [
        {
          channel: string;
          enabled: boolean;
        }
      ];
    }
  ) {}
}
class MockAuthService {
  getUserToken(): Observable<UserToken> {
    return of({ userId: 'test' } as UserToken);
  }
}
class MockPageMetaService {
  getMeta(): Observable<PageMeta> {
    return of(<PageMeta>{
      title: 'Test title',
      description: 'Test description',
      robots: [PageRobotsMeta.INDEX, PageRobotsMeta.FOLLOW],
    });
  }
}

describe('NotificationPreferenceComponent', () => {
  let component: NotificationPreferenceComponent;
  let userService: MockUserService;
  let fixture: ComponentFixture<NotificationPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationPreferenceComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: PageMetaService, useClass: MockPageMetaService },
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    }).compileComponents();
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPreferenceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to show page title', () => {
    let title: string;

    component.title$
      .subscribe(value => {
        title = value;
      })
      .unsubscribe();
    let h3: HTMLElement;
    h3 = fixture.nativeElement.querySelector('h3');
    expect(title).toEqual('Test title');
    expect(h3.textContent).toContain(title);
  });

  it('should be able to show notification preferences when data not exist', () => {
    const initialEmptyList: any = {
      preferences: [],
    };
    let notificationPreferences: any;
    let span: HTMLElement;
    spyOn(userService, 'getNotificationPreferences').and.returnValue(
      of(initialEmptyList)
    );
    component.ngOnInit();
    fixture.detectChanges();
    component.notificationPreferenceList$
      .subscribe(value => {
        notificationPreferences = value;
      })
      .unsubscribe();
    span = fixture.nativeElement.querySelector(
      '.cx-notification-preference-span'
    );
    expect(notificationPreferences).toEqual(initialEmptyList);
    expect(span).toBeNull();
  });

  it('should be able to show notification preferences when data exist', () => {
    const initialNotificationpreferences: any = {
      preferences: [
        {
          channel: 'EMAIL',
          enabled: true,
          value: 'test@sap.com',
        },
        {
          channel: 'SMS',
          enabled: false,
          value: '13800000831',
        },
      ],
    };
    let notificationPreferences: any;
    spyOn(userService, 'getNotificationPreferences').and.returnValue(
      of(initialNotificationpreferences)
    );

    component.ngOnInit();
    fixture.detectChanges();
    const spans = fixture.debugElement.queryAll(
      By.css('.cx-notification-preference-span')
    );
    const inputs = fixture.debugElement.queryAll(By.css('.form-toggle-input'));
    component.notificationPreferenceList$
      .subscribe(value => (notificationPreferences = value))
      .unsubscribe();
    expect(notificationPreferences).toEqual(initialNotificationpreferences);
    expect(spans.length).toBe(2);
    expect(spans[0].nativeElement.textContent).toContain('EMAIL: test@sap.com');
    expect(spans[1].nativeElement.textContent).toContain('SMS: 13800000831');
    expect(inputs.length).toBe(2);
    expect(inputs[0].nativeElement.checked).toEqual(true);
    expect(inputs[1].nativeElement.checked).toEqual(false);
  });

  it('should be able to update notification preferences', () => {
    const initialNotificationpreferences = {
      preferences: [
        {
          channel: 'EMAIL',
          enabled: true,
          value: 'test@sap.com',
        },
        {
          channel: 'SMS',
          enabled: false,
          value: '13800000831',
        },
      ],
    };
    let notificationPreferences: any;
    spyOn(userService, 'getNotificationPreferences').and.returnValue(
      of(initialNotificationpreferences)
    );

    spyOn(userService, 'updateNotificationPreferences').and.stub();
    component.ngOnInit();
    fixture.detectChanges();

    const spans = fixture.debugElement.queryAll(
      By.css('.cx-notification-preference-span')
    );
    component.notificationPreferenceList$
      .subscribe(value => (notificationPreferences = value))
      .unsubscribe();
    expect(notificationPreferences).toEqual(initialNotificationpreferences);
    expect(spans.length).toBe(2);

    const labels = fixture.debugElement.queryAll(
      By.css('.form-toggle__switch')
    );
    labels[0].nativeElement.click();
    labels[1].nativeElement.click();

    fixture.detectChanges();
    expect(spans.length).toBe(2);
    expect(spans[0].nativeElement.textContent).toContain('EMAIL: test@sap.com');
    expect(spans[1].nativeElement.textContent).toContain('SMS: 13800000831');
    const inputs = fixture.debugElement.queryAll(By.css('.form-toggle-input'));
    expect(inputs.length).toBe(2);
    expect(inputs[0].nativeElement.checked).toEqual(false);
    expect(inputs[1].nativeElement.checked).toEqual(true);
  });

  it('should be able to update notification preferences by multiple clicking', () => {
    const initialNotificationpreferences = {
      preferences: [
        {
          channel: 'EMAIL',
          enabled: true,
          value: 'test@sap.com',
        },
      ],
    };
    spyOn(userService, 'getNotificationPreferences').and.returnValue(
      of(initialNotificationpreferences)
    );

    spyOn(userService, 'updateNotificationPreferences').and.stub();
    component.ngOnInit();
    fixture.detectChanges();

    const labels = fixture.debugElement.queryAll(
      By.css('.form-toggle__switch')
    );
    const inputs = fixture.debugElement.queryAll(By.css('.form-toggle-input'));
    expect(labels.length).toBe(1);
    expect(inputs.length).toBe(1);

    labels[0].nativeElement.click();
    fixture.detectChanges();
    expect(inputs[0].nativeElement.checked).toEqual(false);
    labels[0].nativeElement.click();
    fixture.detectChanges();
    expect(inputs[0].nativeElement.checked).toEqual(true);
    labels[0].nativeElement.click();
    fixture.detectChanges();
    expect(inputs[0].nativeElement.checked).toEqual(false);
    labels[0].nativeElement.click();
    fixture.detectChanges();
    expect(inputs[0].nativeElement.checked).toEqual(true);
    labels[0].nativeElement.click();
    fixture.detectChanges();
    expect(inputs[0].nativeElement.checked).toEqual(false);
  });
});