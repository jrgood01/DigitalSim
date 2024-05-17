const getVal = (simulationStateRef, uuid, outputTerminal) => {
    const element = simulationStateRef.current[uuid];
    if (element.type === 'wire') {
      return getSimulationStateWire(simulationStateRef, uuid, outputTerminal);
    } else {
      return getSimulationStateElement(simulationStateRef, uuid, outputTerminal);
    }
};

const getSimulationStateWire = (simulationStateRef, uuid, outputTerminal) => {
    const element = simulationStateRef.current[uuid];
    if (element.updated) {
      return element.wireVal;
    }
    
    if (element.inputs.length === 0) {
      element.wireVal = 3;
      element.updated = true;
      return element.outputVals[outputTerminal];
    } else if (element.inputs.length === 1) {
      const val = getSimulationStateElement(simulationStateRef, element.inputs[0].elementUuid, element.inputs[0].terminal);
      element.wireVal = val;
      element.updated = true;
      return val;
    } else {
      const initVal = getSimulationStateElement(simulationStateRef, element.inputs[0].elementUuid, element.inputs[0].terminal);
      for (let i = 1; i < element.inputs.length; i++) {
        const val = getSimulationStateElement(simulationStateRef, element.inputs[i].elementUuid, element.inputs[i].terminal);
        if (val !== initVal) {
          element.wireVal = 2;
          element.updated = true;
          return 2;
        }
      }
      element.wireVal = initVal;
      element.updated = true;
      return initVal;
    }
};
  
const getSimulationStateElement = (simulationStateRef, uuid, outputTerminal) => {
    const element = simulationStateRef.current[uuid];
    if (element.type === 'wire') {
      return getSimulationStateWire(simulationStateRef, uuid, outputTerminal);
    } else {
      if (element.updated) {
        return element.outputVals[outputTerminal];
      }
      
      const inputMap = [];

      for (let i = 0; i < element.maxInputs; i++) {
        inputMap.push(3);
      }

      element.outputVals = []

      for (const [terminal, wire] of Object.entries(element.inputMap)) {
        const val = getSimulationStateWire(simulationStateRef, wire.uuid, wire.outputs[0].terminal);
        inputMap[terminal] = val;
      }

    
     //element.outputVals = GetElementLogic(element.type, inputMap, element.properties);
      //element.updated = true;
    
      
      if (element.type === 'and') {
        let val = 1;
        for (const [terminal, wire] of Object.entries(element.inputMap)) {
          const wireVal = getSimulationStateWire(simulationStateRef, wire.uuid, wire.outputs[0].terminal);
          if (wireVal === 0) {
            val = 0;
            break;
          }
        }
        element.outputVals[outputTerminal] = val;
        element.updated = true;
        return val;
      } else if (element.type === 'or') {
        let val = 0;
        for (const [terminal, wire] of Object.entries(element.inputMap)) {
          const wireVal = getSimulationStateWire(simulationStateRef, wire.uuid, wire.outputs[0].terminal);
          if (wireVal === 1) {
            val = 1;
            break;
          }
        }
        element.outputVals[outputTerminal] = val;
        element.updated = true;
        return val;
      } else if (element.type === 'const') {
        element.updated = true;
        return element.properties.state;
      } else {
        console.error(`Invalid element type: ${element.type}`);
      }
      
    }
};

const GetElementLogic = (elementType, inputs, properties) => {
    if (elementType === 'and') {
      
      let val = 1;
      for (const input of inputs) {
        if (input === 0) {
          val = 0;
          break;
        } else if (input === 3 || input === 2) {
          val = 2;
          break
        }
      }
      console.log(`AND gate with inputs ${inputs} and output ${val}`)
      return [val];
    }
    if (elementType === 'or') {
      let val = 0;
      for (const input of inputs) {
        if (input === 1) {
          val = 1;
          break;
        } else if (input === 3 || input === 2) {
          val = 3;
          break
        }
      }
      return [val];
    }

    if (elementType === 'const') {
      return [properties.state];
    }
}

export { getVal }