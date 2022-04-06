import express from 'express';
import { MBTIService } from './MBTIService';
import {
  Controller,
  Params,
  Body,
  Res,
  Get,
  Post,
  HttpCode,
  Req,
  BodyParam,
} from 'routing-controllers';
import { CreateMatch, GetGroupById } from './MBTIValidator';
import { OpenAPI } from 'routing-controllers-openapi';
import { Group } from '../../entities/Group';

@Controller('/api/mbti')
class MBTIController {
  private service: MBTIService;

  constructor() {
    this.service = MBTIService.getInstance();
  }

  @HttpCode(201)
  @Post()
  @OpenAPI({ description: 'create match' })
  public async post(
    @Req() req: express.Request,
    @BodyParam('name') name: string,
    @Body() body: CreateMatch,
    @Res() res: express.Response,
  ): Promise<express.Response> {
    const group: Group = await this.service.createGroup(body);
    return res.status(201).send({ id: group.id });
  }

  @Get('/:groupId')
  async getOne(
    @Params({ validate: true }) params: GetGroupById,
    @Res() res: express.Response,
  ): Promise<express.Response> {
    const { groupId } = params;
    const { users, matches } = await this.service.getByGroupId(groupId);
    return res.status(200).send({
      users,
      matches,
    });
  }
}

export default MBTIController;
