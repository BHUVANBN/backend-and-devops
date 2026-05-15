import express from 'express'
import client from 'prom-client'

const app = express()

// Collect default metrics like CPU, memory, etc.
const collectDefaultMetrics = client.collectDefaultMetrics; 
collectDefaultMetrics({register: client.register}); // Register the metrics

async function doSomeHeavyTask() {
    const startTime = Date.now();
    
    // Random delay between 500ms and 2500ms
    const delay = Math.floor(Math.random() * 2000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Randomly throw an error (20% chance)
    if (Math.random() < 0.2) {
        throw new Error("Heavy task failed unexpectedly!");
    }

    return Date.now() - startTime;
}

app.get("/", (req, res) => {
    return res.json({ message: "hello from server" })
})
app.get("/slow", async (req, res) => {
    try {
        const timetaken = await doSomeHeavyTask();
        return res.json({
            status: "Success",
            message: `Heavy task completed in ${timetaken} ms`
        })
    } catch (error) {
        return res.status(500).json({ status: "Error", error: "internal server error" })
    }
})
app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    res.send(await client.register.metrics()); // Send the metrics
})
app.listen(3000, () => {
    console.log("server is running on port 3000")
})