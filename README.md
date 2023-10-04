# Add PR to Current or Next Iteration

Automatically adds pull requests to the current or next iteration of your [GitHub project](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) with this [Github Action](https://github.com/features/actions).

## Example

```yml
on:
  pull_request:
    branches: [main]

jobs:
  move-to-next-iteration:
    name: Move to current or next iteration
    runs-on: ubuntu-latest

    steps:
    - uses: Kpoke/move-to-next-iteration@master
      with:
        owner: OrgName
        number: 1
        token: ${{ secrets.PROJECT_PAT }}
        iteration-field: Iteration
        new-iteration: current
```

## Inputs
#### owner
The account name of the GitHub organization.

#### number
Project number as you see it in the URL of the project.

#### token
Personal access token or an OAuth token. the `project` scope is required.

#### iteration-field
The name of your iteration field.

#### new-iteration
Should be `current` or `next`.

## Sources

This action was made possible thanks to https://github.com/gr2m/github-project.
