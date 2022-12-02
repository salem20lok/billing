import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthGuard', () => {
  const guard: JwtAuthGuard = new JwtAuthGuard();

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
