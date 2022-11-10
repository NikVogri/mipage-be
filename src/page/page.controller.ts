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
import {
  parsePageForMinOutput,
  parsePageForOutput,
} from './serializers/page.serializer';

@Controller('pages')
export class PagesController {
  constructor(private pageService: PageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPage(
    @Body() createPageDto: CreatePageDto,
    @GetUser() user: User,
  ) {
    const outputPage = await this.pageService.createPage(createPageDto, user);
    return parsePageForOutput(outputPage);
  }

  @Delete('/:pageId')
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async deletePage(@GetPage() page: Page) {
    await this.pageService.deletePage(page);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserAssociatedPages(@GetUser() user: User) {
    const userAssociatedPages = await this.pageService.getUserAssociatedPages(
      user,
    );

    return userAssociatedPages.map(parsePageForOutput);
  }

  @Get('/minimal')
  @UseGuards(JwtAuthGuard)
  async getAllUserAssociatedPagesForSidebar(@GetUser() user: User) {
    const responsePages = await this.pageService.getUserAssociatedPages(user);
    return responsePages.map((page) => parsePageForMinOutput(page, user));
  }

  @Get('/:pageId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getPage(@GetPage() page: Page) {
    return parsePageForOutput(page);
  }

  @Get('/:pageId/public')
  async getSinglePublicPage(@GetPage() page: Page) {
    if (page.private) {
      throw new ForbiddenException();
    }

    return parsePageForOutput(page);
  }

  @Patch('/:pageId')
  @Roles('owner')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updatePage(
    @Body() updatePageDto: UpdatePageDto,
    @GetPage() page: Page,
  ) {
    const responsePage = await this.pageService.updatePage(page, updatePageDto);
    return parsePageForOutput(responsePage);
  }
}
