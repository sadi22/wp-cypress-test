import React, { useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Handle
} from "react-flow-renderer";

const InputNode = ({ type, data }) => {
  return (
    <>
      <Handle type="target" position="left" />
      type: {type}
      <br />
      value:{data.value}
      <Handle type="source" position="right" id="a" />
    </>
  );
};

const TextAreaNode = ({ type, data }) => {
  return (
    <>
      <Handle type="target" position="left" />
      type: {type}
      <br />
      value:{data.value}
      <Handle type="source" position="right" id="a" />
    </>
  );
};

const BooleanNode = ({ type, data }) => {
  return (
    <>
      <Handle type="target" position="left" />
      type: {type}
      <br />
      value:{data.value === 1 ? "True" : "False"}
      <Handle type="source" position="right" id="a" />
    </>
  );
};

const Input2Node = ({ type, data }) => (
  <>
    <Handle type="target" position="left" />
    type: {type}
    <br />
    value - 1 :{data.value[0]}
    <br />
    value - 2 :{data.value[1]}
    <Handle type="source" position="right" id="a" />
  </>
);

const nodeTypes = {
  InputNode: InputNode,
  TextAreaNode: TextAreaNode,
  BooleanNode: BooleanNode,
  Input2Node: Input2Node
};

const initialElements = [];

const initialInput = {
  type: "InputNode",
  data: { value: "" },
  style: { border: "1px solid #777", padding: 10, width: 150 },
  position: { x: 250, y: 25 }
};

const initialTextArea = {
  type: "TextAreaNode",
  data: { value: "" },
  style: { border: "1px solid #777", padding: 10, width: 150 },
  position: { x: 250, y: 25 }
};

const initialBoolean = {
  type: "BooleanNode",
  data: { value: true },
  style: { border: "1px solid #777", padding: 10, width: 150 },
  position: { x: 250, y: 25 }
};

const initialInput2 = {
  type: "Input2Node",
  data: { value: ["", ""] },
  style: { border: "1px solid #777", padding: 10, width: 150 },
  position: { x: 250, y: 25 }
};

const Flow = () => {
  const [elements, setElements] = useState(initialElements);

  const [objectEdit, setObjectEdit] = useState({});

  const onConnect = (params) =>
    setElements((els) => {
      return addEdge({ ...params, arrowHeadType: "arrowclosed" }, els);
    });

  const onElementClick = (event, object) => {
    setObjectEdit(object);
  };

  const onPaneClick = () => {
    setObjectEdit({});
  };

  const onSubmit = () => {
    alert(JSON.stringify(elements));
  };

  return (
    <div>
      <div>
        <div style={{ textAlign: "left", padding: 10 }}>
          <button
            onClick={() => {
              onSubmit();
            }}
          >
            Deploy
          </button>
          <hr />
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialInput, id }]);
            }}
          >
            Add Input
          </button>{" "}
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialTextArea, id }]);
            }}
          >
            Add Text Area
          </button>{" "}
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialBoolean, id }]);
            }}
          >
            Add Boolean
          </button>{" "}
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialInput2, id }]);
            }}
          >
            Add 2 Input
          </button>
        </div>
      </div>

      <div style={{ textAlign: "left", padding: 10 }}>
        {objectEdit.type === "InputNode" && (
          <input
            value={objectEdit.data.value}
            onChange={(e) => {
              setObjectEdit({
                ...objectEdit,
                data: { ...objectEdit.data, value: e.target.value }
              });

              const newElement = elements.map((item) => {
                if (item.id === objectEdit.id) {
                  return {
                    ...item,
                    data: { ...item.data, value: e.target.value }
                  };
                }
                return item;
              });

              setElements(newElement);
            }}
          />
        )}

        {objectEdit.type === "TextAreaNode" && (
          <textarea
            value={objectEdit.data.value}
            onChange={(e) => {
              setObjectEdit({
                ...objectEdit,
                data: { ...objectEdit.data, value: e.target.value }
              });

              const newElement = elements.map((item) => {
                if (item.id === objectEdit.id) {
                  return {
                    ...item,
                    data: { ...item.data, value: e.target.value }
                  };
                }
                return item;
              });

              setElements(newElement);
            }}
          />
        )}
        {objectEdit.type === "BooleanNode" && (
          <select
            value={objectEdit.data.value}
            onChange={(e) => {

              setObjectEdit({
                ...objectEdit,
                data: { ...objectEdit.data, value: e.target.value }
              });
              const newElement = elements.map((item) => {
                if (item.id === objectEdit.id) {
                  return {
                    ...item,
                    data: { ...item.data, value: e.target.value }
                  };
                }
                return item;
              });

              setElements(newElement);
            }}
          >
            <option value={1}>True</option>
            <option value={0}>false</option>
          </select>
        )}

        {objectEdit.type === "Input2Node" && (
          <>
            1:{" "}
            <input
              value={objectEdit.data.value[0]}
              onChange={(e) => {
                const newObjectEdit = objectEdit;
                newObjectEdit.data.value[0] = e.target.value;

                setObjectEdit({
                  ...newObjectEdit
                });

                const newElement = elements.map((item) => {
                  if (item.id === objectEdit.id) {
                    const newItem = item;
                    newItem.data.value[0] = e.target.value;
                    return { ...newItem };
                  }
                  return item;
                });

                setElements(newElement);
              }}
            />
            2:{" "}
            <input
              value={objectEdit.data.value[1]}
              onChange={(e) => {
                const newObjectEdit = objectEdit;
                newObjectEdit.data.value[1] = e.target.value;

                setObjectEdit({
                  ...newObjectEdit
                });

                const newElement = elements.map((item) => {
                  if (item.id === objectEdit.id) {
                    const newItem = item;
                    newItem.data.value[1] = e.target.value;
                    return { ...newItem };
                  }
                  return item;
                });

                setElements(newElement);
              }}
            />
          </>
        )}
      </div>
      <hr />
      <div style={{ height: 500 }}>
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          deleteKeyCode={46} /* 'delete'-key */
          onClick={onElementClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
        >
          <Background/>
        </ReactFlow>
      </div>
    </div>
  );
};
export default Flow;
