import React from 'react';
import styled from 'styled-components';
import { graphql } from '@apollo/react-hoc';
import { EXECUTE_ACTION } from '@nostack/no-stack';

import {UPDATE_IS_COMPLETED_FOR_TO_DO_SOURCE_ACTION_ID} from '../../../config';
import {IS_COMPLETED_FRAGMENT} from '../../source-props/fragments';

// add styling here
const IsCompletedStyleWrapper = styled.span`
  margin-left: 1.5em;
  display: inline-block;
  border: 1px solid #eeeeee;
  padding: 0.5em;
`;

function IsCompleted({ isCompleted, label, updateInstance, onUpdate, disabled = false }) {
  async function handleUpdateCompletion() {
    const value = isCompleted.value === 'true' ? 'false' : 'true';

    await updateInstance({
      variables: {
        actionId: UPDATE_IS_COMPLETED_FOR_TO_DO_SOURCE_ACTION_ID,
        executionParameters: JSON.stringify({
          value,
          instanceId: isCompleted.id,
        }),
        unrestricted: false,
      },
      optimisticResponse: {
        ExecuteAction: JSON.stringify({
          id: isCompleted.id,
          value,
        }),
      },
      update: onUpdate(isCompleted.id, IS_COMPLETED_FRAGMENT),
    });
  }

  return (
    <IsCompletedStyleWrapper>
      <label htmlFor={isCompleted.id}>
        {label}
        <input
          id={isCompleted.id}
          type="checkbox"
          checked={isCompleted.value === 'true'}
          onChange={handleUpdateCompletion}
          disabled={disabled}
        />
      </label>
    </IsCompletedStyleWrapper>
  );
}

export default graphql(EXECUTE_ACTION, { name: 'updateInstance' })(IsCompleted);
