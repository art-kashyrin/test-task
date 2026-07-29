import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { env } from '../config/env'
import type { AuthUser } from '../types/express'

interface JwtPayload {
  sub: number
  name: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    })
  }

  validate(payload: JwtPayload): Promise<AuthUser> {
    return Promise.resolve({ id: payload.sub, name: payload.name })
  }
}
