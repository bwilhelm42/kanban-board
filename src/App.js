import logo from "./logo.svg";
import "./App.css";
import React, { useCallback, useState, useReducer, useEffect } from "react";
import produce from 'immer';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

let tasksList = [
  {
    id: 1,
    content: "Task 1"
  },
  {
    id: 2,
    content: "Task 2"
  },
  {
    id: 3,
    content: "Task 3"
  }
]

const columns = [
  {
    id: 0,
    name: "ToDo",
    tasks: tasksList
  },
  {
    id: 1,
    name: "In Progress",
    tasks: []
  },
  {
    id: 2,
    name: "Done",
    tasks: []
  }
]

function reorder(arr, from, to) {
  let element = arr[from]
  arr.splice(from, 1);
  arr.splice(to, 0, element);
  return arr;
}

function move(board, indices) {
  const {scIndex, stIndex, dcIndex, dtIndex } = indices;

  const {tasks: [...sTasks]} = board[scIndex];
  console.log(sTasks);
  const {tasks: [...dTasks]} = board[dcIndex];
  dTasks.splice(dtIndex, 0, sTasks[stIndex]);
  board[dcIndex].tasks = dTasks
  sTasks.splice(stIndex, 1);
  board[scIndex].tasks = sTasks
}

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 250
});

function App() {
  const [boardColumns, setBoardColumns] = useState([])

  useEffect(() => {
    setBoardColumns(columns);
  }, [])

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    console.log("Result", result, "BoardColumns: ", boardColumns[0], "Source", source, "Destination", destination);
    const newBoard = [...boardColumns];
    const sIndex = parseInt(source.droppableId)
    const dIndex = parseInt(destination.droppableId)

    if (sIndex == dIndex) {
      const { tasks } = newBoard[sIndex];
      newBoard[sIndex].tasks = reorder(tasks, source.index, destination.index) 
    }
    else {
      const {tasks: [...sTasks]} = newBoard[sIndex];
      const {tasks: [...dTasks]} = newBoard[dIndex];

      move(newBoard, {
        scIndex: sIndex, 
        stIndex: source.index, 
        dcIndex: dIndex, 
        dtIndex: destination.index
      });
    }
    setBoardColumns(newBoard)
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        {
          boardColumns.map((col, index) => (
            <div key={index} >
              <h2>{col.name}</h2>
              <Droppable key={col.id} droppableId={col.id.toString()}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {col.tasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.content} index={index}>
                          {(provided, snapshot) => (
                            <ul
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h4>{item.content}</h4>
                            </ul>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ))
        }
      </div>
    </DragDropContext>
  );
}

export default App;
