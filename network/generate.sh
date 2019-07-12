#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}

# channel name
CHANNEL_NAME=mychannel
CHANNEL_1=mychannel-1
CHANNEL_2=mychannel-2

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# 1.generate crypto material
# เรียกใช้ไฟล์ cypto-config.yml
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# 2.generate genesis block for orderer
# เรียกใช้ไฟล์ configtx.yaml
# เป็นการสร้าง block แรกใน network
configtxgen -profile ThreeOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
# สำหรับแต่ละ channel
configtxgen -profile Org1Org2Channel -outputCreateChannelTx ./config/${CHANNEL_1}.tx -channelID $CHANNEL_1
configtxgen -profile Org2Org3Channel -outputCreateChannelTx ./config/${CHANNEL_2}.tx -channelID $CHANNEL_2
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi


# generate anchor peer transaction
# ในแต่ละ channel

# anchor peer for channel_1
configtxgen -profile Org1Org2Channel -outputAnchorPeersUpdate ./config/Org1MSPanchors_c1.tx -channelID $CHANNEL_1 -asOrg Org1MSP
configtxgen -profile Org1Org2Channel -outputAnchorPeersUpdate ./config/Org2MSPanchors_c1.tx -channelID $CHANNEL_1 -asOrg Org2MSP

# anchor peer for channel_2
configtxgen -profile Org2Org3Channel -outputAnchorPeersUpdate ./config/Org2MSPanchors_c2.tx -channelID $CHANNEL_2 -asOrg Org2MSP
configtxgen -profile Org2Org3Channel -outputAnchorPeersUpdate ./config/Org3MSPanchors_c2.tx -channelID $CHANNEL_2 -asOrg Org3MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi
