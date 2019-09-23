import React from 'react';
import styled from 'styled-components';

import CreateStepsForm from '../CreateStepsForm';
import Steps from '../Steps';

const StepssStyleWrapper = styled.div``;

function Stepss({ stepss, currentTodoId, onUpdate, refetchQueries }) {
  return (
    <StepssStyleWrapper>
      <CreateStepsForm
        currentTodoId={currentTodoId}
        refetchQueries={refetchQueries}
      />

      {stepss.map(steps => (
        <Steps
          key={steps.instance.id}
          steps={steps.instance}
          onUpdate={onUpdate}
        />
      ))}
    </StepssStyleWrapper>
  );
}

export default Stepss;
