import { Controller, Body, Post, UseGuards, Delete, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetPage } from 'src/page/get-page.decorator';
import { PageRolesGuard } from 'src/page/guards/page-roles.guard';
import { Page } from 'src/page/page.entity';
import { Roles } from 'src/page/roles.decorator';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { InviteToPageDto } from './dto/invite-to-page.dto';
import { GetMember } from './get-member.decorator';
import { MemberService } from './member.service';
import { parseMemberForOutput } from './serializers/member.serializer';

@Controller({ path: '/pages/:pageId/members' })
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post()
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async addUserToPage(
    @GetPage() page: Page,
    @Body() inviteToPageDto: InviteToPageDto,
  ) {
    const responseMembers = await this.memberService.addUserToPage(
      page,
      inviteToPageDto,
    );

    return responseMembers.map(parseMemberForOutput);
  }

  @Delete('/:memberId')
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async removeUserFromPage(@GetPage() page: Page, @GetMember() member: User) {
    const responseMembers = await this.memberService.removeUserFromPage(
      page,
      member,
    );

    return responseMembers.map(parseMemberForOutput);
  }

  @Delete()
  @Roles('member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async userLeavePage(@GetPage() page: Page, @GetUser() user: User) {
    return await this.memberService.userLeavePage(page, user);
  }
}
