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

app.get("/", async (req, res) => {
  try {
    const beacon = process.env.BEACON;
    const chain = "0x1";

    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: beacon,
        chain,
      });

    const result = response.toJSON().result;

    result.map(async (item) => {
      const check = await Deposit.findOne({ blockNumber: item.block_number });
      if (!check) {
        await Deposit.create({
          blockNumber: item.block_number,
          blockTimestamp: item.block_timestamp,
          fee: item.gas_price,
          hash: item.hash,
          pubkey: item.decoded_call.params[0].value,
        });
      }
    });

    res.status(200).json(response);
  } catch (e) {
    console.log(`Something Went Wrong ${e}`);
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
