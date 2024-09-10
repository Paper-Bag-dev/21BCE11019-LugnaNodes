import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    blockNumber: Number,
    blockTimestamp: Date,
    fee: Number,
    hash: String,
    pubkey: String
});

depositSchema.index({ blockTimestamp: -1 }); 

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;