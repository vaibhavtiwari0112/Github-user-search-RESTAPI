import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GithubApiService } from './github-api.service';

describe('GithubApiService', () => {
  let service: GithubApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubApiService]
    });
    service = TestBed.inject(GithubApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data from GitHub API', () => {
    const mockUserData = {
      id: 1,
      login: 'testuser',
      avatar_url: 'https://example.com/avatar.png',
      bio: 'Test bio'
    };

    service.getUser('testuser').subscribe((userData) => {
      expect(userData).toEqual(mockUserData);
    });

    const req = httpTestingController.expectOne('https://api.github.com/users/testuser');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUserData);
  });

});
