import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface SwnMicroserviceProps {
  productTable: ITable;
  basketTable: ITable;
}

export class SwnMicroservice extends Construct {

  public readonly basketMicroservice: IFunction;
  public readonly productMicroservice: IFunction;

  constructor(scope: Construct, id: string, props: SwnMicroserviceProps) {
    super(scope, id)

    // product microservices
    this.productMicroservice = this.createProductFunction(props.productTable);
    // basket microservices
    this.basketMicroservice = this.createBasketFunction(props.basketTable);
  }

  /**
   * Create basket lambda
   * @param basketTable - basket dynamodb table
   * @returns {IFunction}
   */
  private createBasketFunction(basketTable: ITable): IFunction {
    const basketMicroservice = new NodejsFunction(this, 'basketLambdaFunction', {
      entry: join(__dirname, '/../src/basket/index.js'),
      bundling: {
        externalModules: [
          'aws-sdk',
        ]
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName || ''
      },
      runtime: Runtime.NODEJS_18_X
    })

    basketTable.grantReadWriteData(basketMicroservice);

    return basketMicroservice;
  }

  /**
   * Create product lambda
   * @param productTable - product dynamodb table
   * @returns {IFunction}
   */
  private createProductFunction(productTable: ITable): IFunction {
    const productMicroservice = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, '/../src/product/index.js'),
      bundling: {
        externalModules: [
          'aws-sdk',
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName || ''
      },
      runtime: Runtime.NODEJS_18_X
    })

    productTable.grantReadWriteData(productMicroservice);

    return productMicroservice;
  }
}