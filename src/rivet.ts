import { runGraphInFile, startDebuggerServer, NodeDatasetProvider, RunGraphOptions } from '@ironclad/rivet-node';

// Create a delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Define the main run function
async function runGraph(debuggerServer, datasetProvider, project, graph, openAiKey) {
  try {
    let result = await runGraphInFile(project, {
      graph: graph,
      remoteDebugger: debuggerServer,
      inputs: {
        "prompt": "Please write me a short poem about a dog."
      },
      context: {},
      externalFunctions: {},
      onUserEvent: {},
      openAiKey: openAiKey,
      datasetProvider: datasetProvider
    } as RunGraphOptions);

    console.log(result.response.value);
  } catch (error) {
    console.error("Error running graph:", error);
  }
}

// Define an async function to handle setup and loop
async function setupAndRun() {
  const debuggerServer = await startDebuggerServer({});
  const project = "./example.rivet-project";
  const graph = "example-graph";
  const openAiKey = process.env.OPEN_API_KEY;  // Get OPEN_API_KEY from environment

  const datasetOptions = {
    save: true,
    filePath: project,
  };
  const datasetProvider = await NodeDatasetProvider.fromProjectFile(project, datasetOptions);

  while (true) {
    await runGraph(debuggerServer, datasetProvider, project, graph, openAiKey);
    await delay(10000); // Delay for 1 minute
  }
}

// Start the setup and loop
setupAndRun().catch(console.error);
