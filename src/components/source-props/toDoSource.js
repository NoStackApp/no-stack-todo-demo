import gql from 'graphql-tag';

import { TYPE_TO_DO_ID, TYPE_IS_COMPLETED_ID, TYPE_STEPS_ID} from '../../config';

import { TO_DO_FRAGMENT, TO_DO_CHILD_FRAGMENT } from './fragments';


export const SOURCE_TO_DO_SOURCE_QUERY = gql`
  query UNIT(
    $id: ID!
    $typeRelationships: String!
    $parameters: String
  ) {
    unitData(
      unitId: $id
      typeRelationships: $typeRelationships
      parameters: $parameters
    ) {
      id
      instance {
        ...ToDoParts
      }
      children {
        typeId
        instances {
          id
          instance {
            ...TodoChildParts
          }
        }
      }
    }
  }

  ${TO_DO_FRAGMENT}
  ${TO_DO_CHILD_FRAGMENT}
`;

export const TO_DO_SOURCE_RELATIONSHIPS = {
  [TYPE_TO_DO_ID]: {
    [TYPE_IS_COMPLETED_ID]: null,
    [TYPE_STEPS_ID]: null,
  },
};
