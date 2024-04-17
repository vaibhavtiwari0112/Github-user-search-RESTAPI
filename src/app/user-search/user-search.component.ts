import { GithubApiService } from '../services/github-api.service';
import { Observable, forkJoin, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {
  @ViewChild(UserCardComponent) userCardComponent!: UserCardComponent;
  @ViewChild('searchForm') searchForm!: ElementRef | null;
  loading: boolean = false;
  userNotFound: boolean = false;
  userData: any;
  userRepos: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private githubApiService: GithubApiService) {}

  moveSearchBarToTop() {
    if (this.searchForm) {
      this.searchForm.nativeElement.classList.add('top-0');
    }
  }

  searchUser(username: string) {
    // Reset data
    this.userData = null;
    this.userRepos = [];
    this.errorMessage = '';
    this.loading = true;
    this.userNotFound = false;

    if (!username.trim()) {
      this.errorMessage = 'Please provide a username.';
      this.loading = false;
      return;
    }

    from(this.githubApiService.getUser(username)).pipe(
      catchError((error) => {
        this.loading = false;
        this.userNotFound = true;
        throw error;
      })
    ).subscribe((user: any) => {
      this.userData = user;
      this.moveSearchBarToTop();
      this.fetchUserRepos(username);
    });
  }

  fetchUserRepos(username: string) {
    this.githubApiService.getUserRepos(username,10).then((repos: any[]) => {
      this.userRepos = repos;
      //console.log('Repositories:', this.userRepos);
      this.githubApiService.setPerPage(this.pageSize); 
      this.fetchLanguagesForRepos(); // Call method to fetch languages
    }).catch((error: any) => {
      console.error('Error fetching user repositories:', error);
    });
  }

  fetchLanguagesForRepos() {
    const observables = this.userRepos.map(repo =>
      from(this.githubApiService.getRepoLanguages(repo.languages_url)).pipe(
        catchError((error) => {
          console.error('Error fetching repo languages:', error);
          throw error;
        })
      )
    );

    forkJoin(observables).subscribe((languages: any[]) => {
      languages.forEach((lang, index) => {
        this.userRepos[index].languages = Object.keys(lang);
      });
      console.log('Repositories with languages:', this.userRepos);
      this.loading = false;
    });
  }
}
