import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { AxiosError } from 'axios';
import type { OAuth2Client } from 'google-auth-library';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { Causes } from '@/common/exceptions/causes';
import type { StellaConfig } from '@/configs';
import { Admin } from '@/database/entities';
import type { ISocial } from '@/shared/interfaces/social.interface';
import type { ISocialAuth } from '@/shared/interfaces/social_auth.interface';
import type { TokensType } from '@/shared/types';

import { AuthHelperService } from './auth_helper.service';
import type { CreateUserBySocialDto } from './dto/user_social.create';

@Injectable()
export class GoogleAuthService implements ISocialAuth {
  private google: OAuth2Client;

  constructor(
    private readonly configService: ConfigService<StellaConfig>,
    private readonly authHelperService: AuthHelperService,
    private readonly httpService: HttpService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  private async getProfileByToken(accessToken: string): Promise<ISocial> {
    try {
      const googleApi = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
      const { data } = await firstValueFrom(
        this.httpService.get<ISocial | any>(googleApi).pipe(
          catchError((error: AxiosError | any) => {
            Logger.error(error.response.data.error.status);
            throw error.response.data.error;
          }),
        ),
      );
      const { id, email, given_name: firstName, family_name: lastName } = data;

      return {
        id,
        email,
        firstName,
        lastName,
      } as ISocial;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async validateSocialAdmin(socialData: ISocial): Promise<Admin> {
    let admin: Admin = null;
    const { id, email } = socialData;

    admin = await this.adminRepository.findOne({
      where: {
        email,
      },
    });

    if (!admin) {
      throw Causes.FORBIDDEN(
        'Email',
        'Access Denied! Your email address is not authorized to access this site!',
      );
    } else {
      if (!admin.isActive) {
        throw Causes.FORBIDDEN('Admin', 'Admin is not active!');
      }

      if (!admin.socialId) {
        await this.adminRepository.update(admin.id, {
          socialId: id,
        });
      }
    }

    return admin;
  }

  async createAdminSession(
    input: CreateUserBySocialDto,
  ): Promise<{ admin: Admin; tokens: TokensType }> {
    const socialData = await this.getProfileByToken(input.accessToken);
    const admin = await this.validateSocialAdmin(socialData);
    const tokens = await this.authHelperService.createTokensAsAdmin(admin);

    return {
      admin,
      tokens,
    };
  }
}
