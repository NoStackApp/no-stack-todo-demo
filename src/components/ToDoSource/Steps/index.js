import React from 'react';
import styled from 'styled-components';

import StepCreationForm from '../StepCreationForm';
import Step from '../Step';

const StepsStyleWrapper = styled.div``;

function Steps({ steps, toDoId, onUpdate, refetchQueries }) {
  return (
    <StepsStyleWrapper>
      <StepCreationForm
        refetchQueries={refetchQueries}
        parentId={toDoId}
      />

      {steps.map(step => (
        <Step
          key={step.id}
          step={step}
          onUpdate={onUpdate}
          parentId={toDoId}
          refetchQueries={refetchQueries}
        />
      ))}
    </StepsStyleWrapper>
  );
}

export default Steps;
