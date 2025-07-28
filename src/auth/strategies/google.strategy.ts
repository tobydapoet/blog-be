import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    if (!googleConfiguration) {
      throw new Error('Invalid Google OAuth configuration');
    }

    super({
      clientID: googleConfiguration.clientId!,
      clientSecret: googleConfiguration.clientSecret!,
      callbackURL: googleConfiguration.callbackURL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(__: string, _: string, profile: any) {
    console.log(profile);
    const account = await this.authService.validateGoogleAccount({
      email: profile.emails?.[0]?.value ?? null,
      name: profile.displayName ?? '',
      avatar_url: profile.photos?.[0]?.value ?? null,
      google_id: profile.id,
    });
    if (account) {
      const loginRes = await this.authService.login(account.email);
      return loginRes;
    }
    return null;
  }
}
