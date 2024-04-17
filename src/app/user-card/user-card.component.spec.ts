import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { GithubApiService } from '../services/github-api.service';
import { of } from 'rxjs';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  let mockGithubApiService: jasmine.SpyObj<GithubApiService>;

  beforeEach(waitForAsync(() => {
    mockGithubApiService = jasmine.createSpyObj('GithubApiService', ['getUserRepos', 'getRepoLanguages']);

    TestBed.configureTestingModule({
      declarations: [UserCardComponent],
      providers: [
        { provide: GithubApiService, useValue: mockGithubApiService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.userData = { login: 'testuser', avatar_url: 'https://example.com/avatar.png', bio: 'Test bio' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user repositories on initialization', fakeAsync(() => {
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    mockGithubApiService.getUserRepos.and.returnValue(of(mockRepos));

    component.ngOnInit();
    tick(); // Simulate the passage of time until all pending asynchronous activities complete

    expect(component.loading).toBeFalse();
    expect(component.userRepos).toEqual(mockRepos);
    expect(mockGithubApiService.getUserRepos).toHaveBeenCalledWith('testuser', 10); // Check if the method is called with the correct parameters
  }));

  // Add more test cases as needed for other methods
});
