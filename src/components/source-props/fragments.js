import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
  fragment UserParts on Instance {
    id
    value
  }
`;

export const PROJECT_FRAGMENT = gql`
  fragment ProjectParts on Instance {
    id
    value
  }
`;

export const TO_DO_FRAGMENT = gql`
  fragment ToDoParts on Instance {
    id
    value
  }
`;

export const IS_COMPLETED_FRAGMENT = gql`
  fragment IsCompletedParts on Instance {
    id
    value
  }
`;

export const STEPS_FRAGMENT = gql`
  fragment StepsParts on Instance {
    id
    value
  }
`;