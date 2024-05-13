import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HomePage } from './schema/home-page.schema';
import { Model } from 'mongoose';
import { AddMainSectionDto } from './dto/add-main-section.dto';
import { unlink } from 'fs/promises';
import { UpdateMainSectionDto } from './dto/update-main-section.dto';
import { AddSectionOneDto } from './dto/add-section-one.dto';

@Injectable()
export class HomePageService {
  constructor(
    @InjectModel(HomePage.name)
    private homePageModel: Model<HomePage>,
  ) {}

  async addMainSection(
    addMainSectionDto: AddMainSectionDto,
    file: Express.Multer.File,
  ): Promise<object> {
    const mainSection = await this.homePageModel.findOne({});
    if (!mainSection) {
      if (file) {
        const image = `${process.env.BASE_URL}/main-section/${file.filename}`;
        const section = await this.homePageModel.create({
          mainSection: { ...addMainSectionDto, image },
        });
        return {
          status: 'success',
          message: 'main section added successfully',
          mainSection: section.mainSection,
        };
      }
    }
    if (file) {
      if (mainSection?.mainSection?.image) {
        await unlink(
          `src/home-page/uploads/main-section/${mainSection.mainSection.image
            .split('/')
            .pop()}`,
        );
      }
      mainSection.mainSection.image = `${process.env.BASE_URL}/main-section/${file.filename}`;
    } else {
      if (mainSection?.mainSection?.image) {
        await unlink(
          `src/home-page/uploads/main-section/${mainSection.mainSection.image
            .split('/')
            .pop()}`,
        );
        mainSection.mainSection.image = undefined;
      }
    }
    mainSection.mainSection.h1 = addMainSectionDto.h1;
    mainSection.mainSection.h2 = addMainSectionDto.h2;
    mainSection.mainSection.h3 = addMainSectionDto.h3;
    await mainSection.save();
    return {
      status: 'success',
      message: 'main section added successfully',
      mainSection: mainSection.mainSection,
    };
  }

  async updateMainSection(
    updateMainSection: UpdateMainSectionDto,
    file: Express.Multer.File,
  ): Promise<object> {
    const mainSection = await this.homePageModel.findOne({});
    if (!mainSection.mainSection) {
      if (file) await unlink(file.path);
      throw new ForbiddenException(
        `No main section please add main section first than update it`,
      );
    }
    if (file) {
      await unlink(
        `src/home-page/uploads/main-section/${mainSection.mainSection?.image
          .split('/')
          .pop()}`,
      );
      mainSection.mainSection.image = `${process.env.BASE_URL}/main-section/${file.filename}`;
    }
    if (updateMainSection.h1) mainSection.mainSection.h1 = updateMainSection.h1;
    if (updateMainSection.h2) mainSection.mainSection.h2 = updateMainSection.h2;
    if (updateMainSection.h3) mainSection.mainSection.h3 = updateMainSection.h3;
    await mainSection.save();
    return {
      status: 'success',
      message: 'main section updated successfully',
      mainSection: mainSection.mainSection,
    };
  }

  async getMainSection(): Promise<object>{
    const mainSection = await this.homePageModel.findOne({});
    return {
      status: 'success',
      message: 'get main section successfully',
      mainSection:mainSection?.mainSection ?? null
    }
  };

  async addSectionOne(addSectionOne: AddSectionOneDto): Promise<object>{
    const sectionOne = await this.homePageModel.findOne({})
    if (!sectionOne) {
      const section = await this.homePageModel.create({
        sectionOne: addSectionOne
      });
      return {
        status: 'success',
        message: 'add section one successfully',
        sectionOne: section.sectionOne
      }
    }
    if (addSectionOne.label) sectionOne.sectionOne.label = addSectionOne.label;
    if (addSectionOne.description) sectionOne.sectionOne.description = addSectionOne.description;
    if (addSectionOne.products) sectionOne.sectionOne.products = addSectionOne.products;
    await sectionOne.save();
    return {
      status: 'success',
      message: 'add section one successfully',
      sectionOne: sectionOne.sectionOne,
    };
  }
}
