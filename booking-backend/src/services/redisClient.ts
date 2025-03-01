import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

export  const clearBookingsCache = async (): Promise<void> => {
    try {
      const keys = await redisClient.keys("bookings:*"); // Get all booking keys
      if (keys.length > 0) {
        await redisClient.del(keys); // Delete keys
        console.log("Cleared Redis cache for keys:", keys);
      } else {
        console.log("No booking keys found in Redis.");
      }
    } catch (error) {
      console.error("Error clearing bookings cache:", error);
    }
  };


