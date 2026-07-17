import PQueue from "p-queue";

export const apiQueue = new PQueue({
  concurrency: 2,
  interval: 1000,
  intervalCap: 3,
});
