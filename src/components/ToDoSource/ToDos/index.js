import React from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import flattenData  from '../../../flattenData';

import ToDoCreationForm from '../ToDoCreationForm';
import ToDo from '../ToDo';

import { SOURCE_TO_DO_SOURCE_ID } from '../../../config';
import { TO_DO_SOURCE_RELATIONSHIPS, SOURCE_TO_DO_SOURCE_QUERY } from '../../source-props/toDoSource';

// add styling here
const ToDosStyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

function ToDos({ projectId }) {
  const parameters = {
    currentProjectId: projectId,
  };

  return (
    <Unit
      id={SOURCE_TO_DO_SOURCE_ID}
      typeRelationships={TO_DO_SOURCE_RELATIONSHIPS}
      query={SOURCE_TO_DO_SOURCE_QUERY}
      parameters={parameters}
    >
      {({loading, error, data, updateUnitAfterCreateAction, updateUnitAfterUpdateAction, updateUnitAfterDeleteAction}) => {
        if (loading) return 'Loading...';

        if (error) {
          console.error(error);
          return `Error: ${error.graphQLErrors}`
        };

        const toDos = data.unitData.map(el => flattenData(el));

        return (
          <>
          <ToDosStyleWrapper>
            {
              toDos && toDos.map(toDo => (
                <ToDo
                  key={toDo.id}
                  parentId={projectId}
                  toDo={toDo}
                  onUpdate={updateUnitAfterUpdateAction}
                  onDelete={updateUnitAfterDeleteAction}
                />
              ))
            }
            <ToDoCreationForm  projectId={projectId} onAdd={updateUnitAfterCreateAction}/>
          </ToDosStyleWrapper>
          </>
        );
      }}
    </Unit>
  );
}
export default ToDos;

