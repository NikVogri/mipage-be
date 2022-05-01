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
    // TODO: optional - send email
    return this.memberService.addUserToPage(page, inviteToPageDto);
  }

  @Delete('/:memberId')
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async removeUserFromPage(@GetPage() page: Page, @GetMember() member: User) {
    return await this.memberService.removeUserFromPage(page, member);
  }

  @Delete()
  @Roles('member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async userLeavePage(@GetPage() page: Page, @GetUser() user: User) {
    return await this.memberService.userLeavePage(page, user);
  }

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getPageMembers(@GetPage() page: Page) {
    return await this.memberService.getPageMembers(page);
  }
}
