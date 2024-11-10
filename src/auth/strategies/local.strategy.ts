import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/LoginDto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // *  super() is a call to the parent class constructor
    super({
      usernameField: 'email', // default is 'username'
      passwordField: 'password', // default is 'password'
    });
  }
  //  * email because it has been modified in the constructor

  async validate(email: string, password: string) {
    const loginData = { email, password } as LoginDto;
    //* use authentication definiens in authService
    const user = await this.authService.validateUser(loginData);
    // * if user is not found, passport will throw an error (returning undefined)
    return user;
  }
}
