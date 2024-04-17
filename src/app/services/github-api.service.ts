import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core';


@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private octokit: any;
  private perPage: number = 10; // Default value

  constructor() {
    this.octokit = new Octokit(); // Remove the auth parameter
  }

  async getUser(username: string) {
    try {
      const response = await this.octokit.request('GET /users/{username}', {
        username
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  async getUserRepos(username: string, numberOfRepos: number = 10) {
    try {
      const response = await this.octokit.request('GET /users/{username}/repos', {
        username,
        per_page: numberOfRepos
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching user repositories: ' + error.message);
    }
  }

  setPerPage(value: number): void {
    this.perPage = value; // Update the stored pageSize value
  }

  getPerPage(): number {
    return this.perPage; // Return the stored pageSize value
  }

  async getRepoLanguages(languagesUrl: string) {
    try {
      const response = await this.octokit.request('GET ' + languagesUrl);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching repository languages: ' + error.message);
    }
  }
}
