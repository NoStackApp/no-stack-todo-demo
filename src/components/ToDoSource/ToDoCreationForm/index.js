import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import {
  CREATE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID,
  CREATE_IS_COMPLETED_FOR_TO_DO_SOURCE_ACTION_ID,
  CREATE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID,
  TYPE_IS_COMPLETED_ID,
  TYPE_STEPS_ID,
} from '../../../config';

// change styling here
const Form = styled.div`
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
`;

const Button = styled.button`
  margin-left: 1em;
`;

function ToDoCreationForm({ projectId, createToDo, createIsCompleted, createStep, onAdd }) {
  const [ toDoValue, updateToDoValue ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    updateToDoValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!toDoValue) {
      return;
    }

    updateLoading(true);

    const createToDoResponse = await createToDo({
      variables: {
        actionId: CREATE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID ,
        executionParameters: JSON.stringify({
          parentInstanceId: projectId,
          value: toDoValue,
        }),
        unrestricted: false,
      },
    });

    const newToDoData = JSON.parse(createToDoResponse.data.ExecuteAction);

    const createIsCompletedResponse = await createIsCompleted({
      variables: {
        actionId: CREATE_IS_COMPLETED_FOR_TO_DO_SOURCE_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: newToDoData.instanceId,
          value: 'false',
        }),
        unrestricted: false,
      },
    });

    const newIsCompletedData = JSON.parse(createIsCompletedResponse.data.ExecuteAction);

    await createStep({
      variables: {
        actionId: CREATE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: newToDoData.instanceId,
          value: 'first step',
        }),
        unrestricted: false,
      },
      update: (cache, response) => {
        const stepData = JSON.parse(response.data.ExecuteAction);

        const newToDo = {
          id: newToDoData.instanceId,
          instance: {
            id: newToDoData.instanceId,
            value: newToDoData.value,
            __typename: 'Instance',
          },
          children: [
              {
                typeId: TYPE_IS_COMPLETED_ID,
                instances: [
                  {
                    id: newIsCompletedData.instanceId,
                    instance: {
                      id: newIsCompletedData.instanceId,
                      value: newIsCompletedData.value,
                      __typename: 'Instance',
                    },
                    __typename: 'InstanceWithTypedChildren',
                  },
                ],
                __typename: 'TypeWithInstances',
              },
            {
              typeId: TYPE_STEPS_ID,
              instances: [
                {
                  id: stepData.instanceId,
                  instance: {
                    id: stepData.instanceId,
                    value: stepData.value,
                    __typename: 'Instance',
                  },
                  __typename: 'InstanceWithTypedChildren',
                },
              ],
              __typename: 'TypeWithInstances',
            }
          ],
          __typename: 'InstanceWithTypedChildren',
        };

        onAdd(newToDo)(cache);
      },
    });


    updateToDoValue('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor="toDo-value">
        ToDo:
        <input
          id="toDo-value"
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={toDoValue}
          disabled={loading}
        />
      </label>
      <Button type="submit"  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating ToDo...'
            : 'Create ToDo'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createToDo' }),
  graphql(EXECUTE_ACTION, { name: 'createIsCompleted' }),
  graphql(EXECUTE_ACTION, { name: 'createStep' }),
)(ToDoCreationForm);
