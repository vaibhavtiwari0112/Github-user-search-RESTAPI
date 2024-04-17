import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { UserSearchComponent } from './user-search.component';
import { GithubApiService } from '../services/github-api.service';
import { of } from 'rxjs';

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
  let mockGithubApiService: jasmine.SpyObj<GithubApiService>;

  beforeEach(waitForAsync(() => {
    mockGithubApiService = jasmine.createSpyObj('GithubApiService', ['getUser', 'getUserRepos', 'getRepoLanguages']);

    TestBed.configureTestingModule({
      declarations: [UserSearchComponent],
      providers: [
        { provide: GithubApiService, useValue: mockGithubApiService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data when searching for a user', () => {
    const mockUserData = {
      id: 1,
      login: 'testuser',
      avatar_url: 'https://example.com/avatar.png',
      bio: 'Test bio'
    };

    mockGithubApiService.getUser.and.returnValue(of(mockUserData));

    component.searchUser('testuser');

    expect(component.userData).toEqual(mockUserData);
    expect(mockGithubApiService.getUser).toHaveBeenCalledWith('testuser');
  });

  // Add more test cases as needed for other methods
});
