import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { apiKey } from '../config/app-config';
import { RedditArticle } from '../models/article';

@autoinject
export class NewsFetch {

  constructor(private client: HttpClient) {

    client.configure((config) => {
      config
        .withBaseUrl('https://newsapi.org/v2/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Api-Key': apiKey
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });

  }

  public async getTopHeadlines() {
    const data = await this.client.fetch('top-headlines?sources=reddit-r-all').then((response) => response.json());
    return data.articles;
  }

  public async getRecentArticles(): Promise<RedditArticle[]> {
    const data = await this.client.fetch('everything?sources=reddit-r-all').then((response) => response.json());
    return data.articles;
  }
}
