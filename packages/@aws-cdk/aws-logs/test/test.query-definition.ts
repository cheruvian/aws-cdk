import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { QueryDefinition } from '../lib';

export = {
  'provides all props'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      name: 'name',
      logGroupNames: ['logGroup1', 'logGroup2'],
      queryString: 'queryString',
    });

    // THEN
    expect(stack).to(haveResource('AWSLogs::QueryDefinition', {
      RetentionInDays: 7,
    }));

    test.done();
  },
};
