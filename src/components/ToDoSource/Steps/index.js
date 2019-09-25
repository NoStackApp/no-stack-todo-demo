import React from 'react';
import styled from 'styled-components';

import CreateStepsForm from '../StepsCreationForm';
import Step from '../Step';

const StepsStyleWrapper = styled.div``;

function Steps({ steps, currentTodoId, onUpdate, refetchQueries }) {
  return (
    <StepsStyleWrapper>
      <CreateStepsForm
        currentTodoId={currentTodoId}
        refetchQueries={refetchQueries}
      />

      {steps.map(step => (
        <Step
          key={step.instance.id}
          step={step.instance}
          onUpdate={onUpdate}
        />
      ))}
    </StepsStyleWrapper>
  );
}

export default Steps;
