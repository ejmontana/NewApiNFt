var MAX_SUPPLY = null
const CONTRACT_ADDRESS = "0xf76D572b7cAd7DC379FE9a480DFCDf56713Fda5b" 
const PORT = 81
const IS_REVEALED = true
const UNREVEALED_METADATA = {
  "name":"Underworld Weirdos",
  "description":"???",
  "image":"https://weirdometada.com/unrevealed/hidden.gif",
  "attributes":[{"???":"???"}]
}

const fs = require('fs')
const express = require('express')
const Web3 = require('web3')
require('dotenv').config()
const abi = require('../Contract.json').abi
const Contract = require('web3-eth-contract')
Contract.setProvider(process.env.RINKEBY_RPC_URL)
const contract = new Contract(abi, CONTRACT_ADDRESS)
var cors = require('cors')
const app = express()
app.use(cors())
app.get('/', (req, res) => res.send('Welcome to Weirdo API'));
app.use(express.static(__dirname + 'public'))
app.use('/unrevealed', express.static(__dirname + '/unrevealed'));

async function initAPI() {
  MAX_SUPPLY = 6666
  console.log("MAX_SUPPLY is: " + MAX_SUPPLY)
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  })
}
async function serveMetadata(res, nft_id) {
  var token_count = parseInt(await contract.methods.totalSupply().call())
  //console.log(token_count)
  let return_value = {}
  if(nft_id < 0)
  {
    
    return_value = {error: "NFT ID must be greater than 0"}
  }else if(nft_id >= MAX_SUPPLY)
  {
    return_value = {error: "NFT ID must be lesser than max supply"}
  }else if (nft_id > token_count)
  {

    return_value = UNREVEALED_METADATA
  }else
  {
    return_value = fs.readFileSync("./metadata/" + nft_id + '.json').toString().trim()
  }
  res.send(return_value)
}

app.get('/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(isNaN(req.params.id))//in not number
  {
    res.send(UNREVEALED_METADATA)    
  }
  else if(!IS_REVEALED)
  {
    res.send(
      )
  }else
  {
    serveMetadata(res, req.params.id)
  }
})

initAPI()
