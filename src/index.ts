import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const allowedIds = core.getInput('whitelisted-github-ids');
    if (allowedIds === undefined || allowedIds === "") {
      throw new Error("Input 'whitelisted-github-ids' was empty.")
    }

    const allowedUserIds = allowedIds.split(',');

    console.log(`First user id: ${allowedUserIds[0]}`)

    const octokit = github.getOctokit(core.getInput('token'));

    const username = github.context.actor;

    console.log(`Username: ${username}`)

    const { data: user } = await octokit.rest.users.getByUsername({
      username: username,
    });

    console.log(`User id: ${user.id}`)

    const userId = user.id.toString();

    if (allowedUserIds.includes(userId)) {
      console.log(`User ${userId} is allowed to run this workflow.`);
    } else {
      throw new Error(`User ${userId} is not authorized to run this workflow.`);
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();