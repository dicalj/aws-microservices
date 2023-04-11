import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class SwnDatabase extends Construct {
  public readonly basketTable: ITable;
  public readonly productTable: ITable;
  public readonly orderTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id)

    // product table
    this.productTable = this.createProductTable();
    // basket table
    this.basketTable = this.createBasketTable();
    // order table
    this.orderTable = this.createOrderTable();
  }

  /**
   * Create basket dynamodb table
   * basket : PK: userName -- items (SET-MAP object)
   *    item1 - { quantity - color - price - productId - productName }
   *    item2 - { quantity - color - price - productId - productName }
   * @returns {ITable}
   */
  private createBasketTable(): ITable {
    const basketTable = new Table(this, 'basket', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING
      },
      tableName: 'basket',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    return basketTable;
  }

  /**
   * Create product dynamodb table
   * product : PK: id -- name -- description -- imageFile -- price -- category
   * @returns {ITable}
   */
  private createProductTable(): ITable {
    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    return productTable;
  }

  /**
   * Create order dynamodb table
   * -- pk : userName
   * -- sk : orderDate
   * -- : totalPrice
   * -- : firstName
   * -- : lastName
   * -- : email
   * -- : address
   * -- : paymentMethod
   * -- : cardInfo
   * @returns {ITable}
   */
  private createOrderTable(): ITable {
    const orderTable = new Table(this, 'order', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'orderDate',
        type: AttributeType.STRING
      },
      tableName: 'order',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    return orderTable;
  }
}
