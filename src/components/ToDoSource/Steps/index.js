import React from 'react';
import styled from 'styled-components';

import StepCreationForm from '../StepCreationForm';
import Step from '../Step';

const StepsStyleWrapper = styled.div``;

function Steps({ steps, toDoId, onUpdate, onDelete, refetchQueries }) {
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
          onDelete={onDelete}
          parentId={toDoId}
        />
      ))}
    </StepsStyleWrapper>
  );
}

export default Steps;
