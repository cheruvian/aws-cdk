import { Construct } from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId, PhysicalResourceIdReference, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';

/**
 * Properties for a QueryDefinition
 */
export interface QueryDefinitionProps {
  /**
   * A name for the query definition.
   *
   * If you are saving a lot of query definitions, we recommend that you name them so that you can easily find the ones 
   * you want by using the first part of the name as a filter in the queryDefinitionNamePrefix parameter of DescribeQueryDefinitions.
   */
  readonly name?: string;

  /**
   * Use this parameter to include specific log groups as part of your query definition.
   *
   * If you are updating a query definition and you omit this parameter, then the updated definition will contain no log groups.
   */
  readonly logGroupNames?: string[];

  /**
   * The query string to use for this definition.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
   */
  queryString: string;
}

/**
 * Define a saved logs insights query definition.
 */
export class QueryDefinition extends Construct {
  readonly resource: AwsCustomResource

  constructor(scope: Construct, id: string, props: QueryDefinitionProps) {
    super(scope, id);
    this.resource = new AwsCustomResource(scope, `${id}-insights-query`, {
      // resourceType: 'AWSLogs::QueryDefinition',
      functionName: 'insights-cf-handler',
      onCreate: {
        service: 'CloudWatchLogs',
        action: 'putQueryDefinition',
        physicalResourceId: PhysicalResourceId.fromResponse('queryDefinitionId'),
        parameters: {
          name: props.name ?? id,
          queryString: props.queryString,
          logGroupNames: props.logGroupNames,
        },
      },
      onUpdate: {
        service: 'CloudWatchLogs',
        action: 'putQueryDefinition',
        physicalResourceId: PhysicalResourceId.fromResponse('queryDefinitionId'),
        parameters: {
          name: props.name ?? id,
          queryString: props.queryString,
          logGroupNames: props.logGroupNames,
          queryDefinitionId: new PhysicalResourceIdReference(),
        },
      },
      onDelete: {
        service: 'CloudWatchLogs',
        action: 'deleteQueryDefinition',
        parameters: {
          queryDefinitionId: new PhysicalResourceIdReference(),
        },
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
  }
}
