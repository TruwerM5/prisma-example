import { Test, TestingModule } from "@nestjs/testing";
import { GithubOAuth } from "./github.oauth";

describe("Github", () => {
  let provider: GithubOAuth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubOAuth],
    }).compile();

    provider = module.get<GithubOAuth>(GithubOAuth);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
