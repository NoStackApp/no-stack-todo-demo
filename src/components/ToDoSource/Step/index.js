import React, { useState } from 'react';
import styled from 'styled-components';
import compose from '@shopify/react-compose';
import { graphql } from '@apollo/react-hoc';
import { EXECUTE_ACTION } from '@nostack/no-stack';

import { UPDATE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID, DELETE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID } from '../../../config';
import { TO_DO_CHILD_FRAGMENT } from '../../source-props/fragments';

const StepStyleWrapper = styled.div``;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  color: #bbbbbb;
  transition: color 0.5s ease;
  &:hover {
    color: ${props => props.hoverColor || '#000000'};
  }
`;

const DeleteMenu = styled.div`
  color: red;
  margin: 1em;
  padding: 1em;
  border: 1px solid #eeeeee;
`;

function Step({ step, updateInstance, onUpdate, deleteInstance, onDelete, parentId }) {
  const [stepValue, updateStepValue] = useState(step.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [isDeleteMode, updateIsDeleteMode] = useState(false);
  const [isDeleting, updateIsDeleting] = useState(false);

  function handleStepValueChange(e) {
    updateStepValue(e.target.value);
  }

  async function handleStepValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID,
        executionParameters: JSON.stringify({
          value: stepValue,
          instanceId: step.id,
        }),
        update: onUpdate(step.id, TO_DO_CHILD_FRAGMENT),
      },
    });

    updateIsEditMode(false);
    updateIsSaving(false);
  }

  async function handleDelete() {
    updateIsDeleting(true);

    try {
      await deleteInstance({
        variables: {
          actionId: DELETE_STEPS_FOR_TO_DO_SOURCE_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            instanceId: step.id,
          }),
        },
        update: onDelete(step.id),
      });
    } catch (e) {
      updateIsDeleting(false);
    }
  }


  return (
    <StepStyleWrapper isDeleting={isDeleting}>
      {isEditMode ? (
        <>
          <label htmlFor={step.id}>
            Step Value:
            <input
              id={step.id}
              type="text"
              value={stepValue}
              onChange={handleStepValueChange}
              disabled={isSaving}
            />
            <Button
              type="button"
              hoverColor="#00FF00"
              onClick={handleStepValueSave}
              disabled={isSaving}
            >
              &#10003;
            </Button>
            <Button
              type="button"
              hoverColor="#00FF00"
              onClick={() => updateIsEditMode(false)}
              disabled={isSaving}
            >
              &#10005;
            </Button>
            <Button
              type="button"
              onClick={() => updateIsDeleteMode(true)}
            >
              &#128465;
            </Button>
          </label>
        </>
      ) : ( 
        <>
          {stepValue}
          {isDeleteMode ? (
            <DeleteMenu>
              Delete?
              <Button
                type="button"
                hoverColor="#00FF00"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                &#10003;
              </Button>
              <Button
                type="button"
                hoverColor="#FF0000"
                onClick={() => updateIsDeleteMode(false)}
                disabled={isDeleting}
              >
                &#10005;
              </Button>
            </DeleteMenu>
          ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => updateIsEditMode(true)}
                  >
                    &#9998;
                  </Button>
                  <Button
                    type="button"
                    onClick={() => updateIsDeleteMode(true)}
                  >
                    &#128465;
                  </Button>
                </>
          )}
        </>
      )
        }
    </StepStyleWrapper>
  )
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(Step);
