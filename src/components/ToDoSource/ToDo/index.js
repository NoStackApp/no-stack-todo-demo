import React, {useState} from 'react';
import styled from 'styled-components';
import {EXECUTE_ACTION} from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import {graphql} from '@apollo/react-hoc';

import {UPDATE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID, DELETE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID, TYPE_IS_COMPLETED_ID, TYPE_STEPS_ID} from '../../../config';
import {TO_DO_FRAGMENT} from '../../source-props/fragments';


import IsCompleted from '../IsCompleted'; 
import Steps from '../Steps'; 

// add styling here
const ToDoStyleWrapper = styled.div`
  margin: 2em 1em;
  padding: 1.5em;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
`;

const Row = styled.div`
  margin: 1em 0;
`;

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

function ToDo({toDo, parentId, updateInstance, deleteInstance, onUpdate, onDelete}) {
  const [toDoValue, updateToDoValue] = useState(toDo.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [ isDeleteMode, updateIsDeleteMode ] = useState(false);
  const [ isDeleting, updateIsDeleting ] = useState(false);

  const isCompleted = toDo.children.find(child => child.typeId === TYPE_IS_COMPLETED_ID).instances[0];
  // const steps = toDo.children.find(child => child.typeId === TYPE_STEPS_ID).instances;

  function handleToDoValueChange(e) {
    updateToDoValue(e.target.value);
  }

  async function handleToDoValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID,
        executionParameters: JSON.stringify({
          value: toDoValue,
          instanceId: toDo.id,
        }),
        update: onUpdate(toDo.id, TO_DO_FRAGMENT),
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
          actionId: DELETE_TO_DO_FOR_TO_DO_SOURCE_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            instanceId: toDo.id,
          }),
        },
        update: onDelete(toDo.id),
      });
    } catch (e) {
      updateIsDeleting(false);
    }
  }

  return (
    <ToDoStyleWrapper isDeleting={isDeleting}>
      {isEditMode ?
        (
          <>
            <label htmlFor={toDo.id}>
              ToDo Value:
              <input
                id={toDo.id}
                type="text"
                value={toDoValue}
                onChange={handleToDoValueChange}
                disabled={isSaving}
              />
            </label>
            <Button
              type="button"
              hoverColor="#00FF00"
              onClick={handleToDoValueSave}
              disabled={isSaving}
            >
              &#10003;
            </Button>
            <Button
              type="button"
              hoverColor="#FF0000"
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
          </>
        ) :
        (
          <>
            {toDoValue}
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
              ) :
              (
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
              )
            }

            
      <IsCompleted
              isCompleted = { isCompleted }
              toDoId = {toDo.id}
              label="Done?"
              onUpdate={onUpdate}
      />
{/* <Steps */}
{/*               steps = { steps } */}
{/*               toDoId = {toDo.id} */}
{/*               label="Done?" */}
{/*               onUpdate={onUpdate} */}
{/*       /> */}
          </>
        )
      }
    </ToDoStyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(ToDo);
