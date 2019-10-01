import React from 'react';
import styled from 'styled-components';

import CreateStepsForm from '../StepsCreationForm';
import Step from '../Step';

const StepsStyleWrapper = styled.div``;

function Steps({ steps, todoId, onUpdate, onDelete, refetchQueries }) {
  return (
    <StepsStyleWrapper>
      <CreateStepsForm
        todoId={todoId}
        refetchQueries={refetchQueries}
      />

      {steps.map(step => (
        <Step
          key={step.id}
          step={step}
          onUpdate={onUpdate}
          onDelete={onDelete}
          parentId={todoId}
        />
      ))}
    </StepsStyleWrapper>
  );
}

export default Steps;
