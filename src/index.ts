#! /usr/bin/env node

import { program, OptionValues } from 'commander';
import { CronJob } from 'cron';
import { ThreadsAPI } from 'threads-api';
import boxen from 'boxen';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

program
  .name('yearsprogress')
  .description(
    "Meta's Threads bot that posts current year progress bar updates",
  )
  .version('1.1.0');

program
  .requiredOption('-u, --username <username>', 'threads username')
  .requiredOption('-p, --password <password>', 'threads password')
  .option('-f, --force', 'force post the current progress', false)
  .option('-d, --debug', 'run in local, console.log only mode', false);

interface ProgressBarOptions {
  width: number;
  percent: number;
  complete?: string;
  incomplete?: string;
}

interface UpdateMessageOptions {
  emoji: string;
}

function percentOfYear(day: dayjs.Dayjs) {
  const dayOfYear = day.dayOfYear();
  const daysInYear = day.isLeapYear() ? 366 : 365;
  return Math.floor((100 * dayOfYear) / daysInYear);
}

function renderProgressBar(options: ProgressBarOptions) {
  const { percent, width, complete = '▓', incomplete = '░' } = options;

  const completedWidth = Math.floor(width * (percent / 100));
  const remainingWidth = width - completedWidth;

  const completedBar = complete.repeat(completedWidth);
  const remainingBar = incomplete.repeat(remainingWidth);

  const progressBar = completedBar + remainingBar;

  return progressBar;
}

function createYearUpdateMessage(
  day: dayjs.Dayjs,
  options: UpdateMessageOptions,
) {
  const year = day.year();
  const percent = percentOfYear(day);

  const caption = `${options.emoji} ${year} is ${percent}% complete`;

  const progressBar = renderProgressBar({
    width: 16,
    percent: percent,
  });

  return `${caption}\n${progressBar}`;
}

async function postToThreads(botOptions: OptionValues, message: string) {
  if (!botOptions.debug) {
    const threadsAPI = new ThreadsAPI({
      username: botOptions.username,
      password: botOptions.password,
    });

    await threadsAPI.publish({
      text: message,
    });
  }

  console.log(
    boxen(message, {
      padding: 1,
      margin: 1,
      borderColor: botOptions.debug ? 'blue' : 'green',
      borderStyle: 'round',
      title: dayjs().format('MMM M, YYYY, h:mm A'),
      titleAlignment: 'center',
    }),
  );
}

const botOptions = program.parse().opts();
const botStart = dayjs();

if (botOptions.force) {
  const message = createYearUpdateMessage(botStart, { emoji: '📅' });

  postToThreads(botOptions, message);
}

new CronJob(
  '0 0 0 * * *',
  async function () {
    const day = dayjs();
    const dayBefore = day.subtract(1, 'day');

    if (!(botOptions.force && day.dayOfYear() == botStart.dayOfYear())) {
      if (percentOfYear(day) != percentOfYear(dayBefore)) {
        const message = createYearUpdateMessage(day, { emoji: '📅' });

        postToThreads(botOptions, message);
      }
    }
  },
  null,
  true,
  'Etc/GMT',
);
