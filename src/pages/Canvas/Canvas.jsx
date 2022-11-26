import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  updateEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow
} from "react-flow-renderer";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import CanvasSettingsDrawer from "./CanvasSettingsDrawer";

import Sidebar from "./Sidebar";
import ConditionStep from "./ConditionStep";
import TriggerStep from "./TriggerStep";
import ExitStep from "./ExitStep";
import DelayStep from "./DelayStep";
import SendEmailStep from "./SendEmailStep";
import axios from "axios";

const getId = () => {
  const lastStepNodeID = useGlobalStore.getState().lastStepNodeID;
  const newID = lastStepNodeID + 1;
  //.log(lastStepNodeID);
  useGlobalStore.setState({ lastStepNodeID: newID });
  return `dndnode_${newID}`;
};

const nodeTypes = {
  triggerStep: TriggerStep,
  conditionStep: ConditionStep,
  delayStep: DelayStep,
  sendEmailStep: SendEmailStep,
  exitStep: ExitStep,
};

const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const [selectedNodeID, setSelectedNodeID] = useState(null);
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const { setViewport } = useReactFlow();


  //dynamic flow ID
  const flowKey = 'test-flow';

  const [id, setId] = useState(3);
  const [title, setTitle] = useState("");
  const [workflow_data, setWorkflowData] = useState({});
  const [global_state, setGlobalState] = useState({});
  const [status, setStatus] = useState(1);


  useEffect(() => {
    setNodes((nds) =>
      nds.concat({
        id: getId(),
        type: "triggerStep",
        position: { x: 100, y: 100 },
        data: {
          deleteNode,
          deleteEdges,
          resetNode,
          openSettings,
        },
      })
    );

    const wfDetails = axios({
      method: 'get',
      url: `/wp-json/mrm/v1/workflows/${id}`
    }).then((response)=>{
      setTitle(response.data['data'][0].title);
      setWorkflowData(response.data['data'][0].workflow_data);
      setGlobalState(response.data['data'][0].global_state);
      setStatus(response.data['data'][0].status);
    });


  }, []);

  
  

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();

      //update on database

      const res = axios({
        method: 'put',
        url: `/wp-json/mrm/v1/workflows/${id}`,
        data: {
          'title': title,
          'workflow_data': JSON.stringify(flow),
          'global_state' : JSON.stringify(global_state),
          'status': status
        }
      });

      //localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance, title]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {

      //get from database workflow_data
      const flow = JSON.parse(workflow_data);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        const newNodes = flow.nodes.map((node) => {return {...node, data: {
          deleteNode,
          deleteEdges,
          resetNode,
          openSettings,}}})
        setNodes(newNodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport, workflow_data]);
  

  const deleteNode = useCallback((nodeID) => {
    setNodes((prevNodes) => {
      return prevNodes.filter((node) => node.id != nodeID);
    });
    deleteEdges(nodeID);
  });

  const deleteEdges = useCallback(
    (nodeID) => {
      setEdges((prevEdges) => {
        return prevEdges.filter(
          (edge) => edge.source != nodeID && edge.target != nodeID
        );
      });
    },
    [setEdges]
  );

  const resetNode = (nodeID) => {
    deleteEdges(nodeID);
  };

  const openSettings = useCallback((nodeID, nodeType) => {
    setOpenSettingsDrawer(true);
    setSelectedNodeID(nodeID);
    setSelectedNodeType(nodeType);
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type: nodeType,
        position,
        data: {
          deleteNode,
          deleteEdges,
          resetNode,
          openSettings,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const allnodes = () => {

    let startNode = 0;

    for (const idx in edges) {
      if (edges[idx].source === "1") {
        startNode = idx;
        for (const jdx in nodes) {
          if (nodes[jdx].id === edges[startNode].target) {
            break;
          }
        }
      }
    }
    let currentNodeId = edges[startNode].target;

    for (const idx in edges) {
      if (edges[idx].source === currentNodeId) {
        currentNodeId = edges[idx].target;
        for (const jdx in nodes) {
          if (nodes[jdx].id === currentNodeId) {
          }
        }
      }
    }
  };

  return (
    <div className="dndflow">
      <CanvasSettingsDrawer
        openSettingsDrawer={openSettingsDrawer}
        setOpenSettingsDrawer={setOpenSettingsDrawer}
        selectedNodeID={selectedNodeID}
        selectedNodeType={selectedNodeType}
      />
      <Sidebar />
      <button
        type="submit"
        style={{ height: "40px", background: "yellow" }}
        onClick={allnodes}
      >
        Automate
      </button>

      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
        >
          <Background gap={10} size={0.5} />
          <Controls />
        </ReactFlow>
      </div>
      <div className="save__controls">
        <button onClick={onSave}>Save</button>
        <button onClick={onRestore}>Restore</button>
      </div>
    </div>
  );
};

export default Canvas;
