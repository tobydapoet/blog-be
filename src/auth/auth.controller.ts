import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    try {
      console.log(req.user);
      const token = await this.authService.login(req.user.email);
      return {
        success: true,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    const access_token = await this.authService.refreshToken(req.sub);
    return { access_token };
  }

  @Post('logout')
  async signOut(@Req() req) {
    try {
      await this.authService.logout(req.user.sub);
      return { success: true, mesage: 'Logout success!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.email);
    res.redirect(`http://localhost:3001?token=${response.access_token}`);
  }
}
