### Etherium Deposit Tracker
Requirements: POSTMAN, NodeJS and JS.

## Steps to initalize this repo
1. Download this repo or clone it.
2. Create a .env file in backend folder alongside other folders.
3. Add these keys:
    1. moralis_api = "Your Key"
    2. PORT = 5000
    3. BEACON = 0x00000000219ab540356cBB839Cbe05303d7705Fa
    4. MONGO_URI = "Your Mongo URI"
4. cd to 21BCE11019-LugnaNodes directory.
5. Run command **npm install** followed by **npm run start** to initialize the Node Server.

### How to test?
-
- By calling the http://localhost:5000/ at home route "/" the beacon id would be automatically fetched by 
Moralis API and necessary data would be parsed from the response to make the ETH Deposit Tracker run.
- The Tracked Data is stored in MongoDB parsed in the provided format.
