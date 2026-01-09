import PQueue from "p-queue";

const queue = new PQueue({
  concurrency: 5, // 5 parallel API calls
  intervalCap: 50, // max 50 calls
  interval: 1000, // per second
});

export default queue;
