import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID } from '../../../config';

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

function StepsCreationForm({ toDoId, createSteps, onAdd }) {
  const [ stepsValue, updateStepsValue ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    updateStepsValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stepsValue) {
      return;
    }

    updateLoading(true);

    const createStepsResponse = await createSteps({
      variables: {
        actionId: CREATE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID ,
        executionParameters: JSON.stringify({
          parentInstanceId: toDoId,
          value: stepsValue,
        }),
        unrestricted: false,
      },
      update: onAdd(),
    });

    const newStepsData = JSON.parse(createStepsResponse.data.ExecuteAction);

    

    updateStepsValue('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor="steps-value">
        Steps:
        <input
          id="steps-value"
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={stepsValue}
          disabled={loading}
        />
      </label>
      <Button type="submit"  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating Steps...'
            : 'Create Steps'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createSteps' }),
)(StepsCreationForm);
