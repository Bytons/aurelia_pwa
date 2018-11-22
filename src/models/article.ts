export class RedditArticle {

  constructor(
    public author: string = null,
    public title: string,
    public content: string = null,
    public description,
    public source: {},
    public url: string,
    public urlToImage: string
  ) { }
}
