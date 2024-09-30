import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rcpError = exception.getError();

    if(rcpError.toString().includes("Empty response")){
      return response.status(500).json({ 
        status:500,
        message: rcpError.toString().substring(0, rcpError.toString().indexOf('(') -1)
      });
    }
    
    if(typeof rcpError === 'object' && 'status' in rcpError && 'message' in rcpError){
      const status = isNaN(+rcpError.status) ? 400 : +rcpError.status;
      return response.status(status).json(rcpError);
    }

    response.status(400).json({ 
      status:400,
      message: rcpError
    });
  }
}