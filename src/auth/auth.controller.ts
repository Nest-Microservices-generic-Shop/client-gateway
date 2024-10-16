import { Controller, Post, Inject, Body, UseGuards, Req } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy

  ) {}


  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto){
    return this.client.send('auth.resgiter.user', registerUserDto)
    .pipe(catchError(err => {throw new RpcException(err)}))
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto){
    return this.client.send('auth.login.user',loginUser)
    .pipe(catchError(err => {throw new RpcException(err)}))
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string){
    return {
      ...user,
      token
    }
  }
  
}
