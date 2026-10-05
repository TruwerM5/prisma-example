import { Test, TestingModule } from "@nestjs/testing";
import { GithubProvider } from "./github";

describe("Github", () => {
  let provider: GithubProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubProvider],
    }).compile();

    provider = module.get<GithubProvider>(GithubProvider);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
