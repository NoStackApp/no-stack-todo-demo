import React from 'react';
import styled from 'styled-components';

const StepStyleWrapper = styled.div``;

function Step({ step, onUpdate }) {
  return (
    <StepStyleWrapper>
      {step}
    </StepStyleWrapper>
  )
}

export default Step;
