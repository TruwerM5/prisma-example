import { Injectable } from "@nestjs/common";
import { OAuthService } from "../oauth.service";
import { SignInWithOAuthParameters } from "types";
import { YandexUserResponse } from "@shop/contracts";

@Injectable()
export class YandexOAuth {
  private readonly requestUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.YANDEX_CLIENT_ID}`;
  private readonly accessTokenUrl = "https://oauth.yandex.ru/token";
  private readonly requestUserUrl = "https://login.yandex.ru/info?format=json";
  private readonly codeChallengeMethod = "S256";

  constructor(private readonly oauthService: OAuthService) {}

  getRequestUrl() {
    const { state, codeChallenge } = this.oauthService.generateStateAndCodeChallenge();
    const stateQuery = `&state=${state}`;
    const codeChallengeQuery = `&code_challenge=${codeChallenge}`;
    const codeChallengeMethodQuery = `&code_challenge_method=${this.codeChallengeMethod}`;
    const resultUrl = `${this.requestUrl}${stateQuery}${codeChallengeQuery}${codeChallengeMethodQuery}`;
    return {
      requestUrl: resultUrl,
    };
  }

  async getProfile(parameters: SignInWithOAuthParameters) {
    const access_token = await this.getAccessToken(parameters);
    const ghUser = await this.getUser(access_token);
    return ghUser;
  }

  private async getAccessToken(parameters: SignInWithOAuthParameters): Promise<string> {
    const client_id = process.env.YANDEX_CLIENT_ID;
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: parameters.code,
      client_id: client_id || "",
      code_verifier: parameters.state,
    });
    const yandexAccessToken: { access_token: string } = await fetch(this.accessTokenUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body,
    }).then((res) => res.json());
    return yandexAccessToken.access_token;
  }

  private async getUser(access_token: string): Promise<YandexUserResponse> {
    const yandexUser: YandexUserResponse = await fetch(this.requestUserUrl, {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
      method: "GET",
    }).then((res) => res.json());
    return yandexUser;
  }
}
