import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { Contingency } from 'src/contingencies/entities/contingency.entity';
import { UpdateStatusPreauthorizationDto } from './dto/update-status-preauthorization.dto';

@Injectable()
export class PreauthorizationsService {
  constructor(
    @InjectModel(Contingency.name)
    private readonly contingencyModel: Model<Contingency>,
    //generic services needed in most of the modules (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}
  async updateStatus(
    id: string,
    updateStatusPreauthorizationDto: UpdateStatusPreauthorizationDto,
  ) {
    try {
      let model: Model<any>;
      const { email, status, observations, requestType, token } =
        updateStatusPreauthorizationDto;
      //choose de model acording to the type of requests
      if (requestType === 'Contingency') {
        model = this.contingencyModel;
      }
      //validate if request exists
      const document = await model.findOne({ _id: id });
      if (!document) {
        throw new BadRequestException('Request not found');
      }

      //validate if email is a preauthorizator
      const preauthorize_response = document.project_responsibles.some(
        (el) => el.email === email && el.preauthorize === 'pending',
      );

      if (!preauthorize_response) {
        throw new BadRequestException(
          'incorrect email or preauthorization has been done ',
        );
      }

      if (status === 'approved') {
        await model.updateOne(
          { _id: id },
          { $set: { 'project_responsibles.$[el].preauthorize': status } },
          { arrayFilters: [{ 'el.email': email }] },
        );
      } else if (status === 'rejected') {
        if (!observations || observations.trim() === '') {
          throw new BadRequestException('observations must be not empty');
        }
        await model.updateOne(
          { _id: id },
          {
            $set: {
              'project_responsibles.$[el].preauthorize': status,
              'project_responsibles.$[el].observations': observations,
            },
          },
          { arrayFilters: [{ 'el.email': email }] },
        );
      }
      await this.commonService.deleteUrlJWTForEmail(token);
      return `Request has been ${updateStatusPreauthorizationDto.status}`;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }
}
