import * as core from '@actions/core';
import * as github from '@actions/github';
import styles from 'ansi-styles';

async function run() {
  try {
    const allowedIds = core.getInput('whitelisted-github-ids');
    if (!allowedIds || allowedIds === "") {
      throw new Error(`Input ${styles.italic.open}whitelisted-github-ids${styles.italic.close} is missing or empty.`)
    }

    core.setSecret('token')
    const token = core.getInput('token')
    if (!token) {
      throw new Error(`Input ${styles.italic.open}token${styles.italic.close} is missing.`)
    }

    const allowedUserIds = allowedIds.split(',');

    const octokit = github.getOctokit(token, {
      userAgent: "aitsys-actions"
    });

    const username = github.context.actor;

    const { data: user } = await octokit.rest.users.getByUsername({
      username: username,
    });

    const userId = user.id.toString();

    if (allowedUserIds.includes(userId)) {
      core.notice(`${styles.green.open}User ${styles.bold.open}${userId}${styles.bold.close} authorized this workflow run.${styles.green.close}`);
    } else {
      throw new Error(`User ${styles.bold.open}${userId}${styles.bold.close} is not authorized to run this workflow. Aborting`);
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();