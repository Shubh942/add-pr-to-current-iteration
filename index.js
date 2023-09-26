import core from "@actions/core";
import * as github from "@actions/github";
import GitHubProject from "github-project";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const number = Number(core.getInput("number"));
    const token = core.getInput("token");
    const iterationField = core.getInput("iteration-field"); // name of the iteration field
    const newiterationType = core.getInput("new-iteration"); // current or next

    const { pull_request: event } = github.context.payload;
    const { node_id } = event;
    const project = new GitHubProject({
      owner,
      number,
      token,
      fields: { iteration: iterationField },
    });

    const projectData = await project.getProperties();
    core.info(JSON.stringify(projectData));

    const currentIteration =
      projectData.fields.iteration.configuration.iterations[0];
    const nextIteration =
      projectData.fields.iteration.configuration.iterations[1];

    const newIteration =
      newiterationType === "current" ? currentIteration : nextIteration;

    await project.items.add(node_id, { iteration: newIteration.title });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
