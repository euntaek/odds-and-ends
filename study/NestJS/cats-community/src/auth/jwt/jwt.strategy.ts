import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CatsRepository } from 'src/cats/cats.repository';
import { JWT_SECRET } from 'src/constants';
import { Payload } from './jwt.payload';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly catRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const cat = this.catRepository.findByIdWithoutPassword(payload.sub);
    if (cat) return cat;
    else throw new UnauthorizedException('접근 오류');
  }
}
