import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/schema/users.schema";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel:Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { userId } = payload;
    const user = await this.userModel.findById(userId).populate({
      path: 'role',
      select: 'permissions store',
    });
    if (!user)
      throw new ForbiddenException('User not found');
    return user;
  }
}