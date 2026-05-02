import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';

@Injectable()
export class ConsumersService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.consumer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  byCpf(cpf: string) {
    return this.prisma.consumer.findUnique({ where: { cpf } });
  }

  private validCpf(value: string) {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /(\d)\1{10}/.test(cpf)) return false;

    const calc = (base: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < base.length; i += 1) total += Number(base[i]) * (factor - i);
      const rest = (total * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    return calc(cpf.slice(0, 9), 10) === Number(cpf[9]) && calc(cpf.slice(0, 10), 11) === Number(cpf[10]);
  }

  private validate(dto: { cpf?: string; name?: string; phone?: string }) {
    if (!dto.name?.trim()) throw new BadRequestException('Nome é obrigatório.');
    if (!dto.phone?.trim()) throw new BadRequestException('Telefone é obrigatório.');
    if (!dto.cpf || !this.validCpf(dto.cpf)) throw new BadRequestException('CPF inválido.');
  }

  create(dto: CreateConsumerDto) {
    this.validate(dto);
    return this.prisma.consumer.create({ data: dto });
  }

  async update(id: string, dto: UpdateConsumerDto) {
    const c = await this.prisma.consumer.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Consumidor não encontrado');

    this.validate({ cpf: c.cpf, name: dto.name ?? c.name, phone: dto.phone ?? c.phone });
    return this.prisma.consumer.update({ where: { id }, data: dto });
  }
}
