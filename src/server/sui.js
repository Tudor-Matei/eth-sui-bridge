import { spawn } from "child_process";
import express, { json } from "express";

const app = express();
const port = 5000;

app.use(json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/mint", (req, res) => {
  const { packageId, treasuryCapId, amount, walletAddress } = req.body;

  if (!packageId || !treasuryCapId || !walletAddress) {
    return res.status(400).send("Missing required parameters");
  }

  const command = "sui";
  const args = [
    "client",
    "call",
    "--package",
    packageId,
    "--module",
    "ibt",
    "--function",
    "mint",
    "--args",
    treasuryCapId,
    amount,
    walletAddress,
    "--gas-budget",
    "10000000",
  ];

  console.log(args.join(" "));
  const child = spawn(command, args);

  let output = "";
  let errorOutput = "";

  child.stdout.on("data", (data) => {
    output += data.toString();
  });

  child.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  child.on("close", (code) => {
    if (code !== 0) {
      console.error(`Command failed with code ${code}: ${errorOutput}`);
      return res.status(500).json({ error: `Command failed with code ${code}: ${errorOutput}` });
    }
    console.log(`Command output: ${output}`);

    res.json({ message: "Minted Sui tokens successfully." });
  });
});

app.post("/burn", (req, res) => {
  const { packageId, treasuryCapId, coinObjectId } = req.body;

  if (!packageId || !treasuryCapId || !coinObjectId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const command = "sui";
  const args = [
    "client",
    "call",
    "--package",
    packageId,
    "--module",
    "token",
    "--function",
    "burn",
    "--args",
    treasuryCapId,
    coinObjectId,
    "--gas-budget",
    "10000000",
  ];

  const child = spawn(command, args);

  let output = "";
  let errorOutput = "";

  child.stdout.on("data", (data) => {
    output += data.toString();
  });

  child.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  child.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).send(`Command failed with code ${code}: ${errorOutput}`);
    }
    console.log(`Command output: ${output}`);
    res.status(200).json({ message: "Burn successful" });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
