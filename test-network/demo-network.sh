./network.sh down
./network.sh up createChannel -ca -s couchdb

 export PATH=${PWD}/../bin:$PATH
 export FABRIC_CFG_PATH=$PWD/../config/

 peer lifecycle chaincode package demo.tar.gz --path ../niu/chaincode-javascript/ --lang node --label demo_1.0
 export CORE_PEER_TLS_ENABLED=true
 export CORE_PEER_LOCALMSPID="Org1MSP"
 export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
 export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
 export CORE_PEER_ADDRESS=localhost:7051
 peer lifecycle chaincode install demo.tar.gz

 export CORE_PEER_LOCALMSPID="Org2MSP"
 export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
 export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
 export CORE_PEER_ADDRESS=localhost:9051
 peer lifecycle chaincode install demo.tar.gz

 peer lifecycle chaincode queryinstalled
 export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid demo.tar.gz) && echo $CC_PACKAGE_ID
 peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name demo --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

 export CORE_PEER_LOCALMSPID="Org1MSP"
 export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
 export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
 export CORE_PEER_ADDRESS=localhost:7051
 peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name demo --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

 peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name demo --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json


 peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name demo --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
 peer lifecycle chaincode querycommitted --channelID mychannel --name demo --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
