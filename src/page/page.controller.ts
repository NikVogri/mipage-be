import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { PageService } from './page.service';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetUser } from 'src/user/get-user.decorator';
import { PageRolesGuard } from './guards/page-roles.guard';
import { GetPage } from './get-page.decorator';
import { Page } from './page.entity';
import { Roles } from './roles.decorator';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private pageService: PageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPage(
    @Body() createPageDto: CreatePageDto,
    @GetUser() user: User,
  ) {
    return await this.pageService.createPage(createPageDto, user);
  }

  @Delete('/:pageId')
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async deletePage(@GetPage() page: Page) {
    return this.pageService.deletePage(page);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUserPages(@GetUser() user: User) {
    return this.pageService.getAllUserPages(user);
  }

  @Get('/minimal')
  @UseGuards(JwtAuthGuard)
  async getAllUserPagesForSidebar(@GetUser() user: User) {
    return this.pageService.getAllUserPagesForSidebar(user);
  }

  @Get('/:pageId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getSinglePage(@GetPage() page: Page) {
    return page;
  }

  @Get('/:pageId/public')
  async getSinglePublicPage(@GetPage() page: Page) {
    if (page.private) {
      throw new ForbiddenException();
    }

    return page;
  }
  @Patch('/:pageId')
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updatePage(
    @Body() updatePageDto: UpdatePageDto,
    @GetPage() page: Page,
  ) {
    return this.pageService.updatePage(page, updatePageDto);
  }
}
