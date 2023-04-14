import { RemovalPolicy } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface SwnCloudWatchProps {
  productMicroservice: IFunction;
}

export class SwnCloudWatch extends Construct {

  constructor(scope: Construct, id: string, props: SwnCloudWatchProps) {
    super(scope, id);

    this.createProductLogGroup(props.productMicroservice);
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
