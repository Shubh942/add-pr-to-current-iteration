import core from "@actions/core";
import * as github from "@actions/github";
import GitHubProject from "github-project";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const number = Number(core.getInput("number"));
    const token = core.getInput("token");
    // const id = github.event.issue.node_id;

    const iterationField = core.getInput("iteration-field"); // name of the iteration field
    const newiterationType = core.getInput("new-iteration"); // current or next
    const isIssue = true;
    // console.log("id:", id);
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
    if (newiterationType == "next") {
      const data = await project.items.list();
      console.log("data:", data);

      for (const element of data) {
        if (
          element.fields.status == "Todo" ||
          element.fields.status == "In Progress" ||
          element.fields.status == "Planned" ||
          element.fields.status == "In Review"
        ) {
          if (
            element.fields.iteration != null &&
            iterations[element.fields.iteration] != null
          ) {
            const itr = element.fields.iteration;
            const node_id = element.content.id;
            // console.log("value: ", iterations[itr]);
            const startTime = new Date(iterations[itr].startDate).getTime();
            const time =
              startTime + iterations[itr].duration * 24 * 60 * 60 * 1000;
            const current = Date.now();
            if (time < current) {
              newiterationType = "current";
              const iterationTitle = !nextIterationTitle
                ? currentIterationTitle
                : newiterationType === "current"
                ? currentIterationTitle
                : nextIterationTitle;

              //const { issue } = context.payload;

              // add to current iteration
              await project.items.add(node_id, {
                iteration: iterationTitle,
              });
            }
          } else {
            const id = element.content.id;
            newiterationType = "current";
            const iterationTitle = !nextIterationTitle
              ? currentIterationTitle
              : newiterationType === "current"
              ? currentIterationTitle
              : nextIterationTitle;

            //const { issue } = context.payload;

            const node_id = id;

            // add to current iteration
            await project.items.add(node_id, {
              iteration: iterationTitle,
            });
          }
        }
      }
      return;
    } else {
      const id = github.context.payload.issue.node_id;
      newiterationType = "current";
      const iterationTitle = !nextIterationTitle
        ? currentIterationTitle
        : newiterationType === "current"
        ? currentIterationTitle
        : nextIterationTitle;

      //const { issue } = context.payload;

      const node_id = id;

      // add to current iteration
      await project.items.add(node_id, {
        iteration: iterationTitle,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
