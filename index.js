import core from "@actions/core";
import * as github from "@actions/github";
import GitHubProject from "github-project";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const number = Number(core.getInput("number"));
    const token = core.getInput("token");
    const id = core.getInput("node_id");
    const iterationField = core.getInput("iteration-field"); // name of the iteration field
    const newiterationType = core.getInput("new-iteration"); // current or next
    const isIssue = true;
    console.log("id:", id);
    const project = new GitHubProject({
      owner,
      number,
      token,
      fields: { iteration: iterationField },
    });

    const projectData = await project.getProperties();
    console.log(projectData);
    const iterations = projectData.fields.iteration.optionsByValue;

    const iterationTitles = Object.keys(iterations);
    const currentIterationTitle = iterationTitles.reduce((a, b) =>
      a < b ? a : b
    );

    let nextIterationTitle = "";

    if (iterationTitles.length > 1) {
      nextIterationTitle = iterationTitles
        .filter((i) => i !== currentIterationTitle)
        .reduce((a, b) => (a < b ? a : b));
    }

    //const { issue } = context.payload;
    const node_id = id;

    // add to current iteration
    await project.items.add(node_id, {
      iteration: currentIterationTitle,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
