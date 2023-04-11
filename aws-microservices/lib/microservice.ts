import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface SwnMicroserviceProps {
  productTable: ITable;
  basketTable: ITable;
  orderTable: ITable;
}

export class SwnMicroservice extends Construct {

  public readonly basketMicroservice: IFunction;
  public readonly productMicroservice: IFunction;
  public readonly orderingMicroservice: IFunction;

  constructor(scope: Construct, id: string, props: SwnMicroserviceProps) {
    super(scope, id)

    // product microservices
    this.productMicroservice = this.createProductFunction(props.productTable);
    // basket microservices
    this.basketMicroservice = this.createBasketFunction(props.basketTable);
    // ordering microservices
    this.orderingMicroservice = this.createOrderingFunction(props.orderTable);
  }

  /**
   * Create basket lambda
   * @param basketTable - basket dynamodb table
   * @returns {IFunction}
   */
  private createBasketFunction(basketTable: ITable): IFunction {
    const basketFunction = new NodejsFunction(this, 'basketLambdaFunction', {
      entry: join(__dirname, '/../src/basket/index.js'),
      bundling: {
        externalModules: [
          'aws-sdk',
        ]
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName || '',
        EVENT_SOURCE: 'com.swn.basket.checkoutbasket',
        EVENT_DETAIL_TYPE: 'CheckoutBasket',
        EVENT_BUS_NAME: 'SwnEventBus',
      },
      runtime: Runtime.NODEJS_18_X
    })

    basketTable.grantReadWriteData(basketFunction);

    return basketFunction;
  }

  /**
   * Create product lambda
   * @param productTable - product dynamodb table
   * @returns {IFunction}
   */
  private createProductFunction(productTable: ITable): IFunction {
    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
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

    productTable.grantReadWriteData(productFunction);

    return productFunction;
  }

  /**
   * Create order lambda
   * @param orderTable - order dynamodb table
   * @returns {IFunction}
   */
  private createOrderingFunction(orderTable: ITable): IFunction {
    const orderFunction = new NodejsFunction(this, 'orderingLambdaFunction', {
      entry: join(__dirname, '/../src/ordering/index.js'),
      bundling: {
        externalModules: [
          'aws-sdk',
        ]
      },
      environment: {
        PRIMARY_KEY: 'userName',
        SORT_KEY: 'orderDate',
        DYNAMODB_TABLE_NAME: orderTable.tableName || ''
      },
      runtime: Runtime.NODEJS_18_X
    })

    orderTable.grantReadWriteData(orderFunction);

    return orderFunction;
  }
}
