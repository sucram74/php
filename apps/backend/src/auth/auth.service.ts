import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.active || user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      access_token: this.jwtService.sign({ sub: user.id, tenant_id: user.tenantId, email: user.email }),
      user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenantId }
    };
  }
}
