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

export const TO_DO_CHILD_FRAGMENT = gql`
  fragment TodoChildParts on Instance {
    id
    value
  }
`;
