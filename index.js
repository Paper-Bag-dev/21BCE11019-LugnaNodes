import express from "express";
import { config } from "dotenv";
import Moralis from "moralis";
import cors from "cors";
import connectDb from "./Db/Db.js";
import Deposit from "./models/Deposit.js";

config({
  path: ".env",
});

const app = express();
connectDb(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

// Polling function to fetch transactions and update the database
const pollTransactions = async () => {
  try {
    console.log("Polling for new transactions...");
    const beacon = process.env.BEACON;
    const chain = "0x1";

    // Fetch transactions from Moralis API
    const response = await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
      address: beacon,
      chain,
    });

    console.log("API Response:", response);

    const result = response.toJSON().result;

    console.log(`Number of transactions received: ${result.length}`);

    for (const item of result) {
      console.log("Processing transaction:", item.block_number);
      const check = await Deposit.findOne({ blockNumber: item.block_number });

      // Create new record in the database after checking it exists or not
      if (!check) {
        await Deposit.create({
          blockNumber: item.block_number,
          blockTimestamp: item.block_timestamp,
          fee: item.gas_price,
          hash: item.hash,
          pubkey: item.decoded_call.params[0].value,
        });
        console.log(`New transaction added: ${item.hash}`);
      } else {
        console.log(`Transaction already exists: ${item.block_number}`);
      }
    }

    console.log("Polling completed successfully");
    return response;
  } catch (e) {
    console.error("Polling Error:", e);
  }
};

const POLLING_INTERVAL = 10 * 1000;
setInterval(pollTransactions, POLLING_INTERVAL);

// MAIN Call to INitiate polling and real time fetching
app.get("/", async (req, res) => {
  try {
    const response = await pollTransactions();
    res.status(200).json({ message: "Polling executed successfully" , response});
  } catch (e) {
    console.error("Error during manual polling:", e);
    res.status(400).json({ error: e.message });
  }
});

Moralis.start({
  apiKey: process.env.moralis_api,
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT);
  });
});
