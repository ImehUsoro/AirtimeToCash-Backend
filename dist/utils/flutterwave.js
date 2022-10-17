"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3/transfers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(String(process.env.FLUTTERWAVE_PUBLIC_KEY), String(process.env.FLUTTERWAVE_SECRET_KEY));
flw.Transfers.initiate(
// {
//   account_bank: '044',
//   account_number: '0690000031',
//   amount: 100,
//   currency: 'NGN',
//   narration: 'Test Transfer',
//   reference: 'MC-' + Date.now(),
//   callback_url: 'https://webhook.site/7b8e9b0b-7f9a-4b0f-8c6a-6c6c6c6c6c6c',
//   debit_currency: 'NGN',
// }
{
    account_bank: '044',
    account_number: '0690000040',
    amount: 5500,
    narration: 'Akhlm Pstmn Trnsfr xx007',
    currency: 'NGN',
    reference: 'akhlm-pstmnpyt-rfxx007_PMCKDU_1',
    callback_url: 'https://www.flutterwave.com/ng/',
    debit_currency: 'NGN',
})
    .then((response) => {
    // console.log(response);
})
    .catch((error) => {
    // console.log(error);
});
exports.default = flw;
// export const flutterwave = axios.create({
//   baseURL: FLUTTERWAVE_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
//   },
// });
// https://api.flutterwave.com/v3/transfers
//# sourceMappingURL=flutterwave.js.map