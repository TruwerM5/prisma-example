import { Injectable } from "@nestjs/common";
import { GitHubUserResponse } from "@shop/contracts";
import { SignInWithOAuthParameters } from "types";
import { OAuthService } from "../oauth.service";
import { HttpClient } from "@nestjs/http-client";
@Injectable()
export class GithubOAuth {
  private readonly requestUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
  private readonly accessTokenUrl = "https://github.com/login/oauth/access_token";
  private readonly requestUserUrl = "https://api.github.com/user";
  readonly codeChallengeMethod = "S256";
  constructor(
    private readonly oauthService: OAuthService,
    private readonly http: HttpClient,
  ) {}
  getRequestUrl() {
    const { state, codeChallenge } = this.oauthService.generateStateAndCodeChallenge();
    const stateQuery = `&state=${state}`;
    const codeChallengeQuery = `&code_challenge=${codeChallenge}`;
    const codeChallengeMethodQuery = `&code_challenge_method=${this.codeChallengeMethod}`;
    const resultUrl = `${this.requestUrl}${stateQuery}${codeChallengeQuery}${codeChallengeMethodQuery}`;
    return {
      requestUrl: resultUrl,
      state,
    };
  }

  async getProfile(parameters: SignInWithOAuthParameters) {
    const access_token = await this.getAccessToken(parameters);
    const ghUser = await this.getUser(access_token);
    return ghUser;
  }

  private async getAccessToken(parameters: SignInWithOAuthParameters): Promise<string> {
    const { data } = await this.http.post<{ access_token: string }>(this.accessTokenUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code: parameters.code,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        client_id: process.env.GITHUB_CLIENT_ID,
        code_verifier: parameters.state,
      }),
    });
    return data.access_token;
  }

  private async getUser(access_token: string) {
    const { data } = await this.http.get<GitHubUserResponse>(this.requestUserUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  }
}
