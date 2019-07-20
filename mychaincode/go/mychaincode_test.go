package main

import (
	"testing"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var logger = shim.NewLogger("mychaincode_test")

func TestInit(T *testing.T) {
	logger.Info(`Start testing function "Init"`)

	stub := shim.NewMockStub("Test Init", new(Chaincode))

	response := stub.MockInit("001", nil)
	payload := response.GetPayload()

	if response.Status != shim.OK {
		logger.Error(`Response status should 200`)
		T.Error("Response should be 200")
	}
	if payload == nil {
		logger.Error(`Payload should not nil`)
		T.Error("xxx")
	} else if string(payload) != "Init Success" {
		logger.Error(`Payload should be "Init Success"`)
		T.Error(`Payload should be "Init Success"`)
	}
}
func TestQueryNotFond(T *testing.T) {
	logger.Info(`Start testing function "Query"`)

	stub := shim.NewMockStub("Test query", new(Chaincode))

	response := stub.MockInvoke("001", [][]byte{[]byte("query"), []byte("std|59070174")})

	if response.GetStatus() != shim.ERROR {
		logger.Error("Response status should be 500")
		T.Error("status should be 500")
	}
	logger.Info("query message:" + response.GetMessage())
}

func TestCreateUser(T *testing.T) {
	logger.Info(`Start testing function "CreateUser"`)

	fnName := "createUser"
	id := "001"
	name := "Test user"
	tel := "0892221111"
	status := "false"
	fnAndAgrs := [][]byte{[]byte(fnName),
		[]byte(id),
		[]byte(name),
		[]byte(tel),
		[]byte(status)}

	stub := shim.NewMockStub("Test Create user", new(Chaincode))
	response := stub.MockInvoke("001", fnAndAgrs)

	if response.GetStatus() != shim.OK {
		logger.Error("Response status should 200")
		T.Error("Response status should 200")
	}
	if response.GetPayload() == nil {
		logger.Error(`Payload should not be nil`)
		T.Error(`Payload should not be nil`)
	}
}

func TestCreateWallet(T *testing.T) {
	logger.Info(`Start testing function "CreateWallet"`)

	fnName := "createWallet"
	name := "testWallet"
	money := "5000"
	owner := "testUser"
	fnAndAgrs := [][]byte{[]byte(fnName),
		[]byte(name),
		[]byte(money),
		[]byte(owner)}

	stub := shim.NewMockStub("Test Create wallet", new(Chaincode))
	response := stub.MockInvoke("001", fnAndAgrs)

	if response.GetStatus() != shim.OK {
		logger.Error("Response status should be 200 (OK)")
		T.Error("Response is nil")
	}
	if response.GetPayload() == nil {
		logger.Error(`Payload should not be nil`)
		T.Error(`Payload should not be nil`)
	}
}
