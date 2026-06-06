import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()

export class LoggerInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    console.log(
      `${context.getClass().name}`,
    );

    return next.handle();
  }
}

function Injectable(): (target: typeof LoggerInterceptor) => void | typeof LoggerInterceptor {
    throw new Error("Function not implemented.");
}
