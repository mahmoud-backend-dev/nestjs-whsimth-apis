import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => context.switchToHttp().getRequest<Request>().user
)