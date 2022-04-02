import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const itemsFromBackend = [
  { id: uuid(), content: "first task" },
  { id: uuid(), content: "second task" },
];

const columnsFromBackend = {
  [uuid()]: { name: "To Do", items: [...itemsFromBackend] },
  [uuid()]: { name: "In Progress", items: [] },
  [uuid()]: { name: "Completed", items: [] },
  [uuid()]: { name: "Tested", items: [] },
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDrapEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destinColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinItems = [...destinColumn.items];

      const [removed] = sourceItems.splice(source.index, 1);
      destinItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destinColumn, items: destinItems },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({ ...columns, [source.droppableId]: { ...column, items: copiedItems } });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext onDragEnd={({ ...props }) => onDrapEnd(props, columns, setColumns)}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          backgroundColor: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => (
                          <Draggable key={item.id} index={index} draggableId={item.id}>
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: "none",
                                    padding: 16,
                                    margin: "0 0 5px 0",
                                    minHeight: "50px",
                                    backgroundColor: snapshot.isDragging ? "#263b4a" : "#456c86",
                                    color: "white",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {item.content}
                                </div>
                              );
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
