import { Injectable } from "@nestjs/common";
import { GitHubUserResponse } from "@shop/contracts";

@Injectable()
export class GithubProvider {
  private readonly requestUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
  private readonly accessTokenUrl = "https://github.com/login/oauth/access_token";
  private readonly requestUserUrl = "https://api.github.com/user";

  getRequestUrl() {
    return { requestUrl: this.requestUrl };
  }

  async getProfile(code: string) {
    const access_token = await this.getAccessToken(code);
    const ghUser = await this.getUser(access_token);
    return ghUser;
  }
  private async getAccessToken(code: string): Promise<string> {
    const ghAccessToken: { access_token: string } = await fetch(this.accessTokenUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        code,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        client_id: process.env.GITHUB_CLIENT_ID,
      }),
    }).then((res) => res.json());
    return ghAccessToken.access_token;
  }

  private async getUser(access_token: string) {
    const ghUser: GitHubUserResponse = await fetch(this.requestUserUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "GET",
    }).then((res) => res.json());
    return ghUser;
  }
}
