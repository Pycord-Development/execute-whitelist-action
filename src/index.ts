import * as core from '@actions/core';
import * as github from '@actions/github';

try {
  const allowedIds = core.getInput('whitelisted-github-ids');
  if (allowedIds === undefined || allowedIds === "") {
    throw new Error("Input 'whitelisted-github-ids' was empty.")
  }

  const allowedUserIds = allowedIds.split(',');

  const userId = github.context.actor;

  if (allowedUserIds.includes(userId)) {
    console.log(`User ${userId} is allowed to run this workflow.`);
  } else {
    throw new Error(`User ${userId} is not authorized to run this workflow.`);
  }
} catch (error: any) {
  core.setFailed(error.message);
}
