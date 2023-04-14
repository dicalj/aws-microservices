import { RemovalPolicy } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface SwnCloudWatchProps {
  basketMicroservice: IFunction;
  orderMicroservice: IFunction;
  productMicroservice: IFunction;
}

export class SwnCloudWatch extends Construct {

  constructor(scope: Construct, id: string, props: SwnCloudWatchProps) {
    super(scope, id);

    this.createBasketLogGroup(props.basketMicroservice);
    this.createOrderLogGroup(props.orderMicroservice);
    this.createProductLogGroup(props.productMicroservice);
  }

  private createBasketLogGroup(basketMicroservice: IFunction) {
    const basketLogGroup = new LogGroup(this, 'BasketLogGroup', {
      logGroupName: `/aws/lambda/${basketMicroservice.functionName}`,
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY
    });

    return basketLogGroup;
  }

  private createOrderLogGroup(orderMicroservice: IFunction) {
    const orderLogGroup = new LogGroup(this, 'OrderLogGroup', {
      logGroupName: `/aws/lambda/${orderMicroservice.functionName}`,
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY
    });

    return orderLogGroup;
  }

  private createProductLogGroup(productMicroservice: IFunction) {
    const productLogGroup = new LogGroup(this, 'ProductLogGroup', {
      logGroupName: `/aws/lambda/${productMicroservice.functionName}`,
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY
    });

    return productLogGroup;
  }
}
