import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/notification/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { EmailService } from 'src/email/email.service';
import { Page } from 'src/page/page.entity';
import { PageRepository } from 'src/page/page.repository';
import { User } from 'src/user/user.entity';
import { UserRespository } from 'src/user/user.repository';
import { InviteToPageDto } from './dto/invite-to-page.dto';
import { parseMemberForOutput } from './serializers/member.serializer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(UserRespository) private userRepository: UserRespository,
    @InjectRepository(PageRepository) private pageRepository: PageRepository,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async addUserToPage(page: Page, inviteToPageDto: InviteToPageDto) {
    const { email } = inviteToPageDto;
    const user = await this.userRepository.getAllUserDataByEmail(email);

    // Don't return an error to FE if user does not exist
    // This could have been abused by a malicious user
    if (user) {
      if (page.owner.id === user.id) {
        throw new BadRequestException(
          `User with the email ${email} is the owner of this page`,
        );
      }

      if (page.members.some((member) => member.id === user.id)) {
        throw new BadRequestException(
          `User with the email ${email} is already a member of this page`,
        );
      }

      await this.pageRepository.addMember(page, user);
      await this.notificationService.createNotification(user, {
        type: NotificationType.ADDED_TO_PAGE,
        title: "You've been added to a page",
        body: `You have been added to the page: ${page.title}`,
        additionalData: { pageId: page.id },
      });

      await this.emailService.sendAddedToPage(
        user.email,
        `${this.configService.get('URL_ORIGIN')}/pages/${page.id}`,
        {
          title: `You've been added to a new page`,
          body: `You have been added to the page: ${page.title}`,
        },
      );
    }

    return page.members.map((member) => parseMemberForOutput(member));
  }

  async removeUserFromPage(page: Page, member: User) {
    if (!page.members.some((pageMember) => pageMember.id === member.id)) {
      throw new BadRequestException(
        `User with the id ${member.id} is not a member of this page`,
      );
    }

    page.members = page.members.filter(
      (pageMember) => pageMember.id !== member.id,
    );

    await this.pageRepository.save(page);
    await this.notificationService.createNotification(member, {
      type: NotificationType.REMOVED_FROM_PAGE,
      title: "You've been removed from a page",
      body: `You have been removed from the page: ${page.title}`,
      additionalData: { pageId: page.id },
    });

    return page.members.map((member) => parseMemberForOutput(member));
  }

  async getPageMembers(page: Page) {
    return {
      members: page.members.map((member) => parseMemberForOutput(member)),
      total: page.members.length,
    };
  }

  async userLeavePage(page: Page, user: User) {
    if (!page.members.some((pM) => pM.id === user.id)) {
      throw new BadRequestException(
        `User with the id ${user.id} is not a member of this page`,
      );
    }

    page.members = page.members.filter((pM) => pM.id !== user.id);
    await this.pageRepository.save(page);
  }
}
