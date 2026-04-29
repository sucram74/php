import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  issueToken(userId: string, tenantId: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId, tenant_id: tenantId })
    };
  }
}
