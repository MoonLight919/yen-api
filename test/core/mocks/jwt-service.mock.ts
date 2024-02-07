import { JwtService } from '@resources/auth/services';

export class MockJwtService extends JwtService {
  public async verifyAuth0(): Promise<boolean> {
    return true;
  }
}
