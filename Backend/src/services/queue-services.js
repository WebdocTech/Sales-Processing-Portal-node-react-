import PQueue from "p-queue";

export const apiQueue = new PQueue({
  concurrency: 5,
  interval: 1000,
  intervalCap: 5,
});
