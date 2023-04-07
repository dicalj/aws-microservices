import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface SwnMicroserviceProps {
  productTable: ITable
}

export class SwnMicroservice extends Construct {
  public readonly productMicroservice: IFunction;

  constructor(scope: Construct, id: string, props: SwnMicroserviceProps) {
    super(scope, id)

    // Product DynamoDB Table Creation
    this.productMicroservice = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, '/../src/product/index.js'),
      bundling: {
        externalModules: [
          'aws-sdk',
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: props.productTable.tableName || ''
      },
      runtime: Runtime.NODEJS_18_X
    })

    props.productTable.grantReadWriteData(this.productMicroservice);
  }
}