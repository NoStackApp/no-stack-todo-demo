import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID, CREATE_IS_COMPLETED_FOR_TO_DO_SOURCE_ACTION_ID } from '../../../config';

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

function ToDoCreationForm({ projectId, createToDo, createIsCompleted, onAdd }) {
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
      update: onAdd(),
    });

    const newToDoData = JSON.parse(createToDoResponse.data.ExecuteAction);

        await createIsCompleted({
      variables: {
        actionId: CREATE_IS_COMPLETED_FOR_TO_DO_SOURCE_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: newToDoData.instanceId,
          value: 'false',
        }),
        unrestricted: false,
      },
      update: (cache, response) => {
        const isCompletedData = JSON.parse(response.data.ExecuteAction);

        const newToDo = {
          instance: {
            id: newToDoData.instanceId,
            value: newToDoData.value,
            __typename: 'Instance',
          },
          children: [
              {
                instances: [
                  {
                     instance: {
                        id: isCompletedData.instanceId,
                        value: isCompletedData.value,
                        __typename: 'Instance',
                     },
                     __typename: 'InstanceWithTypedChildren',
                  },
                ],
                __typename: 'TypeWithInstances',
              },
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
)(ToDoCreationForm);
