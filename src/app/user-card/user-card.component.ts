import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { GithubApiService } from '../services/github-api.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() userData: any;
  @Input() userRepos: any[] = [];
  @Input() pageSize: number = 10;
  pageSizes: number[] = [10, 20, 50, 100];
  repoCounts: number[] = [10, 20, 50, 100];
  repoCount: number = 10; // Change this line
  languageColors: { [key: string]: string } = {
    "JavaScript": "linear-gradient(to right, #D97706, #B45309)",
    "TypeScript": "linear-gradient(to right, #2563EB, #0B4F6C)",
    "HTML": "linear-gradient(to right, #C1282D, #8A1F3C)",
    "CSS": "linear-gradient(to right, #2965F1, #0F2A3F)",
    "Python": "linear-gradient(to right, #357C39, #205C3B)",
    "Java": "linear-gradient(to right, #B07219, #5A2D0C)",
    "Ruby": "linear-gradient(to right, #D51F22, #93000A)",
    "C#": "linear-gradient(to right, #68217A, #2E0854)",
    "C++": "linear-gradient(to right, #004482, #001E3C)",
    "Default": "linear-gradient(to right, #475569, #1F2937)" 
  };

  displayedRepos: any[] = [];
  gradientColors: string[] = Object.values(this.languageColors);
  loading: boolean = false;
  currentPage: number = 1;

  constructor(private githubApiService: GithubApiService) {}

  ngOnInit() {
    this.loadUserRepos(this.userData.login);
  }

  ngAfterViewInit() {
    this.updateDisplayedRepos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageSize'] || changes['repoCount']) {
    //  console.log('PageSize or repoCount changed:', this.pageSize, this.repoCount); 
      this.loadUserRepos(this.userData.login);
      this.currentPage = 1;
    }
  }

  changeRepoCounts(): void {
   // console.log('New repo count:', this.repoCount);
    const newTotalPages = Math.ceil(this.userRepos.length / this.repoCount);
    if (this.currentPage > newTotalPages) {
      this.currentPage = newTotalPages;
    }
    const prevRepoCount = this.displayedRepos.length;
    this.updateDisplayedRepos();
    if (prevRepoCount > this.displayedRepos.length && this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedRepos();
    }
  }
  

  changePageSize(): void {
    // console.log('New page size:', this.pageSize); 
    this.loadUserRepos(this.userData.login);
    this.currentPage=1;
  }
  

  get totalPages(): number {
    return Math.ceil(this.userRepos.length / this.repoCount);
  }

 

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedRepos();
    }
  }

  getRandomColor(language: string): string {
    if (this.languageColors.hasOwnProperty(language)) {
      return this.languageColors[language];
    } else {
      return this.languageColors["Default"];
    }
  }

  async loadUserRepos(username: string): Promise<void> {
    this.loading = true;
    try {
      const repos = await this.githubApiService.getUserRepos(username, this.pageSize); 
      const reposWithLanguages = await this.fetchLanguagesForRepos(repos);
      this.userRepos = reposWithLanguages;
      this.updateDisplayedRepos();
      console.log("userRepos of user-card component", this.userRepos.length);
    } catch (error: any) {
      console.error('Error fetching user repositories:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchLanguagesForRepos(repos: any[]): Promise<any[]> {
    const observables = repos.map(repo =>
      this.githubApiService.getRepoLanguages(repo.languages_url)
        .then(languages => ({ ...repo, languages: Object.keys(languages) }))
        .catch(error => {
          console.error('Error fetching repo languages:', error);
          return { ...repo, languages: [] };
        })
    );

    return Promise.all(observables);
  }


  
  updateDisplayedRepos(): void {
    const startIndex = (this.currentPage - 1) * this.repoCount;
    let endIndex = startIndex + this.repoCount;
    if (endIndex > this.userRepos.length) {
      endIndex = this.userRepos.length;
    }
  
    // console.log("Start index:", startIndex);
    // console.log("End index:", endIndex);  
    // console.log("Previous displayedRepos of user-card component", this.displayedRepos.length);
    this.displayedRepos = [];
    for (let i = startIndex; i < endIndex; i++) {
      this.displayedRepos.push(this.userRepos[i]);
    }
    // console.log("New displayedRepos of user-card component", this.displayedRepos.length);
  }
  


  async nextPage(): Promise<void> {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedRepos();
    }
  }

  async prevPage(): Promise<void> {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedRepos();
    }
  } 
}
