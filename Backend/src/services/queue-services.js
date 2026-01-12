import PQueue from "p-queue";

export const apiQueue = new PQueue({
  interval: 1000, // 1 second
  intervalCap: 10, // max 10 jobs per second
});
